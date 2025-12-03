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

        .meta-item {
            text-align: right;
        }

        .meta-label {
            color: #6b7280;
            font-size: 11px;
        }

        .meta-value {
            color: #1f2937;
            font-weight: 600;
        }

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

        .right-align {
            text-align: right;
        }

        .bold {
            font-weight: 600;
        }

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

        .summary-label {
            color: #6b7280;
        }

        .summary-value {
            color: #1f2937;
            font-weight: 600;
            text-align: right;
        }

        .summary-row.total {
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 16px;
        }

        .summary-row.total .summary-label {
            color: #111827;
            font-weight: 700;
        }

        .summary-row.total .summary-value {
            color: #06b6d4;
            font-weight: 700;
            font-size: 18px;
        }

        /* Page 2 */
        .page-2-header {
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }

        .section {
            margin-bottom: 30px;
            break-inside: avoid;
        }

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
            display: inline-block;
            width: 3px;
            height: 16px;
            background: #06b6d4;
            flex-shrink: 0;
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
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            background: #f3f4f6;
            color: #111827;
        }

        .status-paid {
            background: #ecfdf3;
            color: #16a34a;
        }

        .status-pending {
            background: #fffbeb;
            color: #d97706;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .page {
                padding: 20px;
            }

            .header {
                flex-direction: column;
                gap: 20px;
            }

            .invoice-details {
                text-align: left;
            }

            .info-section {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .invoice-meta {
                grid-template-columns: 1fr;
                text-align: left;
            }

            .meta-item {
                text-align: left;
            }

            .invoice-title {
                font-size: 24px;
            }

            table {
                font-size: 12px;
            }

            table th,
            table td {
                padding: 8px;
            }

            .summary-box {
                width: 100%;
                max-width: 320px;
            }
        }

        @media print {
            body {
                background: white;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 100%;
                margin: 0;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    @php
        $customer = $order->user;
        $customerName = trim($customer->name ?? '') ?: 'Customer';
        $customerEmail = trim($customer->email ?? '') ?: 'N/A';
        $customerAddress = trim($customer->address ?? '') ?: 'N/A';

        $products = $order->products ?? collect();
        $lineSubtotal = $products->sum(function ($product) {
            return ($product->pivot->price ?? $product->price ?? 0) * ($product->pivot->amount ?? 0);
        });

        $tax = $order->tax_total ?? 0;
        $shipping = $order->shipping_total ?? 0;
        $grandTotal = $order->total ?? ($lineSubtotal + $tax + $shipping);
        $discount = max(0, ($lineSubtotal + $tax + $shipping) - $grandTotal);

        $invoiceDate = $order->created_at ? \Illuminate\Support\Carbon::parse($order->created_at) : null;
        $orderStatus = $order->status ?? 'Pending';
        $paymentStatus = match (strtolower($orderStatus)) {
            'completed' => 'Paid',
            'cancelled' => 'Refunded',
            default => 'Pending',
        };
    @endphp

    <!-- PAGE 1 -->
    <div class="container">
        <div class="page">
            <!-- Header -->
            <div class="header">
                <div class="header-left">
                    <img src="{{ public_path('frost.png') }}" alt="{{ config('app.name') }}" class="company-logo">
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
                            <div class="meta-value">#{{ $order->order_id ?? $order->id }}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Date</div>
                            <div class="meta-value">{{$order->created_at->format('M d, Y') }}</div>
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
                        <div>{{ $order->user->address ?? 'N/A' }}</div>
                    </div>
                    <hr style="margin: 20px 0;">
                    <div class="section-title">Order Status</div>
                    <div class="section-content">
                        <div style="margin-bottom: 8px;">
                            <strong>Order ID:</strong> #{{ $order->order_id ?? $order->id }}
                        </div>
                        <div style="margin-bottom: 8px;">
                            <strong>Order Date:</strong> {{ $order->created_at->format('M d, Y') }} - {{ $order->created_at->format('H:i A') }}
                        </div>
                        <div>
                            <span class="status-pill status-{{ strtolower($paymentStatus) === 'paid' ? 'paid' : 'pending' }}">
                                {{ $paymentStatus }}
                            </span>
                        </div>
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
                    @forelse($products as $product)
                        @php
                            $price = $product->pivot->price ?? $product->price ?? 0;
                            $quantity = $product->pivot->amount ?? 0;
                            $total = $price * $quantity;
                        @endphp
                        <tr>
                            <td>{{ $product->name }}</td>
                            <td>${{ number_format($price, 2) }}</td>
                            <td>{{ $quantity }}</td>
                            <td class="right-align bold">${{ number_format($total, 2) }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="right-align">No products found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            <!-- Summary -->
            <div class="summary">
                <div class="summary-box">
                    <div class="summary-row">
                        <span class="summary-label">Subtotal</span>
                        <span class="summary-value">${{ number_format($lineSubtotal, 2) }}</span>
                    </div>
                    @if ($tax > 0)
                        <div class="summary-row">
                            <span class="summary-label">Tax</span>
                            <span class="summary-value">${{ number_format($tax, 2) }}</span>
                        </div>
                    @endif
                    @if ($shipping > 0)
                        <div class="summary-row">
                            <span class="summary-label">Shipping</span>
                            <span class="summary-value">${{ number_format($shipping, 2) }}</span>
                        </div>
                    @endif
                    @if ($discount > 0)
                        <div class="summary-row">
                            <span class="summary-label">Discount</span>
                            <span class="summary-value">-${{ number_format($discount, 2) }}</span>
                        </div>
                    @endif
                    <div class="summary-row total">
                        <span class="summary-label">Total</span>
                        <span class="summary-value">${{ number_format($grandTotal, 2) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 2 -->
        <div class="page">
            <div class="page-2-header">
                Invoice #{{ $order->order_id ?? $order->id }} • {{ $invoiceDate?->format('M d, Y') }} • Page 2 of 2
            </div>

            <!-- Terms -->
            <div class="section">
                <h3>Terms & Conditions</h3>
                <ul class="terms-list">
                    <li>Payment is due upon receipt of invoice</li>
                    <li>All sales are final and non-refundable except where required by law</li>
                    <li>Products are delivered as digital content instantly upon purchase</li>
                    <li>Customer agrees to terms of service upon purchase</li>
                </ul>
            </div>

            <!-- Payment Info -->
            <div class="section">
                <h3>Payment Information</h3>
                <div class="section-text">
                    <strong>Amount Due:</strong> ${{ number_format($grandTotal, 2) }}<br>
                    <strong>Payment Status:</strong> {{ $paymentStatus }}<br>
                    <strong>Invoice Date:</strong> {{ $invoiceDate?->format('M d, Y') ?? 'N/A' }}
                </div>
            </div>

            <!-- Support -->
            <div class="section">
                <h3>Support</h3>
                <div class="section-text">
                    Need help? Contact our support team:<br><br>
                    <strong>Email:</strong> support@frostm.store<br>
                    <strong>Discord:</strong> Join our server for instant support<br>
                    <strong>Response Time:</strong> 24/7 availability
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div>Thank you for your business!</div>
                <div style="margin-top: 10px;">© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</div>
            </div>
        </div>
    </div>
</body>
</html>
