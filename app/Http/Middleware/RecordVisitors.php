<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RecordVisitors
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Check if user accepted cookies
        if ($request->cookie('cookie_accepted') !== 'true') {
            return $next($request); // STOP: do not track this user
        }

        // 2. Create or get visitor_id cookie
        if (!$request->hasCookie('visitor_id')) {
            $visitorId = (string) \Str::uuid();
            cookie()->queue(cookie('visitor_id', $visitorId, 525600)); // 1 year
        } else {
            $visitorId = $request->cookie('visitor_id');
        }

        // 3. Prepare geoip
        $ip = $request->ip();
        $location = geoip($ip);

        // 4. Log only once
        $exists = \App\Models\Visit::where('visitor_id', $visitorId)->exists();

        if (! $exists) {
            \App\Models\Visit::create([
                'visitor_id'   => $visitorId,
                'ip'           => $ip,
                'country'      => $location->country_name ?? null,
                'country_code' => $location->country_code2 ?? null,
                'city'         => $location->city ?? null,
                'state'        => $location->state_prov ?? null,
                'timezone'     => $location->time_zone['name'] ?? null,
            ]);
        }

        return $next($request);
    }
}
