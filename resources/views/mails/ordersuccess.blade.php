<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation - {{ $order->order_id }}</title>
</head>

<body style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:0; background:#f5f7fa;">

@php
    $companyName  = config('app.name');
    $supportEmail = "support@frostm.store";
    $supportPhone = "+212 6 10 20 30 34";

    $customerName  = $order->user->name ?? 'Customer';
    $customerEmail = $order->user->email ?? 'N/A';

    // Items
    $items = $order->products->map(function ($p) {
        return [
            'name' => $p->name,
            'quantity' => $p->pivot->amount,
            'price' => $p->pivot->price,
            'total' => $p->pivot->price * $p->pivot->amount
        ];
    });

    // Digital stock items (generic payload)
    $digitalItems = $order->stock->groupBy('product_id');
    $formattedDate = $order->created_at->format("F d, Y • h:i A");
    $totalFormatted = "$" . number_format($order->total, 2);
@endphp

<div style="max-width:700px; margin:0 auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.1);">

    {{-- HEADER --}}
    <div style="background:linear-gradient(135deg, #00d4ff 0%, #0084ff 100%); color:white; text-align:center; padding:40px 30px;">
        <h1 style="margin:0; font-size:28px; font-weight:600;">Order Confirmation</h1>
        <p style="opacity:0.85; font-size:14px; margin-top:8px;">{{ $companyName }} Support Team</p>
    </div>

    {{-- CONTENT --}}
    <div style="padding:40px 30px;">

        {{-- Greeting --}}
        <p style="font-size:16px; color:#333;">
            Hello <strong style="color:#0084ff;">{{ $customerName }}</strong>,
        </p>

        {{-- MAIN MESSAGE (DIGITAL PRODUCTS ONLY - FIXED TEXT) --}}
        <div style="background:#f8f9fa; border-left:4px solid #00d4ff; padding:20px; border-radius:6px; margin:25px 0; line-height:1.7; color:#555;">
            Thank you for your purchase! Your order has been successfully processed.
            <br><br>
            Since your purchase contains <strong>digital products</strong>, you can access them instantly from your customer dashboard under the <strong>Orders</strong> section.
            or if you have any questions, you can contact our support in our discord Server for further assistance or in support on our website.
        </div>

        {{-- ORDER DETAILS --}}
        <div style="background:#f0f8ff; padding:20px; border-radius:6px; border:1px solid #00d4ff; margin:25px 0;">
            <h3 style="color:#0084ff; font-size:14px; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
                Order Details
            </h3>

            <p style="color:#444; font-size:14px;"><strong>Order ID:</strong> {{ $order->order_id }}</p>
            <p style="color:#444; font-size:14px;"><strong>Order Date:</strong> {{ $formattedDate }}</p>
            <p style="color:#444; font-size:14px;">
                <strong>Status:</strong>
                <span style="color:#0084ff; font-weight:600;">{{ ucfirst($order->status) }}</span>
            </p>
        </div>

        {{-- ITEMS --}}
        <div style="background:#f0f8ff; padding:20px; border-radius:6px; border:1px solid #00d4ff; margin:25px 0;">
            <h3 style="color:#0084ff; font-size:14px; margin-bottom:15px; text-transform:uppercase; letter-spacing:0.5px;">
                Items Purchased
            </h3>

            @foreach($items as $item)
                <div style="display:flex; justify-content:space-between; padding-bottom:8px; margin-bottom:10px; border-bottom:1px solid #e3e3e3;">
                    <div>
                        <p style="font-size:14px; color:#333; margin:0;"><strong>{{ $item['name'] }}</strong></p>
                        <p style="font-size:12px; color:#777; margin:0;">Quantity: {{ $item['quantity'] }}</p>
                    </div>
                    <p style="font-size:14px; font-weight:600; color:#555; margin:0;">
                        ${{ number_format($item['total'], 2) }}
                    </p>
                </div>
            @endforeach

            <div style="display:flex; justify-content:space-between; padding-top:12px; border-top:2px solid #00d4ff;">
                <p style="font-size:16px; font-weight:600; color:#333; margin:0;">Total:</p>
                <p style="font-size:16px; font-weight:600; color:#00d4ff; margin:0;">{{ $totalFormatted }}</p>
            </div>
        </div>
        @foreach($digitalItems as $productId => $stocks)
            @php
                $product = $order->products->firstWhere('id', $productId);
            @endphp
        
            <div style="margin-bottom:20px;">
                <p style="font-size:14px; font-weight:600; color:#333; margin-bottom:8px;">
                    {{ $product->name ?? 'Product' }}
                </p>
        
                @foreach($stocks as $index => $stock)
                    <div style="background:#ffffff; border:1px dashed #ffcc00; border-radius:6px; padding:12px; margin-bottom:10px;">
                        <p style="font-size:12px; font-weight:600; color:#ff9800; margin-bottom:6px;">
                            Item #{{ $loop->iteration }}
                        </p>
        
                        @if(is_array($stock->data))
                            @foreach($stock->data as $key => $value)
                                <p style="font-size:13px; color:#444; margin:2px 0;">
                                    <strong>{{ ucfirst($key) }}:</strong>
                                    <span style="font-family:monospace;">{{ $value }}</span>
                                </p>
                            @endforeach
                        @elseif(!is_null($stock->data))
                            <p style="font-size:13px; color:#444;">
                                {{ $stock->data }}
                            </p>
                        @endif
                    </div>
                @endforeach
            </div>
        @endforeach
        
        
        {{-- PAYMENT DETAILS --}}
        <div style="background:#f0f8ff; padding:20px; border-radius:6px; border:1px solid #00d4ff; margin:25px 0;">
            <h3 style="color:#0084ff; font-size:14px; text-transform:uppercase; margin-bottom:10px;">
                Payment Information
            </h3>

            <p style="color:#444; font-size:14px;">
                <strong>Payment Method:</strong> PayPal
            </p>

            @if($order->payment_logs)
                <p style="color:#444; font-size:14px;"><strong>Payment ID:</strong> {{ $order->payment_logs->payment_id }}</p>
            @endif

            <p style="color:#444; font-size:14px;">
                <strong>Amount Paid:</strong> {{ $totalFormatted }}
            </p>
        </div>

        {{-- DOWNLOAD INVOICE --}}
        <div style="text-align:center; margin:35px 0;">
            <a href="{{ route('customer.order.invoice', $order->order_id) }}"
               style="display:inline-block; padding:12px 25px; background:linear-gradient(135deg,#00d4ff,#0084ff);
               color:white; text-decoration:none; border-radius:6px; font-size:14px; font-weight:600;">
                Download Invoice (PDF)
            </a>
        </div>

    </div>

    {{-- FOOTER --}}
    <div style="padding:30px; background:#f5f7fa; text-align:center; border-top:1px solid #e3e3e3;">
        <p style="font-size:13px; color:#777;">If you have any questions, feel free to contact our support.</p>
        <p style="font-size:13px; color:#777;"><strong>{{ $supportEmail }}</strong></p>
        <p style="font-size:13px; color:#777;"><strong>{{ $supportPhone }}</strong></p>
        <p style="margin-top:15px; font-size:12px; color:#999;">
            © {{ date('Y') }} {{ $companyName }} — All rights reserved.
        </p>
    </div>

</div>

</body>
</html>
