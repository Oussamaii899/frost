<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

use App\Jobs\ExpirePendingOrdersJob;
use App\Jobs\StockUpdateJob;
use App\Jobs\CheckPendingPaypalOrders;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new ExpirePendingOrdersJob)->everyFiveMinutes();

Schedule::job(new StockUpdateJob)->everyMinute();


Schedule::job(new CheckPendingPaypalOrders)->daily();