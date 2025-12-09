<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Setting;
use App\Models\Visit;
use App\Models\Stock;
use Inertia\Inertia;


use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

use Illuminate\Support\Facades\Mail;
use App\Mail\CustomerMail;

use Barryvdh\DomPDF\Facade\Pdf;

class AdminController extends Controller
{
    public function dashboard()
    {


        //revenue calculation
        $thisMonthR = Order::where('status', 'completed')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->with('products')
            ->get()
            ->sum(function ($o) {
                return $o->products->sum(function ($p) {
                    return $p->pivot->amount * $p->pivot->price;
                });
            });
        
        $beforeLastMonthR = Order::where('status', 'completed')
            ->whereBetween('created_at', [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()])
            ->with('products')
            ->get()
            ->sum(function ($o) {
                return $o->products->sum(function ($p) {
                    return $p->pivot->amount * $p->pivot->price;
                });
            });
        
        $trendR = $beforeLastMonthR > 0
            ? round((($thisMonthR - $beforeLastMonthR) / $beforeLastMonthR) * 100, 1)
            : 0;
        

        //order calculation
        $thisMonthO = Order::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count();
        $beforeLastMonthO = Order::whereBetween('created_at', [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()])->count();
        $trendO = $beforeLastMonthO > 0
            ? round((($thisMonthO - $beforeLastMonthO) / $beforeLastMonthO) * 100, 1)
            : 0;

        


        //customers calculation
        $thisMonthC = User::where('role', 'customer')->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count();
        $beforeLastMonthC = User::where('role', 'customer')->whereBetween('created_at', [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()])->count();
        $trendC = $beforeLastMonthC > 0
            ? round((($thisMonthC - $beforeLastMonthC) / $beforeLastMonthC) * 100, 1)
            : 0;



        //stock calculation
/*         $thisMonthS = Product::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->sum('stock');
        $beforeLastMonthS = Product::whereBetween('created_at', [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()])->sum('stock');
        $trendS = $beforeLastMonthS > 0
            ? round((($thisMonthS - $beforeLastMonthS) / $beforeLastMonthS) * 100, 1)
            : 0; */
        $stats = [
            [
                'title' => 'Total Revenue',
                'value' => '$' . $thisMonthR,
                'icon' => 'DollarSign',
                'trend' => $trendR . '% from last month',
                'trendUp' => $trendR >= 0 ? true : false,
                'delay' => '0.1s',
            ],
            [
                'title' => 'Total Orders',
                'value' => Order::where('status', 'completed')->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'icon' => 'ShoppingCart',
                'trend' => $trendO . '% from last month',
                'trendUp' => $trendO >= 0 ? true : false,
                'delay' => '0.2s',
            ],
            [
                'title' => 'Total Stock Items',
                'value' => Product::sum('stock'),
                'icon' => 'Package',
                'trend' => 'Stock Items',
                'trendUp' => Product::sum('stock') >= 20 ? true : false,
                'delay' => '0.3s',
            ],
            [
                'title' => 'Total Customers',
                'value' => User::where('role', 'customer')->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'icon' => 'Users',
                'trend' => $trendC . '% from last month',
                'trendUp' => $trendC >= 0 ? true : false,
                'delay' => '0.4s',
            ],
        ];
        

                $productData = Product::all()->map(function ($p) {
                    $stock = (int) $p->stock;

                    if ($stock <= 20) {
                        $status = 'Critical';
                    } elseif ($stock <= 100) {
                        $status = 'Low Stock';
                    } else {
                        $status = 'In Stock';
                    }

                    return [
                        'id' => $p->id,
                        'product' => $p->name,
                        'stock' => $stock,
                        'status' => $status,
                    ];
                })->toArray();

    $revenueData = Order::where('status', 'completed')
        ->whereBetween('created_at', [
            Carbon::today()->subMonths(6)->startOfDay(),
            Carbon::today()->endOfDay()
        ])
        ->get()
        ->groupBy(function ($order) {
            return Carbon::parse($order->created_at)->format('Y-m');
        })
        ->sortKeys()
        ->map(function ($orders, $ym) {
            $monthName = Carbon::parse($ym.'-01')->format('M');

            $total = $orders->sum(function ($o) {
                return $o->products->sum(function ($p) {
                    return round($p->pivot->amount * $p->pivot->price, 2);
                });
            });

            return [
                'month' => $monthName,
                'revenue' => $total
            ];
        })
        ->values()
        ->toArray();

        
    $visitData = Visit::all()
        ->groupBy(function($v) {
            return $v->created_at->toDateString();
        })
        ->flatMap(function($dateGroup) {
            return $dateGroup->groupBy('country')
                ->flatMap(function($countryGroup) {
                    return $countryGroup->groupBy('city')
                        ->map(function($cityGroup) use ($countryGroup) {
                            $country = $countryGroup->first()->country ?? 'Unknown';
                            return [
                                'date' => $cityGroup->first()->created_at,
                                'visits' => $cityGroup->count(), 
                                'country' => $country,
                                'city' => $cityGroup->first()->city ?? 'Unknown'
                            ];
                        })
                        ->values()
                        ->toArray();
                })
                ->values()
                ->toArray();
        })
        ->values()
        ->toArray();
        


        $recentOrders = Order::latest()->take(4)->with(['user', 'products'])->get();

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'revenueData' => $revenueData,
            'productData' => $productData,
            'visitData' => $visitData
        ]);
    }

    public function Layout()
    {   
        $nOrder = Order::where('status', 'Pending')->count();
        $nProduct = Product::where('stock', '=', 0)->count();

        $name = Setting::where('key', 'site_name')->first()?->value;


        return response()->json([
            'nOrders' => $nOrder,
            'nProducts' => $nProduct,
            'name' => $name,
        ]);
    }

    public function notification(){
        $notif = Activity::latest()->take(4)->get();

        return response()->json([
            'notif' => $notif,
        ]);
    }


    public function productIndex()
    {
        $products = Product::with('category')->get();
        
        return Inertia::render('Admin/AdminProducts', [
            'products' => $products,
        ]);
    }

    public function productCreate()
    {
        return Inertia::render('Admin/AdminProductCreate', [
            'categories' => Category::all(),
        ]);
    }

    public function productStore()
    {
        $validated = request()->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'originalPrice' => 'required|numeric',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'description' => 'nullable|string',
        ]);
        $validated['slug'] = \Str::slug($validated['name']) . '-' . uniqid();
        $product = Product::create($validated);

        if($product->wasRecentlyCreated) {
                    Activity::create([
                        "log_name" => "Product",
                        "description" => "Product created",
                        "subject_type" => Product::class,
                        "event" => "created",
                        "subject_id" => Product::latest()->first()->id,
                        "causer_type" => User::class,
                        "causer_id" => auth()->user()->id,
                        "properties" => $validated
                    ]);
        }

        return redirect('/admin/products')->with('success', 'Product created successfully');
    }

    public function productShow($slug)
    {
        $product = Product::with('category', 'stocks')->where('slug', $slug)->firstOrFail();
        return Inertia::render('Admin/AdminProductView', [
            'product' => $product,
        ]);
    }   


    public function StockAdd(Product $product, Request $request)
    {
        $stocks = $request->stocks;
        foreach ($stocks as $stock) {
            
            $product->stocks()->create([
                'product_id' => $product->id,
                'data' => json_encode($stock),
                'created_at' => now()
            ]);

            $product->increment('stock');
        }

        return back()->with('success', 'Stock added successfully');
    }

    public function StockDelete(Product $product, Request $request)
    {
        $stock = Stock::find($request->stock);
        $stock->delete();  
        $product->decrement('stock');     
        return back()->with('success', 'Stock deleted successfully');
    }

    public function productEdit($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        return Inertia::render('Admin/AdminProductEdit', [
            'categories' => Category::all(),
            'product' => $product,
        ]);
    }

    public function productUpdate(Product $product)
    {
        $validated = request()->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'originalPrice' => 'required|numeric',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'badge' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        if($product->wasChanged()) {
            Activity::create([
                "log_name" => "Product",
                "description" => "Product updated",
                "event" => "updated",
                "subject_type" => Product::class,
                "subject_id" => $product->id,
                "causer_type" => User::class,
                "causer_id" => auth()->user()->id,
                "properties" => $product
            ]);  
        };
        return redirect('/admin/products')->with('success', 'Product updated successfully');
    }

    public function productDestroy(Product $product)
    {
        $product->delete();
        if(!Product::where('id', $product->id)->exists()) {
            Activity::create([
                "log_name" => "Product",
                "description" => "Product deleted",
                "event" => "deleted",
                "subject_type" => Product::class,
                "subject_id" => $product->id,
                "causer_type" => User::class,
                "causer_id" => auth()->user()->id,
                "properties" => $product
            ]);
        }
        return redirect('/admin/products')->with('success', 'Product deleted successfully');
    }






    public function categoryIndex()
    {
        $categories = Category::withCount('products')->get();

        return Inertia::render('Admin/AdminCategories', [
            'categories' => $categories,
        ]);
    }

    public function categoryCreate()
    {
        return Inertia::render('Admin/AdminCategoryCreate');
    }

    public function categoryStore()
    {
        $validated = request()->validate([
            'name' => 'required|string|unique:categories',
            'slug' => 'required|string|unique:categories',
            'status' => 'required|string|in:active,inactive',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        if(request()->status === 'active') {
            $validated['is_active'] = true;
        } else {
            $validated['is_active'] = false;
        }


        $category =Category::create($validated);
        if($category->wasRecentlyCreated) {
            Activity::create([
                "log_name" => "Category",
                "description" => "Category created",
                "event" => "created",
                "subject_type" => Category::class,
                "subject_id" => Category::latest()->first()->id,
                "causer_type" => User::class,
                "causer_id" => auth()->user()->id,
                "properties" => $validated
            ]);
        };

        return redirect('/admin/categories')->with('success', 'Category created successfully');
    }

    public function categoryShow($slug)
    {
        $category = Category::where('slug', $slug)
            ->with(['products.orders' => function ($query) {
                $query->whereIn('status', ['Completed', 'completed']);
            }])
            ->firstOrFail();

        $products = $category->products->map(function ($product) {
            $totalRevenueValue = $product->orders->sum(function ($order) {
                return ($order->pivot->amount ?? 0) * ($order->pivot->price ?? 0);
            });

            $totalRevenueValue = round($totalRevenueValue, 2);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => number_format((float) $product->price, 2, '.', ''),
                'total_revenue' => number_format($totalRevenueValue, 2, '.', ''),
                'total_revenue_value' => $totalRevenueValue,
            ];
        });

        $totalRevenueValue = $products->sum('total_revenue_value');
        $totalRevenue = number_format((float) $totalRevenueValue, 2, '.', '');

        return Inertia::render('Admin/AdminCategoryView', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'is_active' => $category->is_active,
                'products' => $products,
            ],
            'totalProducts' => $products->count(),
            'totalRevenue' => $totalRevenue,
        ]);
    }

    public function categoryEdit($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        return Inertia::render('Admin/AdminCategoryEdit', [
            'category' => $category,
        ]);
    }

    public function categoryUpdate(Category $category)
    {
        $validated = request()->validate([
            'name' => 'required|string|unique:categories,name,' . $category->id,
            'slug' => 'required|string|unique:categories,slug,' . $category->id,
            'status' => 'required|string|in:active,inactive',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        if(request()->status === 'active') {
            $validated['is_active'] = true;
        } else {
            $validated['is_active'] = false;
        }

        $category->update($validated);
        if($category->wasChanged()) {
          Activity::create([
             "log_name" => "Category",
             "description" => "Category updated",
             "subject_type" => Category::class,
             "subject_id" => $category->id,
             "event" => "updated",
             "causer_type" => User::class,
             "causer_id" => auth()->user()->id,
             "properties" => $category
          ]);
        };
        return redirect('/admin/categories')->with('success', 'Category updated successfully');
    }

    public function categoryDestroy(Category $category)
    {
        $category->delete();
        if(!Category::where('id', $category->id)->exists()) {
            Activity::create([
                "log_name" => "Category",
                "description" => "Category deleted",
                "subject_type" => Category::class,
                "subject_id" => $category->id,
                "event" => "deleted",
                "causer_type" => User::class,
                "causer_id" => auth()->user()->id,
                "properties" => $category
            ]);
        }
        return redirect('/admin/categories')->with('success', 'Category deleted successfully');
    }

    public function orderIndex()
    {
        $orders = Order::with('user')->orderBy('created_at', 'desc')->get();
        $this->reloadOrders();
        return Inertia::render('Admin/AdminOrders', [
            'orders' => $orders,
        ]);
    }

    public function orderShow($orderId)
    {
        $order = Order::with('products', 'user', 'paymentLogs')->where('order_id', $orderId)->firstOrFail();
        $this->reloadOrders();
        return Inertia::render('Admin/AdminOrderDetail', [  
            'order' => $order->load('products', 'user', 'paymentLogs' ),
        ]);
    }

    public function orderUpdateStatus(Order $order)
    {
        $validated = request()->validate([
            'status' => 'required|in:Pending,Processing,Completed,Cancelled',
        ]);

        $order->update($validated);
        $this->reloadOrders();
        if($order->wasChanged()) {
          Activity::create([
             "log_name" => "Order",
             "description" => "Order status updated",
             "subject_type" => Order::class,
             "subject_id" => $order->id,
             "event" => "updated",
             "causer_type" => User::class,
             "causer_id" => auth()->user()->id,
             "properties" => $order
          ]);
        };
        return back()->with('success', 'Order status updated successfully');
    }

    public function orderInvoice($orderId)
    {   
        $order = Order::with('user', 'products', 'paymentLogs')->where('order_id', $orderId)->firstOrFail();
        $order->load(['user', 'products', 'paymentLogs']);

        $pdf = Pdf::loadView('invoices.order', [
            'order' => $order,
        ]);
        Activity::create([
            "log_name" => "Order",
            "description" => "Order invoice generated",
            "subject_type" => Order::class,
            "event" => "created",
            "subject_id" => $order->id,
            "causer_type" => User::class,
            "causer_id" => auth()->user()->id,
            "properties" => $order
        ]);
        return $pdf->stream("invoice-order-{$order->order_id}.pdf");
    }


    public function orderDestroy(Order $order)
    {
        
        $order->delete();

        return redirect('/admin/orders')->with('success', 'Order deleted successfully');
    }
        public function reloadOrders()
    {
        $orders = Order::all();

        foreach ($orders as $order) {
            $order->update(['total' => $order->products->sum(function ($product) {
                return $product->pivot->amount * $product->pivot->price ;
            })]);
        }

        
        
    }

    public function orderDestroyProduct(Order $order, Product $product)
    {
        $order->products()->detach($product->id);
        $this->reloadOrders();
        return back()->with('success', 'Product removed from order successfully');
    }

    public function orderUpdateProduct(Order $order, Product $product)
    {
        $validated = request()->validate([
            'amount' => 'required|integer|min:0',
        ]);

        $amount = (int) $validated['amount'];

        if ($amount <= 0) {
            // If amount is zero or less, detach the product from the order
            $order->products()->detach($product->id);
        } else {
            // Update existing pivot amount. Keep pivot price as is if present.
            $existing = $order->products()->wherePivot('product_id', $product->id)->first();
            if ($existing) {
                $price = $existing->pivot->price;
                $order->products()->updateExistingPivot($product->id, [
                    'amount' => $amount,
                ]);
            }
        }

        $this->reloadOrders();

        return back()->with('success', 'Order product quantity updated successfully');
    }


    public function customerIndex()
    {
        $customers = User::where('role', 'customer')->withCount('orders')->withSum(['orders' => function ($query) {
            $query->where('status', 'completed');
        }], 'total')->with('orders')->orderBy('orders_sum_total', 'desc')->get();

        return Inertia::render('Admin/AdminCustomers', [
            'customers' => $customers,
        ]);
    }

    public function customerShow($custome)
    {
        $id = intval(substr($custome, strrpos($custome, '-') + 1));;
        $customer = User::where('id', $id)->with('orders')->withCount('orders')->withSum(['orders' => function ($query) {
            $query->where('status', 'completed');
            }], 'total')->first();
        return Inertia::render('Admin/AdminCustomerView', [
            'customer' => $customer,
        ]);
    }

    public function customerUpdateStatus(User $customer)
    {
        $validated = request()->validate([
            'status' => 'required|in:active,inactive,banned',
        ]);

        $customer->update($validated);
        if($customer->wasChanged()) {
            Activity::create([
                "log_name" => "Customer",
                "description" => "Customer status updated",
                "subject_type" => User::class,
                "event" => "updated",
                "subject_id" => $customer->id,
                "causer_type" => User::class,
                "causer_id" => auth()->user()->id,
                "properties" => $customer
            ]);
        }
        return back()->with('success', 'Customer status updated successfully');
    
    }

        public function settings()
    {
        return Inertia::render('Admin/AdminSettings',
            [
                'settings' => Setting::all(),
            ]
        );
    }

public function settingsUpdate()
{
    $validated = request()->validate([
        'site_name' => 'required|string',
        'site_description' => 'nullable|string',
        'discord_link' => 'nullable|url',
        'maintenance_mode' => 'required',
        'Meta_title' => 'nullable|string',
        'Meta_description' => 'nullable|string',
        'default_currency' => 'required|string',
        'tax_rate' => 'required|numeric',
        'developer_badge' => 'required',
        'email_notifications' => 'required',
    ]);

    // Convert boolean-like values to '1' or '0'
    $booleanFields = ['maintenance_mode', 'developer_badge', 'email_notifications'];
    foreach ($booleanFields as $field) {
        if (isset($validated[$field])) {
            $validated[$field] = ($validated[$field] == '1') ? '1' : '0';
        }
    }

    $changesMade = false;

    foreach ($validated as $key => $value) {
        $setting = Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        if ($setting->wasChanged()) {
            $changesMade = true;
        }
    }

    if ($changesMade) {
        Activity::create([
            "log_name" => "Settings",
            "description" => "Settings updated",
            "causer_type" => User::class,
            "causer_id" => auth()->user()->id,
            "event" => "updated",
            "properties" => $validated
        ]);
    }

    return back()->with('success', 'Settings updated successfully');
}

    public function CustomerMailSend($userId){
        $user = User::where('id', $userId)->get('email')->first();
        $customer = User::where('id', $userId)->first();
        $discord = Setting::where('key', 'discord_link')->first()?->value;
        $name = Setting::where('key', 'site_name')->first()?->value;
        $validated = request()->validate([
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $subject = $validated['subject'];
        $body = $validated['message'];


        try {
            Mail::to($user)->send(new CustomerMail($customer, $subject, $body , $discord, $name));
            Activity::create([
               "log_name" => "Customer",
               "description" => "Customer email sent successfully",
               "subject_type" => User::class,
               "subject_id" => $customer->id,
               "causer_type" => User::class,
               "event" => "mail_sent",
               "causer_id" => auth()->user()->id,
               "properties" => $validated
            ]);
        } catch (\Throwable $th) {
            Activity::create([
                "log_name" => "Customer",
                "description" => "Customer email sent failed",
                "subject_type" => User::class,
                "subject_id" => $customer->id,
                "event" => "mail_sent",
                "causer_type" => User::class,
                "causer_id" => auth()->user()->id,
                "properties" => $validated. "Error: " . $th->getMessage()
            ]);
        }
        
        return back()->with('success', 'Emails sent successfully');
    }

    public function Logs()
    {
        $logs = Activity::orderBy('created_at', 'desc')->get();
        $users = User::where('role', 'admin')->get();
        return Inertia::render('Admin/AdminLogs', [
            'logs' => $logs
            , 'users' => $users
        ]);
    }
    public function LogShow($id)
    {
        $log = Activity::where('id', $id)->first();
        return Inertia::render('Admin/AdminLogDetail', [
            'log' => $log
        ]);
    }
}

