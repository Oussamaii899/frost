<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;


use App\Models\Order;
class ExpirePendingOrdersJob implements ShouldQueue
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
        Order::where('status', 'Pending')->
        where('created_at', '<=', now()->subMinutes(30))
        ->update(['status' => 'Cancelled']);
    }
}
