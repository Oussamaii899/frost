<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Setting;
use App\Models\Visit;
use Inertia\Inertia;

use Carbon\Carbon;

use Illuminate\Support\Facades\Mail;
use App\Mail\CustomerMail;

use Barryvdh\DomPDF\Facade\Pdf;

class AdminController extends Controller
{
    public function dashboard()
    {


        //revenue calculation
        $thisMonthR = Order::where('status', 'completed')
            ->whereDate('created_at', '>=', now()->subMonth())
            ->with('products')
            ->get()
            ->sum(function ($o) {
                return $o->products->sum(function ($p) {
                    return $p->pivot->amount * $p->pivot->price;
                });
            });
        
        $beforeLastMonthR = Order::where('status', 'completed')
            ->whereDate('created_at', '<', now()->subMonth())
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
        $thisMonthO = Order::whereDate('created_at', '>=', now()->subMonth())->count();
        $beforeLastMonthO = Order::whereDate('created_at', '<', now()->subMonth())->count();
        $trendO = $beforeLastMonthO > 0
            ? round((($thisMonthO - $beforeLastMonthO) / $beforeLastMonthO) * 100, 1)
            : 0;

        


        //customers calculation
        $thisMonthC = User::where('role', 'customer')->whereDate('created_at', '>=', now()->subMonth())->count();
        $beforeLastMonthC = User::where('role', 'customer')->whereDate('created_at', '<', now()->subMonth())->count();
        $trendC = $beforeLastMonthC > 0
            ? round((($thisMonthC - $beforeLastMonthC) / $beforeLastMonthC) * 100, 1)
            : 0;



        //stock calculation
        $thisMonthS = Product::whereDate('created_at', '>=', now()->subMonth())->sum('stock');
        $beforeLastMonthS = Product::whereDate('created_at', '<', now()->subMonth())->sum('stock');
        $trendS = $beforeLastMonthS > 0
            ? round((($thisMonthS - $beforeLastMonthS) / $beforeLastMonthS) * 100, 1)
            : 0;
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
                'value' => Order::count(),
                'icon' => 'ShoppingCart',
                'trend' => $trendO . '% from last month',
                'trendUp' => $trendO >= 0 ? true : false,
                'delay' => '0.2s',
            ],
            [
                'title' => 'Total Stock Items',
                'value' => Product::sum('stock'),
                'icon' => 'Package',
                'trend' => $trendS . '% from last month',
                'trendUp' => $trendS >= 0 ? true : false,
                'delay' => '0.3s',
            ],
            [
                'title' => 'Total Customers',
                'value' => User::where('role', 'customer')->count(),
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
        Product::create($validated);

        return redirect('/admin/products')->with('success', 'Product created successfully');
    }

    public function productShow($slug)
    {
        $product = Product::with('category')->where('slug', $slug)->firstOrFail();
        return Inertia::render('Admin/AdminProductView', [
            'product' => $product,
        ]);
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
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        return redirect('/admin/products')->with('success', 'Product updated successfully');
    }

    public function productDestroy(Product $product)
    {
        $product->delete();

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


        Category::create($validated);

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

        return redirect('/admin/categories')->with('success', 'Category updated successfully');
    }

    public function categoryDestroy(Category $category)
    {
        $category->delete();

        return redirect('/admin/categories')->with('success', 'Category deleted successfully');
    }

    public function orderIndex()
    {
        $orders = Order::with('user')->get();
        $this->reloadOrders();
        return Inertia::render('Admin/AdminOrders', [
            'orders' => $orders,
        ]);
    }

    public function orderShow($orderId)
    {
        $order = Order::with('products', 'user')->where('order_id', $orderId)->firstOrFail();
        $this->reloadOrders();
        return Inertia::render('Admin/AdminOrderDetail', [  
            'order' => $order->load('products', 'user'),
        ]);
    }

    public function orderUpdateStatus(Order $order)
    {
        $validated = request()->validate([
            'status' => 'required|in:Pending,Processing,Completed,Cancelled',
        ]);

        $order->update($validated);
        $this->reloadOrders();

        return back()->with('success', 'Order status updated successfully');
    }

    public function orderInvoice($orderId)
    {   
        $order = Order::with('user', 'products')->where('order_id', $orderId)->firstOrFail();
        $order->load(['user', 'products']);

        $pdf = Pdf::loadView('invoices.order', [
            'order' => $order,
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
                return $product->pivot->amount * $product->pivot->price;
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

        // Convert boolean-like values to '1' or '0' for storage
        $booleanFields = ['maintenance_mode', 'developer_badge', 'email_notifications'];
        foreach ($booleanFields as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = ($validated[$field] === '1' || $validated[$field] === true || $validated[$field] === 1) ? '1' : '0';
            }
        }

        // Update or create settings
        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
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

        Mail::to($user)->send(new CustomerMail($customer, $subject, $body , $discord, $name));
        return back()->with('success', 'Emails sent successfully');
    }
}

