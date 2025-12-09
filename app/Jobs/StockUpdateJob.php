<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

use App\Models\Order;

class StockUpdateJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $orders = Order::where('status','Cancelled')->where("is_stock_restored",0)->get();
        Log::info("Restoring stock for " . count($orders) . " orders");
        foreach ($orders as $order) {
            foreach ($order->products as $product) {
                $product->increment('stock', $product->pivot->amount);
            }
            $order->update(['is_stock_restored' => 1]);
            Log::info("Restoring stock for order: " . $order->id);
        }
    }
}
