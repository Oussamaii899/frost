<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    protected $table = 'payment_logs';

    protected $guarded = [];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
