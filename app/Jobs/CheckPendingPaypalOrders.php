<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckPendingPaypalOrders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Get all orders still waiting for PayPal finalization
        $orders = Order::where('status', 'Processing')
                       ->where('is_paid', 1)
                       ->get();

        foreach ($orders as $order) {
            try {
                Log::info("Checking pending PayPal order: {$order->id}");

                $paypalOrderId = $order->payment_id; // or external_id you store

                $result = $this->checkPaypalStatus($paypalOrderId);

                if (!$result) {
                    Log::warning("PayPal returned no response for order {$order->id}");
                    continue;
                }

                $status = $result['status'] ?? null;
                $captureStatus = $result['purchase_units'][0]['payments']['captures'][0]['status'] ?? null;

                // If PayPal finally completed the capture
                if ($status === 'COMPLETED' && $captureStatus === 'COMPLETED') {

                    $order->status = 'Completed';
                    $order->save();

                    // Send email
                    try {
                        Mail::to($order->user->email)->send(new \App\Mail\OrderSuccess($order));
                    } catch (\Exception $e) {
                        Log::error("Email send error for order {$order->id}: " . $e->getMessage());
                    }

                    Log::info("Order {$order->id} marked completed by job.");
                }

                // If PayPal rejected the capture
                if ($status === 'COMPLETED' && $captureStatus !== 'PENDING' && $captureStatus !== 'COMPLETED') {
                    $order->status = 'Cancelled';
                    $order->save();

                            foreach ($order->products as $product) {
                                $product->increment('stock', $product->pivot->amount);
                            }
                    
                    Mail::to($order->user->email)->send(new \App\Mail\OrderCancelled($order));
                    Log::info("Order {$order->id} marked cancelled by job.");
                }

            } catch (\Exception $e) {
                Log::error("Error checking PayPal status for order {$order->id}: " . $e->getMessage());
            }
        }
    }

    private function checkPaypalStatus($paypalOrderId)
    {
        $clientId = config('services.paypal.client_id');
        $clientSecret = config('services.paypal.secret');

        // Generate Access Token
        $token = Http::asForm()
            ->withBasicAuth($clientId, $clientSecret)
            ->post('https://api-m.paypal.com/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ])
            ->json()['access_token'] ?? null;

        if (!$token) {
            Log::error("Unable to generate PayPal token.");
            return null;
        }

        // Get order status
        return Http::withToken($token)
            ->get("https://api-m.paypal.com/v2/checkout/orders/{$paypalOrderId}")
            ->json();
    }
}
