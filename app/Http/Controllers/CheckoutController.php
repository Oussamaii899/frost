<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\PayPalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Mail;
use App\Mail\OrderSuccess;

use App\Models\Setting;

class CheckoutController extends Controller
{
    public function createOrder(Request $request)
    {
        $cart = $request->input('cart', []);
    
        if (empty($cart)) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }
    
        try {
            $order = DB::transaction(function () use ($cart) {
                $total = 0;
                $items = [];

                foreach ($cart as $item) {
                    $amount = (int) ($item['amount'] ?? 0);

                    if ($amount <= 0) {
                        throw new \InvalidArgumentException("Invalid quantity for item.");
                    }

                    $product = Product::where('slug', $item['slug'])
                        ->lockForUpdate()
                        ->first();

                    if (!$product) {
                        throw new \InvalidArgumentException("Product not found: " . $item['slug']);
                    }

                    if ($product->stock < $amount) {
                        throw new \InvalidArgumentException($product->name . " is out of stock");
                    }

                    $product->decrement('stock', $amount);

                    $items[] = [
                        'product_id' => $product->id,
                        'amount'     => $amount,
                        'price'      => $product->price,
                    ];

                    $total += $product->price * $amount;
                }

                if ($total <= 0) {
                    throw new \InvalidArgumentException("Invalid order total.");
                }

                if (count($items) !== count(array_unique(array_column($items, 'product_id')))) {
                    throw new \InvalidArgumentException("Duplicate product in cart.");
                }

                if (count($items) !== count($cart)) {
                    throw new \InvalidArgumentException("Invalid cart data.");
                }
                
                $order = Order::create([
                    'order_id' => 'FF-' . strtoupper(Str::random(10)),
                    'user_id'  => auth()->id(),
                    'status'   => 'Pending',
                    'total'    => $total,
                ]);
                Log::info($order);
                foreach ($items as $item) {
                    $order->products()->attach($item['product_id'], [
                        'amount' => $item['amount'],
                        'price'  => $item['price'],
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
        $request->validate([
            'order_id' => 'required|string',
        ]);

        $order = Order::where('order_id', $request->order_id)->firstOrFail();

        if ($order->status !== 'Pending') {
            return response()->json(['error' => 'Invalid order state'], 400);
        }

        $order->status = 'Processing';
        $order->save();

        $ppOrder = $paypal->createOrder($order->total);

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

        $request->validate([
            'paypal_order_id' => 'required|string',
        ]);
        
        
        Log::info($request->all());


        $paypalOrderId = $request->paypal_order_id;

        $order = Order::where('paypal_order_id', $paypalOrderId)
            ->with('products')
            ->firstOrFail();

        $result = $paypal->captureOrder($paypalOrderId);

        Log::info($result);

        if (($result['status'] ?? null) === 'COMPLETED' && ($result['purchase_units'][0]['payments']['captures'][0]['status'] ?? null) === 'COMPLETED') {
            $order->status = 'Completed';
            $order->is_paid = 1;
            $order->save();


            DB::table('payment_logs')->insert([
                'order_id' => $order->id,
                'payment_id' => $result['id'],
                'status' => 'Completed',
                'payment_source' => json_encode($result['payment_source']),
                'purchase_units' => json_encode($result['purchase_units']),
                'payer' => json_encode($result['payer']),
                'links' => json_encode($result['links']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            try {
                Mail::to($order->user->email)->send(new OrderSuccess($order));
            } catch (\Exception $e) {
                Log::info('error:'+ $e->getMessage());
            }

/*             return response()->json([
                'message' => 'Payment successful',
                'order' => $order,
            ]); */
            $storedData = [
              'order_id'=>$order->order_id,
              'payment_id'=>$result['id'],
              'status'=>'Completed',
              'payment_source'=>json_encode($result['payment_source']),
              'purchase_units'=>json_encode($result['purchase_units']),
              'payer'=>json_encode($result['payer']),
              'links'=>json_encode($result['links']),  
              'created_at'=>now(),
              'updated_at'=>now(),
            ];

            return response()->json([
                'message' => 'Payment successful',
                'order' => $order,
                'storedData' => $storedData,
            ]);

        }
        elseif (($result['status'] ?? null) === 'COMPLETED' && ($result['purchase_units'][0]['payments']['captures'][0]['status'] ?? null) === 'PENDING') {

            $order->status = 'Processing';
            $order->is_paid = 1;
            $order->save();


            DB::table('payment_logs')->insert([
                'order_id' => $order->id,
                'payment_id' => $result['id'],
                'status' => 'Completed',
                'payment_source' => json_encode($result['payment_source']),
                'purchase_units' => json_encode($result['purchase_units']),
                'payer' => json_encode($result['payer']),
                'links' => json_encode($result['links']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $storedData = [
              'order_id'=>$order->order_id,
              'payment_id'=>$result['id'],
              'status'=>'Completed',
              'payment_source'=>json_encode($result['payment_source']),
              'purchase_units'=>json_encode($result['purchase_units']),
              'payer'=>json_encode($result['payer']),
              'links'=>json_encode($result['links']),  
              'created_at'=>now(),
              'updated_at'=>now(),
            ];
            return response()->json([
                'message' => 'Payment Pending',
                'order' => $order,
                'storedData' => $storedData,
            ]);

        }

        foreach ($order->products as $product) {
            $product->increment('stock', $product->pivot->amount);
        }

        $order->status = 'Cancelled';
        $order->is_stock_restored = 1;
        $order->save();

        return back()->with('error', 'Payment failed');
    }

    public function cancelOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required|string',
        ]);

        $orderId = $request->order_id;

        $order = Order::with('products')->where('order_id', $orderId)->first();

        if (!$order) {
            return back()->with('error', 'Order not found');
        }

        if (in_array($order->status, ['Completed', 'Cancelled'])) {
            return back()->with('error', 'Order is already ' . $order->status);
        }

        foreach ($order->products as $product) {
            $product->increment('stock', $product->pivot->amount);
        }

        $order->status = 'Cancelled';
        $order->is_stock_restored = 1;
        $order->save();

        return redirect('/cart')->with('success', 'Order cancelled successfully');
    }
    public function updateStock()
    {
        $orders = Order::where('status','Cancelled')->where("is_stock_restored",0)->get();
        foreach ($orders as $order) {
            foreach ($order->products as $product) {
                $product->increment('stock', $product->pivot->amount);
            }
            $order->update(['is_stock_restored' => 1]);
        }
    }

}
