<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PayPalService
{
    private function authHeader()
    {
        $clientId = config('services.paypal.client_id');
        $secret   = config('services.paypal.secret');

        $token = base64_encode("$clientId:$secret");

        return [
            'Authorization' => "Basic $token",
            'Content-Type' => 'application/x-www-form-urlencoded',
        ];
    }

    private function baseUrl()
    {
        return config('services.paypal.mode') === 'live'
            ? 'https://api.paypal.com'
            : 'https://api.sandbox.paypal.com';
    }

    public function createOrder($amount)
    {
        $response = Http::withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.secret')
        )->post($this->baseUrl() . '/v2/checkout/orders', [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => 'USD',
                        'value' => $amount,
                    ],
                ],
            ]
        ]);

        return $response->json();
    }

public function captureOrder($orderId)
{
    $url = $this->baseUrl() . "/v2/checkout/orders/{$orderId}/capture";

    $response = Http::withBasicAuth(
        config('services.paypal.client_id'),
        config('services.paypal.secret')
    )
    ->withHeaders([
        'Content-Type' => 'application/json'
    ])
    ->withBody('', 'application/json') // 👈 FORCE EMPTY JSON BODY
    ->post($url);

    return $response->json();
}

}
