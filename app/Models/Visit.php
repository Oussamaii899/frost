<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable=[
        'visitor_id',
        'ip',
        'country',
        'country_code',
        'city',
        'state',
        'timezone',
    ];
}
