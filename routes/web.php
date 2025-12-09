<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\CustomerController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CheckoutController;

use App\Http\Middleware\Admin;
use App\Http\Middleware\Maintenance;
use App\Http\Middleware\RecordVisitors;

use Illuminate\Http\Request;

Route::middleware([Maintenance::class,RecordVisitors::class])->group(function () {
    Route::get('/', [CustomerController::class, 'homepage'])->name('home');

    Route::post('/accept-cookie', function () {
    return back()->withCookie(
        cookie('cookie_accepted', 'true', 60 * 24 * 365)
    );
    });

    Route::post('/decline-cookie', function () {
        return back()->withCookie(
            cookie('cookie_accepted', 'false', 60 * 24 * 365)
        );
    });

});




Route::middleware(['auth', 'verified', Maintenance::class])->group(function () {
    

    Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('dashboard');
    
    // Orders
    Route::get('/orders', [CustomerController::class, 'orders'])->name('customer.orders.index');
    Route::get('/orders/{order}', [CustomerController::class, 'orderDetail'])->name('customer.orders.show');
    
    // Profile
    Route::get('/profile', [CustomerController::class, 'profile'])->name('customer.profile');
    Route::put('/profile', [CustomerController::class, 'updateProfile'])->name('customer.profile.update');

    // Cart
    Route::get('/cart', [CustomerController::class, 'cart'])->name('customer.cart');
    
    // Support
    Route::get('/support', [CustomerController::class, 'support'])->name('customer.support');
    Route::post('/support', [CustomerController::class, 'submitSupport'])->name('customer.support.submit');


    Route::get('/layout', [CustomerController::class, 'Layout'])->name('customer.layout');


    Route::get('/order/success', function(Request $request){
        $storedData = [
            'order_id' => $request->order_id,
            'payment_id' => $request->payment_id,
            'payment_source' => $request->payment_source,
            'purchase_units' => $request->purchase_units,
            'payer' => $request->payer,
            'links' => $request->links,
            'created_at' => $request->created_at
        ];
        return Inertia::render('Customer/OrderSuccess', [
            'storedData' => $storedData
        ]);
    })->name('order.success');

    Route::post('/checkout', [CheckoutController::class, 'createOrder']);
    Route::post('/paypal/create', [CheckoutController::class, 'createPayPalOrder']);
    Route::post('/paypal/capture', [CheckoutController::class, 'capturePayPal']);
    Route::post('/order/cancel', [CheckoutController::class, 'cancelOrder']);
});

Route::middleware(['auth', 'verified', Admin::class])->group(function () {



    //Route::get('/update/stock', [CheckoutController::class, 'updateStock']);
      // Dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/layout', [AdminController::class, 'Layout'])->name('admin.layout');
    Route::get('/admin/notifications', [AdminController::class, 'notification'])->name('admin.notifications');

    // Products - CRUD with view
    Route::get('/admin/products', [AdminController::class, 'productIndex'])->name('admin.products.index');
    Route::get('/admin/products/create', [AdminController::class, 'productCreate'])->name('admin.products.create');
    Route::post('/admin/products', [AdminController::class, 'productStore'])->name('admin.products.store');
    Route::get('/admin/products/{product}', [AdminController::class, 'productShow'])->name('admin.products.show');
    Route::get('/admin/products/{product}/edit', [AdminController::class, 'productEdit'])->name('admin.products.edit');
    Route::put('/admin/products/{product}', [AdminController::class, 'productUpdate'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [AdminController::class, 'productDestroy'])->name('admin.products.destroy');
    
    Route::post('/admin/products/{product}/stock', [AdminController::class, 'StockAdd'])->name('stock.add');
    Route::delete('/admin/products/{product}/stock/remove', [AdminController::class, 'StockDelete'])->name('stock.delete');


    // Categories - CRUD with view
    Route::get('/admin/categories', [AdminController::class, 'categoryIndex'])->name('admin.categories.index');
    Route::get('/admin/categories/create', [AdminController::class, 'categoryCreate'])->name('admin.categories.create');
    Route::post('/admin/categories', [AdminController::class, 'categoryStore'])->name('admin.categories.store');
    Route::get('/admin/categories/{category}', [AdminController::class, 'categoryShow'])->name('admin.categories.show');
    Route::get('/admin/categories/{category}/edit', [AdminController::class, 'categoryEdit'])->name('admin.categories.edit');
    Route::put('/admin/categories/{category}', [AdminController::class, 'categoryUpdate'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}', [AdminController::class, 'categoryDestroy'])->name('admin.categories.destroy');
    
    // Orders - View and Edit
    Route::get('/admin/orders', [AdminController::class, 'orderIndex'])->name('admin.orders.index');
    Route::get('/admin/orders/{order}', [AdminController::class, 'orderShow'])->name('admin.orders.show');
    Route::put('/admin/orders/{order}/status', [AdminController::class, 'orderUpdateStatus'])->name('admin.orders.updateStatus');
    
    

    //Route::delete('/admin/orders/{order}', [AdminController::class, 'orderDestroy'])->name('admin.orders.destroy');
    //Route::delete('/admin/orders/{order}/products/{product}', [AdminController::class, 'orderDestroyProduct'])->name('admin.orders.products.destroy');
    //Route::put('/admin/orders/{order}/products/{product}', [AdminController::class, 'orderUpdateProduct'])->name('admin.orders.products.update');
    
    // Customers
    Route::get('/admin/customers', [AdminController::class, 'customerIndex'])->name('admin.customers.index');
    Route::get('/admin/customers/{customer}', [AdminController::class, 'customerShow'])->name('admin.customers.show');
    Route::put('/admin/customers/{customer}', [AdminController::class, 'customerUpdateStatus'])->name('admin.customers.update');
    Route::post('/admin/customers/{customer}/mail', [AdminController::class, 'CustomerMailSend'])->name('admin.customers.mail');


    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::put('/admin/settings', [AdminController::class, 'settingsUpdate'])->name('admin.settings.update');

    Route::get('/admin/logs', [AdminController::class, 'Logs'])->name('admin.logs');
    Route::get('/admin/logs/{id}', [AdminController::class, 'LogShow'])->name('admin.logs.show');
});
Route::middleware(['auth', Admin::class])->get('/admin/orders/{order}/invoice', [AdminController::class, 'orderInvoice'])
    ->name('admin.orders.invoice')->withoutMiddleware(\App\Http\Middleware\HandleInertiaRequests::class);
Route::middleware(['auth'])->get('/orders/{order}/invoice', [CustomerController::class, 'orderInvoice'])
    ->name('customer.order.invoice')->withoutMiddleware(\App\Http\Middleware\HandleInertiaRequests::class);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
