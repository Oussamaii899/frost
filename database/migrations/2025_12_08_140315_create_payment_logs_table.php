<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */


    /* [2025-12-08 13:58:00] local.INFO: array (
  'id' => '0A041198VT9560531',
  'status' => 'COMPLETED',
  'payment_source' => 
  array (
    'paypal' => 
    array (
      'email_address' => 'sb-ulu2v47849916@personal.example.com',
      'account_id' => 'N4SAAJW65UUE2',
      'account_status' => 'VERIFIED',
      'name' => 
      array (
        'given_name' => 'John',
        'surname' => 'Doe',
      ),
      'address' => 
      array (
        'country_code' => 'MA',
      ),
    ),
  ),
  'purchase_units' => 
  array (
    0 => 
    array (
      'reference_id' => 'default',
      'shipping' => 
      array (
        'name' => 
        array (
          'full_name' => 'John Doe',
        ),
        'address' => 
        array (
          'address_line_1' => 'Free Trade Zone',
          'admin_area_2' => 'Rabat',
          'postal_code' => '10010',
          'country_code' => 'MA',
        ),
      ),
      'payments' => 
      array (
        'captures' => 
        array (
          0 => 
          array (
            'id' => '3WD67833ND763802K',
            'status' => 'COMPLETED',
            'amount' => 
            array (
              'currency_code' => 'USD',
              'value' => '79.99',
            ),
            'final_capture' => true,
            'seller_protection' => 
            array (
              'status' => 'ELIGIBLE',
              'dispute_categories' => 
              array (
                0 => 'ITEM_NOT_RECEIVED',
                1 => 'UNAUTHORIZED_TRANSACTION',
              ),
            ),
            'seller_receivable_breakdown' => 
            array (
              'gross_amount' => 
              array (
                'currency_code' => 'USD',
                'value' => '79.99',
              ),
              'paypal_fee' => 
              array (
                'currency_code' => 'USD',
                'value' => '4.22',
              ),
              'net_amount' => 
              array (
                'currency_code' => 'USD',
                'value' => '75.77',
              ),
            ),
            'links' => 
            array (
              0 => 
              array (
                'href' => 'https://api.sandbox.paypal.com/v2/payments/captures/3WD67833ND763802K',
                'rel' => 'self',
                'method' => 'GET',
              ),
              1 => 
              array (
                'href' => 'https://api.sandbox.paypal.com/v2/payments/captures/3WD67833ND763802K/refund',
                'rel' => 'refund',
                'method' => 'POST',
              ),
              2 => 
              array (
                'href' => 'https://api.sandbox.paypal.com/v2/checkout/orders/0A041198VT9560531',
                'rel' => 'up',
                'method' => 'GET',
              ),
            ),
            'create_time' => '2025-12-08T13:57:59Z',
            'update_time' => '2025-12-08T13:57:59Z',
          ),
        ),
      ),
    ),
  ),
  'payer' => 
  array (
    'name' => 
    array (
      'given_name' => 'John',
      'surname' => 'Doe',
    ),
    'email_address' => 'sb-ulu2v47849916@personal.example.com',
    'payer_id' => 'N4SAAJW65UUE2',
    'address' => 
    array (
      'country_code' => 'MA',
    ),
  ),
  'links' => 
  array (
    0 => 
    array (
      'href' => 'https://api.sandbox.paypal.com/v2/checkout/orders/0A041198VT9560531',
      'rel' => 'self',
      'method' => 'GET',
    ),
  ),
)   */
    public function up(): void
    {
        Schema::create('payment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('payment_id');
            $table->string('status');
            $table->json('payment_source');
            $table->json('purchase_units');
            $table->json('payer');
            $table->json('links');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_logs');
    }
};
