<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{

    use HasFactory;

     /** @var array<string> */

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'icon',
    ];
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
