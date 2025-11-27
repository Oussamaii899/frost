<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => $this->faker->unique()->regexify('FF[0-9]{5}'),
            'user_id' => User::factory(),
            'total' => DB::table('order_product')->sum('price'),
            'status' => $this->faker->randomElement(['Pending', 'Completed']),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
