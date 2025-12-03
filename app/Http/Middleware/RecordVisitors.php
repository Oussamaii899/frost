<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class RecordVisitors
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->cookie('cookie_accepted') !== 'true') {
            return $next($request);  
        }

        if (!$request->hasCookie('visitor_id')) {
            $visitorId = (string) Str::uuid();
            cookie()->queue(cookie('visitor_id', $visitorId, 60*24*365));
        } else {
            $visitorId = $request->cookie('visitor_id');
        }

        $ip = $request->ip();
        $location = geoip($ip);

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
