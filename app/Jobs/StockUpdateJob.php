<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\Stock;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StockUpdateJob implements ShouldQueue
{
    use Queueable;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $orders = Order::with('products')
            ->where('status', 'Cancelled')
            ->where('is_stock_restored', 0)
            ->get();

        Log::info("StockUpdateJob: Found {$orders->count()} orders to restore");

        foreach ($orders as $order) {
            DB::transaction(function () use ($order) {

                // Re-check inside transaction (idempotency)
                $order->refresh();

                if ((int) $order->is_stock_restored === 1) {
                    return;
                }

                // Restore cached product stock counts
                foreach ($order->products as $product) {
                    $qty = (int) ($product->pivot->amount ?? 0);
                    if ($qty > 0) {
                        $product->increment('stock', $qty);
                    }
                }

                // Release digital stock rows
                Stock::where('order_id', $order->id)->update([
                    'is_taken'   => 0,
                    'order_id'   => null,
                    'user_id'    => null,
                    'updated_at' => now(),
                ]);

                $order->update([
                    'is_stock_restored' => 1,
                ]);

                Log::info("Stock restored for order ID {$order->id} and STOCK {$order->stock}");
            });
        }
    }
}
