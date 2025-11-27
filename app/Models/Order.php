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
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
     public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('amount', 'price');
    }
}
