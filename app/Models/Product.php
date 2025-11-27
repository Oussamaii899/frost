<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Factories\HasFactory;
class Product extends Model
{

    use HasFactory;

     /** @var array<string> */
    protected $fillable = [
        'name',
        'description',
        'price',
        'originalPrice',
        'stock',
        'category_id',
        'slug',
        'badge',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function orders()
    {
        return $this->belongsToMany(Order::class)->withPivot('amount', 'price');
    }
}
