<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Failed - {{ $order->order_id }}</title>
</head>

<body style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:0; background:#f5f7fa;">

@php
    $companyName  = config('app.name');
    $supportEmail = "support@frostm.store";
    $supportPhone = "+212 6 10 20 30 34";

    $customerName  = $order->user->name ?? 'Customer';
    $formattedDate = $order->created_at->format("F d, Y • h:i A");
@endphp

<div style="max-width:700px; margin:0 auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.1);">

    {{-- HEADER --}}
    <div style="background:linear-gradient(135deg, #ff4d4d 0%, #b30000 100%); color:white; text-align:center; padding:40px 30px;">
        <h1 style="margin:0; font-size:28px; font-weight:600;">Payment Failed</h1>
        <p style="opacity:0.85; font-size:14px; margin-top:8px;">{{ $companyName }} Support Team</p>
    </div>

    {{-- CONTENT --}}
    <div style="padding:40px 30px;">

        {{-- Greeting --}}
        <p style="font-size:16px; color:#333;">
            Hello <strong style="color:#b30000;">{{ $customerName }}</strong>,
        </p>

        {{-- MAIN MESSAGE --}}
        <div style="background:#fff4f4; border-left:4px solid #ff4d4d; padding:20px; border-radius:6px; margin:25px 0; line-height:1.7; color:#555;">
            Unfortunately, your recent payment attempt for order <strong>{{ $order->order_id }}</strong> could not be processed.
            <br><br>
            No amount has been charged. You may try completing the payment again or choose another payment method.
            <br><br>
            If you believe this is an error or continue experiencing issues, please contact our support team.
        </div>

        {{-- ORDER DETAILS --}}
        <div style="background:#fff4f4; padding:20px; border-radius:6px; border:1px solid #ff4d4d; margin:25px 0;">
            <h3 style="color:#b30000; font-size:14px; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
                Order Details
            </h3>

            <p style="color:#444; font-size:14px;"><strong>Order ID:</strong> {{ $order->order_id }}</p>
            <p style="color:#444; font-size:14px;"><strong>Order Date:</strong> {{ $formattedDate }}</p>
            <p style="color:#444; font-size:14px;">
                <strong>Status:</strong>
                <span style="color:#b30000; font-weight:600;">Failed</span>
            </p>
        </div>

        {{-- RETRY PAYMENT BUTTON --}}
        <div style="text-align:center; margin:35px 0;">
            <a href="{{ route('customer.cart') }}"
               style="display:inline-block; padding:12px 25px; background:linear-gradient(135deg,#ff4d4d,#b30000);
               color:white; text-decoration:none; border-radius:6px; font-size:14px; font-weight:600;">
                Retry Payment
            </a>
        </div>

    </div>

    {{-- FOOTER --}}
    <div style="padding:30px; background:#f5f7fa; text-align:center; border-top:1px solid #e3e3e3;">
        <p style="font-size:13px; color:#777;">If you need help, please contact our support team.</p>
        <p style="font-size:13px; color:#777;"><strong>{{ $supportEmail }}</strong></p>
        <p style="font-size:13px; color:#777;"><strong>{{ $supportPhone }}</strong></p>
        <p style="margin-top:15px; font-size:12px; color:#999;">
            © {{ date('Y') }} {{ $companyName }} — All rights reserved.
        </p>
    </div>

</div>

</body>
</html>
