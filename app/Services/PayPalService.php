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
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    public function createOrder($amount)
    {
        $value = number_format((float) $amount, 2, '.', '');

        $response = Http::asJson()->withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.secret')
        )->post($this->baseUrl() . '/v2/checkout/orders', [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => 'USD',
                        'value' => $value,
                    ],
                ],
            ]
        ]);

        if (!$response->successful()) {
            logger()->error('PayPal create order failed', [
                'status' => $response->status(),
                'body' => $response->json(),
                'raw' => $response->body(),
            ]);
        }

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

    if (!$response->successful()) {
        logger()->error('PayPal capture order failed', [
            'status' => $response->status(),
            'body' => $response->json(),
            'raw' => $response->body(),
            'orderId' => $orderId,
        ]);
    }

    return $response->json();
}

}
