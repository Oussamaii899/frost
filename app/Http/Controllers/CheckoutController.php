<?php

namespace App\Http\Controllers;

use App\Mail\OrderSuccess;
use App\Models\Order;
use App\Models\Product;
use App\Models\Stock;
use App\Services\PayPalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{

    public function createOrder(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.slug' => 'required|string|distinct',
            'cart.*.amount' => 'required|integer|min:1',
        ]);

        $cart = $request->input('cart', []);
        $userId = auth()->id();

        try {
            $order = DB::transaction(function () use ($cart, $userId) {

                $cart = collect($cart)->sortBy('slug')->values()->all();

                $total = 0;
                $items = [];
                $reservedStockIdsByProduct = []; 

                foreach ($cart as $cartItem) {
                    $slug = (string) $cartItem['slug'];
                    $amount = (int) $cartItem['amount'];

                    $product = Product::where('slug', $slug)
                        ->lockForUpdate()
                        ->first();

                    if (!$product) {
                        throw new \InvalidArgumentException("Product not found: {$slug}");
                    }

                    $stocks = Stock::where('product_id', $product->id)
                        ->where('is_taken', 0)
                        ->whereNull('order_id') 
                        ->orderBy('id')
                        ->limit($amount)
                        ->lockForUpdate()
                        ->get();

                    if ($stocks->count() !== $amount) {
                        throw new \InvalidArgumentException($product->name . " is out of stock");
                    }

                    $reservedStockIdsByProduct[$product->id] = $stocks->pluck('id')->all();

                    if ((int) $product->stock < $amount) {
                        throw new \InvalidArgumentException($product->name . " is out of stock");
                    }
                    $product->decrement('stock', $amount);

                    $items[] = [
                        'product_id' => $product->id,
                        'amount'     => $amount,
                        'price'      => $product->price,
                    ];

                    $total += ($product->price * $amount);
                }

                if ($total <= 0) {
                    throw new \InvalidArgumentException("Invalid order total.");
                }

                $order = Order::create([
                    'order_id' => 'FF-' . strtoupper(Str::random(10)),
                    'user_id'  => $userId,
                    'status'   => 'Pending',
                    'total'    => $total,
                ]);

                foreach ($items as $item) {
                    $order->products()->attach($item['product_id'], [
                        'amount' => $item['amount'],
                        'price'  => $item['price'],
                    ]);
                }

                // Bind reserved stock rows to the order (and mark taken)
                foreach ($reservedStockIdsByProduct as $productId => $stockIds) {
                    Stock::whereIn('id', $stockIds)->update([
                        'is_taken'   => 1,
                        'order_id'   => $order->id,
                        'user_id'    => $userId,
                        'updated_at' => now(),
                    ]);
                }

                return $order;
            });

            return response()->json([
                'order_id' => $order->order_id,
                'total'    => $order->total,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Throwable $e) {
            Log::error($e);
            return response()->json(['error' => 'Unable to create order'], 500);
        }
    }

    public function createPayPalOrder(Request $request, PayPalService $paypal)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'order_id' => 'required|string',
        ]);

        $order = Order::where('order_id', $request->order_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($order->status !== 'Pending') {
            return response()->json(['error' => 'Invalid order state'], 400);
        }

        // Move to processing while creating PayPal order (we revert on failure)
        $order->status = 'Processing';
        $order->save();

        try {
            $ppOrder = $paypal->createOrder($order->total);
        } catch (\Throwable $e) {
            Log::error($e);

            $order->status = 'Pending';
            $order->save();

            return response()->json(['error' => 'Unable to create PayPal order'], 502);
        }

        if (!isset($ppOrder['id'])) {
            $order->status = 'Pending';
            $order->save();

            return response()->json(['error' => 'Unable to create PayPal order'], 502);
        }

        $order->paypal_order_id = $ppOrder['id'];
        $order->save();

        return response()->json($ppOrder);
    }

    public function capturePayPal(Request $request, PayPalService $paypal)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'paypal_order_id' => 'required|string',
        ]);

        Log::info('capturePayPal request', $request->all());

        $paypalOrderId = $request->paypal_order_id;

        $order = Order::where('paypal_order_id', $paypalOrderId)
            ->where('user_id', auth()->id())
            ->with(['products', 'stock', 'user'])
            ->firstOrFail();

        // Idempotency: if already finalized, just return current state
        if ($order->status === 'Completed') {
            return response()->json([
                'message' => 'Order already completed',
                'order'   => $order,
            ]);
        }
        if ($order->status === 'Cancelled') {
            return response()->json([
                'error' => 'Order is cancelled',
                'order' => $order,
            ], 400);
        }

        try {
            $result = $paypal->captureOrder($paypalOrderId);
        } catch (\Throwable $e) {
            Log::error($e);

            return response()->json([
                'error' => 'Unable to capture PayPal order',
            ], 502);
        }

        Log::info('capturePayPal result', is_array($result) ? $result : ['result' => $result]);

        $ppTopStatus = $result['status'] ?? null;
        $ppCaptureStatus = $result['purchase_units'][0]['payments']['captures'][0]['status'] ?? null;

        // Prepare payment log payload (safe JSON encoding)
        $paymentLog = [
            'order_id'        => $order->id,
            'payment_id'      => $result['id'] ?? null,
            'payment_source'  => json_encode($result['payment_source'] ?? null),
            'purchase_units'  => json_encode($result['purchase_units'] ?? null),
            'payer'           => json_encode($result['payer'] ?? null),
            'links'           => json_encode($result['links'] ?? null),
            'created_at'      => now(),
            'updated_at'      => now(),
        ];

        // SUCCESS: Completed + capture Completed
        if ($ppTopStatus === 'COMPLETED' && $ppCaptureStatus === 'COMPLETED') {
            $order->status = 'Completed';
            $order->is_paid = 1;
            $order->save();

            DB::table('payment_logs')->insert(array_merge($paymentLog, [
                'status' => 'Completed',
            ]));

            // Ensure stocks are loaded for the email/template
            $order->loadMissing(['stock', 'products', 'user']);

            try {
                Mail::to($order->user->email)->send(new OrderSuccess($order));
            } catch (\Throwable $e) {
                Log::error('Mail error: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Payment successful',
                'order'   => $order,
                'storedData' => array_merge($paymentLog, [
                    'order_id' => $order->order_id, // for debugging convenience
                    'status'   => 'Completed',
                ]),
            ]);
        }

        // PENDING: PayPal order completed but capture pending (don’t deliver yet)
        if ($ppTopStatus === 'COMPLETED' && $ppCaptureStatus === 'PENDING') {
            $order->status = 'Processing';
            $order->is_paid = 0;
            $order->save();

            DB::table('payment_logs')->insert(array_merge($paymentLog, [
                'status' => 'Pending',
            ]));

            return response()->json([
                'message' => 'Payment pending',
                'order'   => $order,
                'storedData' => array_merge($paymentLog, [
                    'order_id' => $order->order_id,
                    'status'   => 'Pending',
                ]),
            ]);
        }

        // FAILURE: release reserved stock + restore cached product stock
        DB::transaction(function () use ($order) {
            $order->refresh();

            if ((int) ($order->is_stock_restored ?? 0) === 0) {
                $this->releaseStockForOrder($order);
                $order->is_stock_restored = 1;
            }

            $order->status = 'Cancelled';
            $order->is_paid = 0;
            $order->save();
        });

        DB::table('payment_logs')->insert(array_merge($paymentLog, [
            'status' => 'Failed',
        ]));

        return response()->json([
            'error' => 'Payment failed',
            'order' => $order->fresh(['products', 'stock']),
            'paypal_status' => [
                'status' => $ppTopStatus,
                'capture_status' => $ppCaptureStatus,
            ],
        ], 400);
    }

    public function cancelOrder(Request $request)
    {
        if (!auth()->check()) {
            // keep existing behavior: redirect for web, json for api
            return $this->respond($request, ['error' => 'Unauthenticated'], 401, '/login', 'error', 'Unauthenticated');
        }

        $request->validate([
            'order_id' => 'required|string',
        ]);

        $order = Order::with(['products', 'stock'])
            ->where('order_id', $request->order_id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$order) {
            return $this->respond($request, ['error' => 'Order not found'], 404, null, 'error', 'Order not found');
        }

        if (in_array($order->status, ['Completed', 'Cancelled'], true)) {
            return $this->respond(
                $request,
                ['error' => 'Order is already ' . $order->status],
                400,
                null,
                'error',
                'Order is already ' . $order->status
            );
        }

        DB::transaction(function () use ($order) {
            $order->refresh();

            if ((int) ($order->is_stock_restored ?? 0) === 0) {
                $this->releaseStockForOrder($order);
                $order->is_stock_restored = 1;
            }

            $order->status = 'Cancelled';
            $order->is_paid = 0;
            $order->save();
        });

        return $this->respond(
            $request,
            ['message' => 'Order cancelled successfully', 'order' => $order->fresh(['products', 'stock'])],
            200,
            '/cart',
            'success',
            'Order cancelled successfully'
        );
    }

    /**
     * Utility endpoint for restoring stock for cancelled orders that were not restored.
     * (Useful as a cron/job backstop.)
     */
    public function updateStock()
    {
        $orders = Order::with(['products', 'stock'])
            ->where('status', 'Cancelled')
            ->where('is_stock_restored', 0)
            ->get();

        $count = 0;

        foreach ($orders as $order) {
            DB::transaction(function () use ($order, &$count) {
                $order->refresh();

                if ((int) ($order->is_stock_restored ?? 0) === 1) {
                    return;
                }

                $this->releaseStockForOrder($order);
                $order->is_stock_restored = 1;
                $order->save();

                $count++;
            });
        }

        return response()->json([
            'message' => 'Stock restoration complete',
            'restored_orders' => $count,
        ]);
    }

    /**
     * Releases digital stock rows and restores Product.stock cached counter.
     */
    private function releaseStockForOrder(Order $order): void
    {
        // Release digital stock rows
        Stock::where('order_id', $order->id)->update([
            'is_taken'   => 0,
            'order_id'   => null,
            'user_id'    => null,
            'updated_at' => now(),
        ]);

        // Restore cached product stock counters (if you maintain Product.stock)
        $order->loadMissing('products');

        foreach ($order->products as $product) {
            $qty = (int) ($product->pivot->amount ?? 0);
            if ($qty > 0) {
                $product->increment('stock', $qty);
            }
        }
    }

    /**
     * Returns JSON if request expects JSON, otherwise redirects/back with flash message.
     */
    private function respond(Request $request, array $payload, int $status = 200, ?string $redirectTo = null, string $flashKey = 'success', ?string $flashMessage = null)
    {
        if ($request->expectsJson()) {
            return response()->json($payload, $status);
        }

        $flashMessage = $flashMessage ?? ($payload['message'] ?? $payload['error'] ?? '');

        if ($redirectTo) {
            return redirect($redirectTo)->with($flashKey, $flashMessage);
        }

        return back()->with($flashKey, $flashMessage);
    }
}
