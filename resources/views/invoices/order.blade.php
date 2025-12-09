<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $order->order_id ?? $order->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1f2937;
            line-height: 1.6;
            background: #ffffff;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
        }

        /* Page styling */
        .page {
            padding: 40px;
            page-break-after: always;
        }

        .page:last-child {
            page-break-after: auto;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }

        .header-left {
            flex: 1;
        }

        .company-logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 10px;
        }

        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 5px;
        }

        .company-info {
            font-size: 12px;
            color: #6b7280;
        }

        .invoice-details {
            text-align: right;
        }

        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #06b6d4;
            margin-bottom: 15px;
        }

        .invoice-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 13px;
        }

        .meta-item { text-align: right; }
        .meta-label { color: #6b7280; font-size: 11px; }
        .meta-value { color: #1f2937; font-weight: 600; }

        /* Customer Section */
        .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }

        .info-box {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #06b6d4;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 10px;
            letter-spacing: 0.3px;
        }

        .section-content {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.7;
        }

        .section-content strong {
            color: #111827;
            display: block;
            margin-bottom: 3px;
        }

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        table thead {
            background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
            color: white;
        }

        table th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
        }

        table tbody tr {
            border-bottom: 1px solid #e5e7eb;
            break-inside: avoid;
        }

        table tbody tr:last-child {
            border-bottom: 2px solid #e5e7eb;
        }

        table td {
            padding: 12px;
            font-size: 13px;
        }

        .right-align { text-align: right; }
        .bold { font-weight: 600; }

        /* Summary */
        .summary {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }

        .summary-box {
            width: 320px;
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
        }

        .summary-label { color: #6b7280; }
        .summary-value { color: #1f2937; font-weight: 600; }

        .summary-row.total {
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 16px;
        }

        .summary-row.total .summary-label { color: #111827; font-weight: 700; }
        .summary-row.total .summary-value { color: #06b6d4; font-weight: 700; font-size: 18px; }

        /* Page 2 */
        .page-2-header {
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }

        .section { margin-bottom: 30px; break-inside: avoid; }
        .section h3 {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section h3::before {
            content: '';
            width: 3px;
            height: 16px;
            background: #06b6d4;
        }

        .section-text {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.8;
        }

        .terms-list {
            list-style: none;
            font-size: 13px;
            color: #4b5563;
            line-height: 1.8;
        }

        .terms-list li {
            padding-left: 18px;
            margin-bottom: 8px;
            position: relative;
        }

        .terms-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #06b6d4;
            font-weight: bold;
        }

        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
        }

        /* Status Pills */
        .status-pill {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
        }

        .status-paid { background: #ecfdf3; color: #16a34a; }
        .status-pending { background: #fffbeb; color: #d97706; }

    </style>
</head>

<body>

@php
    /** CUSTOMER & ORDER BASIC INFO **/
    $customer = $order->user;
    $customerName = $customer->name ?? 'Customer';
    $customerEmail = $customer->email ?? 'N/A';

    $products = $order->products ?? collect();
    $lineSubtotal = $products->sum(fn($p) => ($p->pivot->price ?? 0) * ($p->pivot->amount ?? 0));

    $tax = $order->tax_total ?? 0;
    $shipping = $order->shipping_total ?? 0;
    $grandTotal = $order->total ?? ($lineSubtotal + $tax + $shipping);

    $status = strtolower($order->status);
    $paymentStatus = $status === "completed" ? "Paid" : ($status === "cancelled" ? "Refunded" : "Pending");

    /** PAYPAL LOGS — same decoding as AdminOrderDetail **/
    $log = $order->paymentLogs ?? $order->payment_logs ?? null;
    $logArray = $log ? (is_array($log) ? $log : $log->toArray()) : [];

    function safeJson($v) {
        if (!$v) return [];
        if (is_array($v)) return $v;
        try { return json_decode($v, true) ?: []; }
        catch(Exception $e) { return []; }
    }

    $paymentSource = safeJson($logArray['payment_source'] ?? null)['paypal'] ?? [];
    $purchaseUnits = safeJson($logArray['purchase_units'] ?? null)[0] ?? [];
    $payer         = safeJson($logArray['payer'] ?? null) ?? [];
    $shippingAddr  = $purchaseUnits['shipping'] ?? [];
    $capture       = $purchaseUnits['payments']['captures'][0] ?? [];
@endphp

<!-- PAGE 1 -->
<div class="container">
    <div class="page">
        
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <img src="{{ public_path('frost.png') }}" class="company-logo">
                <div class="company-name">{{ config('app.name') }}</div>
                <div class="company-info">
                    <div>support@frostm.store</div>
                    <div>+212 6 10 20 30 34</div>
                </div>
            </div>

            <div class="invoice-details">
                <div class="invoice-title">INVOICE</div>

                <div class="invoice-meta">
                    <div class="meta-item">
                        <div class="meta-label">Invoice No.</div>
                        <div class="meta-value">#{{ $order->order_id }}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Date</div>
                        <div class="meta-value">{{ $order->created_at->format('M d, Y') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer Info -->
        <div class="info-section">

            <div class="info-box">
                <div class="section-title">Bill To</div>
                <div class="section-content">
                    <strong>{{ $customerName }}</strong>
                    <div>{{ $customerEmail }}</div>
                </div>
                <hr style="margin: 20px 0;">
                <div class="section-title">Order Status</div>
                <div class="section-content">
                    <strong>Order ID:</strong> {{ $order->order_id }}
                    <strong>Date:</strong> {{ $order->created_at->format('M d, Y - H:i A') }}
                    <span class="status-pill {{ $paymentStatus === 'Paid' ? 'status-paid' : 'status-pending' }}">
                        {{ $paymentStatus }}
                    </span>
                </div>
            </div>

        </div>

        <!-- Products Table -->
        <table>
            <thead>
                <tr>
                    <th style="width: 50%;">Product</th>
                    <th style="width: 15%;">Price</th>
                    <th style="width: 15%;">Qty</th>
                    <th style="width: 20%;" class="right-align">Total</th>
                </tr>
            </thead>
            <tbody>
            @foreach($products as $product)
                @php
                    $price = $product->pivot->price;
                    $qty   = $product->pivot->amount;
                    $total = $price * $qty;
                @endphp
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>${{ number_format($price,2) }}</td>
                    <td>{{ $qty }}</td>
                    <td class="right-align bold">${{ number_format($total,2) }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
            <div class="summary-box">
                <div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-value">${{ number_format($lineSubtotal,2) }}</span></div>

                @if($tax > 0)
                <div class="summary-row"><span class="summary-label">Tax</span><span class="summary-value">${{ number_format($tax,2) }}</span></div>
                @endif

                @if($shipping > 0)
                <div class="summary-row"><span class="summary-label">Shipping</span><span class="summary-value">${{ number_format($shipping,2) }}</span></div>
                @endif

                <div class="summary-row total">
                    <span class="summary-label">Total</span>
                    <span class="summary-value">${{ number_format($grandTotal,2) }}</span>
                </div>
            </div>
        </div>

        <!-- PAYMENT DETAILS (added new section) -->
        <div class="section" style="margin-top:40px;">
            <h3>Payment Details</h3>

            <div class="section-text">
                <strong>Payment Status:</strong> {{ ucfirst($paymentStatus) }}<br>

                @if(!empty($capture))
                    <strong>Capture ID:</strong> {{ $capture['id'] ?? 'N/A' }}<br>
                    <strong>Amount Paid:</strong> {{ $capture['amount']['currency_code'] ?? '' }} {{ $capture['amount']['value'] ?? '' }}<br>
                    <strong>Captured At:</strong> {{ $capture['create_time'] ?? 'N/A' }}<br>
                @endif

                <hr style="margin:15px 0;">

                <h4>Payer Information</h4>
                <strong>Name:</strong> {{ $payer['name']['given_name'] ?? '' }} {{ $payer['name']['surname'] ?? '' }}<br>
                <strong>Email:</strong> {{ $payer['email_address'] ?? 'N/A' }}<br>
                <strong>Country:</strong> {{ $payer['address']['country_code'] ?? 'N/A' }}<br>

                @if(!empty($shippingAddr))
                <hr style="margin:15px 0;">
                <h4>Billing / Shipping Address</h4>
                {{ $shippingAddr['name']['full_name'] ?? '' }}<br>
                {{ $shippingAddr['address']['address_line_1'] ?? '' }}<br>
                {{ $shippingAddr['address']['admin_area_2'] ?? '' }},
                {{ $shippingAddr['address']['postal_code'] ?? '' }}<br>
                {{ $shippingAddr['address']['country_code'] ?? '' }}<br>
                @endif
            </div>
        </div>

    </div>

    <!-- PAGE 2 -->
    <div class="page">
        <div class="page-2-header">
            Invoice #{{ $order->order_id }} • Page 2 of 2
        </div>

        <div class="section">
            <h3>Terms & Conditions</h3>
            <ul class="terms-list">
                <li>Payment is due upon receipt.</li>
                <li>All digital sales are final.</li>
                <li>Instant delivery upon completion of payment.</li>
                <li>By purchasing, you agree to our Terms of Service.</li>
            </ul>
        </div>

        <div class="section">
            <h3>Support</h3>
            <div class="section-text">
                Need help? Contact us:<br><br>
                <strong>Email:</strong> support@frostm.store<br>
                <strong>Discord:</strong> Join our server<br>
                <strong>Response:</strong> Usually under 1 hour
            </div>
        </div>

        <div class="footer">
            © {{ date('Y') }} {{ config('app.name') }} — All rights reserved.
        </div>
    </div>
</div>

</body>
</html>
