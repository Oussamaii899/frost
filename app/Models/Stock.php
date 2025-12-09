<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stock';

    protected $fillable = [
        'product_id',
        'data',
        'is_taken',
        'order_id',
        'user_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
