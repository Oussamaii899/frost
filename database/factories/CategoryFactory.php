<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        /* 
        Category::factory()->createMany([
            ['name' => 'Nitro', 'slug' => 'nitro'],
            ['name' => 'Boosts', 'slug' => 'boosts'],
            ['name' => 'Spotify', 'slug' => 'spotify'],
            ['name' => 'Minecraft', 'slug' => 'minecraft'],
            ['name' => 'Snapchat+', 'slug' => 'snapchat'],
            ['name' => 'Hosting', 'slug' => 'hosting'],
            ['name' => 'Bots', 'slug' => 'bots'],
        ]); */
        return [
            'name' => $this->faker->word(),
            'slug' => $this->faker->unique()->slug(),
        ];
    }
}
