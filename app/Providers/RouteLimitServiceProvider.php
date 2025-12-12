<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class RouteLimitServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Checkout Order Creation
        RateLimiter::for('checkout', function ($request) {
            return Limit::perMinute(10)->by($request->user()?->id ?? $request->ip());
        });

        // PayPal Create
        RateLimiter::for('paypal-create', function ($request) {
            return Limit::perMinute(5)->by($request->user()?->id ?? $request->ip())
                ->response(function () {
                    return response()->json([
                        "message" => "Too many requests. Please wait a moment."
                    ], 429);
                });
        });

        // PayPal Capture
        RateLimiter::for('paypal-capture', function ($request) {
            return Limit::perMinute(3)->by($request->user()?->id ?? $request->ip())
                ->response(function () {
                    return response()->json([
                        "message" => "Too many requests. Please wait a moment."
                    ], 429);
                });
        });

        // Order Cancel
        RateLimiter::for('order-cancel', function ($request) {
            return Limit::perMinute(5)->by($request->user()?->id ?? $request->ip());
        });

        // Admin Stock Modification
        RateLimiter::for('stock-change', function ($request) {
            return Limit::perMinute(20)->by($request->user()?->id ?? $request->ip());
        });

        // Support Form
        RateLimiter::for('support-submit', function ($request) {
            return Limit::perMinute(3)->by($request->user()?->id ?? $request->ip());
        });

        RateLimiter::for('login', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // REGISTER LIMIT
        RateLimiter::for('register', function ($request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        // FORGOT PASSWORD LIMIT
        RateLimiter::for('forgot-password', function ($request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        // RESET PASSWORD LIMIT
        RateLimiter::for('reset-password', function ($request) {
            return Limit::perMinute(3)->by($request->ip());
        });
    }
}
