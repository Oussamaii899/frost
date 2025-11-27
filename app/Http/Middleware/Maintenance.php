<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class Maintenance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $maintenanceMode = DB::table('settings')->where('key', 'maintenance_mode')->value('value') == '1';
        
        // Allow admins to bypass maintenance mode
        if ($maintenanceMode && auth()->check() && auth()->user()->isAdmin()) {
            return $next($request);
        }
        
        // Block non-admins during maintenance
        if ($maintenanceMode) {
            return Inertia::render('MaintenancePage', ['discordUrl' => DB::table('settings')->where('key', 'discord_link')->value('value'), "sitename" => DB::table('settings')->where('key', 'site_name')->value('value')])->toResponse($request)->setStatusCode(503);
        }
        
        return $next($request);
    }
}
