<?php

namespace App\Providers;
use App\Models\Setting;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            $description = Setting::where('key', 'site_description')->value('value');
            config(['app.description' => $description]);
        } catch (\Throwable $e) {
            // Avoid breaking artisan commands when DB is unavailable
        }
    }
}
