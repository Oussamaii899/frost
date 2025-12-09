<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\User;
use \Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

     /** @var array<string> */
    protected $fillable = [
        'order_id',
        'total',
        'status',
        'user_id',
        'paypal_order_id',
        'is_stock_restored',
        'is_paid',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
     public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('amount', 'price');
    }

    public function paymentLogs()
    {
        return $this->hasOne(PaymentLog::class);
    }

    public function stock()
    {
        return $this->hasMany(Stock::class);
    }

    
}
