<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Visit;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();


/*         Category::factory()->createMany([
            ['name' => 'Nitro', 'slug' => 'nitro', 'description' => 'Discord Nitro subscriptions and plans','icon'=>'BoxSeam'],
            ['name' => 'Boosts', 'slug' => 'boosts', 'description' => 'Discord Server Boost packages','icon'=>'LightningFill'],
            ['name' => 'Spotify', 'slug' => 'spotify', 'description' => 'Spotify Premium subscriptions','icon'=>'Spotify'],
            ['name' => 'Minecraft', 'slug' => 'minecraft', 'description' => 'Minecraft accounts and services', 'icon'=>'GamepadFill'],
            ['name' => 'Snapchat', 'slug' => 'snapchat', 'description' => 'Snapchat Plus subscriptions and features', 'icon'=>'Snapchat'],
            ['name' => 'Hosting', 'slug' => 'hosting', 'description' => 'Discord bot hosting services', 'icon'=>'Server'],
            ['name' => 'Bots', 'slug' => 'bots', 'description' => 'Custom and premium Discord bots', 'icon'=>'Robot'],
        ]);
        
        Product::factory()->createMany([
            [
                'name' => 'Discord Nitro Monthly',
                'slug' => 'discord-nitro-monthly-' . uniqid(),
                'category_id' => Category::where('slug', 'nitro')->first()->id,
                'originalPrice' => 14.99,
                'price' => 9.99,
                'stock' => 100,
                'description' => '1 month of premium Discord experience with all features unlocked',
                'badge' => 'Most Popular',
            ],
            [
                'name' => 'Discord Nitro Yearly',
                'slug' => 'discord-nitro-yearly-' . uniqid(),
                'category_id' => Category::where('slug', 'nitro')->first()->id,
                'originalPrice' => 179.88,
                'price' => 99.99,
                'stock' => 50,
                'description' => '12 months of premium Discord experience - Best Value!',
                'badge' => 'Best Value',
            ],
            [
                'name' => 'Discord Nitro Basic',
                'slug' => 'discord-nitro-basic-' . uniqid(),
                'category_id' => Category::where('slug', 'nitro')->first()->id,
                'originalPrice' => 4.99,
                'price' => 2.99,
                'stock' => 0,
                'description' => 'Essential Discord premium features at an affordable price',
                'badge' => 'Budget Friendly',
            ],
            [
                'name' => '2x Server Boost (1 Month)',
                'slug' => '2x-server-boost-1-month-' . uniqid(),
                'category_id' => Category::where('slug', 'boosts')->first()->id,
                'originalPrice' => 13.98,
                'price' => 8.99,
                'stock' => 150,
                'description' => 'Double server boost for one month to enhance your server features',
                'badge' => 'Starter',
            ],
            [
                'name' => '7x Server Boost Pack (1 Month)',
                'slug' => '7x-server-boost-pack-1-month-' . uniqid(),
                'category_id' => Category::where('slug', 'boosts')->first()->id,
                'originalPrice' => 48.93,
                'price' => 29.99,
                'stock' => 50,
                'description' => 'Advanced boost package for one month with Level 2 server status',
                'badge' => 'Popular',
            ],
            [
                'name' => '7x Server Boost Pack (3 Months)',
                'slug' => '7x-server-boost-pack-3-months-' . uniqid(),
                'category_id' => Category::where('slug', 'boosts')->first()->id,
                'originalPrice' => 146.79,
                'price' => 79.99,
                'stock' => 30,
                'description' => 'Advanced boost package for three months with sustained Level 2 server status',
                'badge' => 'Extended',
            ],
            [
                'name' => '14x Server Boost Pack (1 Month)',
                'slug' => '14x-server-boost-pack-1-month-' . uniqid(),
                'category_id' => Category::where('slug', 'boosts')->first()->id,
                'originalPrice' => 97.86,
                'price' => 59.99,
                'stock' => 40,
                'description' => 'Maximum boost package for one month with Level 3 server status',
                'badge' => 'Premium',
            ],
            [
                'name' => '14x Server Boost Pack (3 Months)',
                'slug' => '14x-server-boost-pack-3-months-' . uniqid(),
                'category_id' => Category::where('slug', 'boosts')->first()->id,
                'originalPrice' => 293.58,
                'price' => 159.99,
                'stock' => 0,
                'description' => 'Maximum boost package for three months with Level 3 server status',
                'badge' => 'Ultimate',
            ],
            [
                'name' => 'Spotify Premium Family',
                'slug' => 'spotify-premium-family-' . uniqid(),
                'category_id' => Category::where('slug', 'spotify')->first()->id,
                'originalPrice' => 15.99,
                'price' => 8.99,
                'stock' => 200,
                'description' => 'Family plan for up to 6 accounts with individual profiles',
                'badge' => 'Family',
            ],
            [
                'name' => 'Minecraft Java Edition Account',
                'slug' => 'minecraft-java-edition-account-' . uniqid(),
                'category_id' => Category::where('slug', 'minecraft')->first()->id,
                'originalPrice' => 26.95,
                'price' => 19.99,
                'stock' => 75,
                'description' => 'Full Minecraft Java Edition account with lifetime access',
                'badge' => 'Lifetime',
            ],
            [
                'name' => 'Snapchat+ Premium (1 Month)',
                'slug' => 'snapchat-plus-premium-1-month-' . uniqid(),
                'category_id' => Category::where('slug', 'snapchat')->first()->id,
                'originalPrice' => 3.99,
                'price' => 2.99,
                'stock' => 300,
                'description' => 'Snapchat Plus subscription with exclusive features and early access',
                'badge' => 'Premium',
            ],
            [
                'name' => 'Snapchat+ Premium (1 Year)',
                'slug' => 'snapchat-plus-premium-1-year-' . uniqid(),
                'category_id' => Category::where('slug', 'snapchat')->first()->id,
                'originalPrice' => 47.88,
                'price' => 29.99,
                'stock' => 100,
                'description' => 'Annual Snapchat Plus subscription with exclusive features and maximum savings',
                'badge' => 'Best Value',
            ],
            [
                'name' => 'Discord Bot Hosting (Monthly)',
                'slug' => 'discord-bot-hosting-monthly-' . uniqid(),
                'category_id' => Category::where('slug', 'hosting')->first()->id,
                'originalPrice' => 14.99,
                'price' => 9.99,
                'stock' => 120,
                'description' => 'Reliable 24/7 bot hosting with 99.9% uptime guarantee',
                'badge' => 'Reliable',
            ],
            [
                'name' => 'Premium Bot Hosting (Monthly)',
                'slug' => 'premium-bot-hosting-monthly-' . uniqid(),
                'category_id' => Category::where('slug', 'hosting')->first()->id,
                'originalPrice' => 29.99,
                'price' => 19.99,
                'stock' => 80,
                'description' => 'High-performance hosting with dedicated resources and priority support',
                'badge' => 'Premium',
            ],
            [
                'name' => 'Enterprise Bot Hosting (Monthly)',
                'slug' => 'enterprise-bot-hosting-monthly-' . uniqid(),
                'category_id' => Category::where('slug', 'hosting')->first()->id,
                'originalPrice' => 79.99,
                'price' => 49.99,
                'stock' => 0,
                'description' => 'Enterprise-grade hosting solution with custom configurations',
                'badge' => 'Enterprise',
            ],
            [
                'name' => 'Moderation Bot',
                'slug' => 'moderation-bot-' . uniqid(),
                'category_id' => Category::where('slug', 'bots')->first()->id,
                'originalPrice' => 29.99,
                'price' => 19.99,
                'stock' => 60,
                'description' => 'Advanced moderation bot with comprehensive features',
                'badge' => 'Advanced',
            ],
            [
                'name' => 'Music Bot Premium',
                'slug' => 'music-bot-premium-' . uniqid(),
                'category_id' => Category::where('slug', 'bots')->first()->id,
                'originalPrice' => 24.99,
                'price' => 14.99,
                'stock' => 90,
                'description' => 'High-quality music bot with premium streaming',
                'badge' => 'Popular',
            ],
            [
                'name' => 'Custom Bot Development',
                'slug' => 'custom-bot-development-' . uniqid(),
                'category_id' => Category::where('slug', 'bots')->first()->id,
                'originalPrice' => 149.99,
                'price' => 99.99,
                'stock' => 20,
                'description' => 'Fully custom bot tailored specifically to your needs',
                'badge' => 'Custom',
            ],
        ]);

        Order::factory()->createMany([
            ['order_id'=>"FF01", 'user_id'=>"1", 'total'=>9, 'status'=>"Completed"],
            ['order_id'=>"FF02", 'user_id'=>"1", 'total'=>290, 'status'=>"Pending"],
            ['order_id'=>"FF03", 'user_id'=>"1", 'total'=>8, 'status'=>"Completed"],
            ['order_id'=>"FF04", 'user_id'=>"1", 'total'=>990, 'status'=>"Completed"],
        ]);

        User::factory()->create([
            'name' => 'Oussama',
            'email' => 'oussamagame150@gmail.com',
            'password' => bcrypt('oussamagame150@gmail.com'),
            'role' => 'admin',
        ]);
 */

        
/*         DB::table('order_product')->insert(
            Order::all()->map(function ($order) {
                $products = Product::inRandomOrder()->take(rand(1, 18))->get();
                return $products->map(function ($product) use ($order) {
                    return [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'amount' => rand(1, 2),
                        'price' => $product->price,
                    ];
                })->toArray();
            })->flatten(1)->toArray()
        ); */


/*         DB::table('settings')->insert([
            'key' => 'maintenance_mode',
            'value' => 'off',
        ]);
        DB::table('settings')->insert([
            'key' => 'email_notifications',
            'value' => 'off',
        ]);
        DB::table('settings')->insert([
            'key' => 'developer_badge',
            'value' => 'on',
        ]);


        DB::table('settings')->insert([
            'key' => 'default_currency',
            'value' => '$',
        ]);
        DB::table('settings')->insert([
            'key' => 'tax_rate',
            'value' => '0',
        ]);



        DB::table('settings')->insert([
            'key' => 'site_name',
            'value' => 'Frost',
        ]);
        DB::table('settings')->insert([
            'key' => 'site_description',
            'value' => 'Premium digital services marketplace',
        ]);


        DB::table('settings')->insert([
            'key' => 'discord_link',
            'value' => 'https://discord.gg/BTPEv3GDeY',
        ]);
        DB::table('settings')->insert([
            'key' => 'Meta_title',
            'value' => 'Frost Market - Premium Digital Services',
        ]);
        DB::table('settings')->insert([
            'key' => 'Meta_description',
            'value' => 'Buy premium Discord Nitro, server boosts, and more',
        ]); */


/*         DB::table('order_product')->insert(
            Order::where('id', '>', 206)->get()->map(function ($order) {
                $products = Product::inRandomOrder()->take(rand(1, 5))->get();
                return $products->map(function ($product) use ($order) {
                    return [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'amount' => rand(1, 2),
                        'price' => $product->price,
                    ];
                })->toArray();
            })->flatten(1)->toArray()
        );
 */

        /* DB::table('visits')->insert([
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '102.50.41.99',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Casablanca',
                'state'        => 'Casablanca-Settat',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subDays(2)->subHours(5),
                'updated_at'   => now()->subDays(2)->subHours(5),
            ],
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '102.51.22.14',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Casablanca',
                'state'        => 'Casablanca-Settat',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subDays(1)->subHours(3),
                'updated_at'   => now()->subDays(1)->subHours(3),
            ],

            // Rabat
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '105.73.88.33',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Rabat',
                'state'        => 'Rabat-Salé-Kénitra',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subHours(10),
                'updated_at'   => now()->subHours(10),
            ],
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '105.73.89.11',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Rabat',
                'state'        => 'Rabat-Salé-Kénitra',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subHours(6),
                'updated_at'   => now()->subHours(6),
            ],

            // Marrakech
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '102.77.13.201',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Marrakech',
                'state'        => 'Marrakech-Safi',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subDays(3)->subHours(2),
                'updated_at'   => now()->subDays(3)->subHours(2),
            ],
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '102.77.13.199',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Marrakech',
                'state'        => 'Marrakech-Safi',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subDays(1)->subHours(12),
                'updated_at'   => now()->subDays(1)->subHours(12),
            ],

            // Agadir
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '105.100.33.44',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Agadir',
                'state'        => 'Souss-Massa',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subDays(4),
                'updated_at'   => now()->subDays(4),
            ],
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '105.100.33.52',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Agadir',
                'state'        => 'Souss-Massa',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subHours(2),
                'updated_at'   => now()->subHours(2),
            ],

            // Fes
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '102.89.44.91',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Fes',
                'state'        => 'Fès-Meknès',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subDays(5)->subHours(3),
                'updated_at'   => now()->subDays(5)->subHours(3),
            ],
            [
                'visitor_id'   => Str::uuid(),
                'ip'           => '102.89.44.93',
                'country'      => 'Morocco',
                'country_code' => 'MA',
                'city'         => 'Fes',
                'state'        => 'Fès-Meknès',
                'timezone'     => 'Africa/Casablanca',
                'created_at'   => now()->subHours(1),
                'updated_at'   => now()->subHours(1),
            ],
        ]); */
        

        // \App\Models\User::factory(10)->create();
             /* DB::table('order_product')->insert(
            Order::where('id', '>', 306)->get()->map(function ($order) {
                $products = Product::inRandomOrder()->take(rand(1, 5))->get();
                return $products->map(function ($product) use ($order) {
                    return [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'amount' => rand(1, 2),
                        'price' => $product->price,
                    ];
                })->toArray();
            })->flatten(1)->toArray()
            ); */
    }
}