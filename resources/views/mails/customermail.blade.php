<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #00d4ff 0%, #0084ff 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
        }
        .greeting strong {
            color: #0084ff;
        }
        .message-box {
            background: #f8f9fa;
            border-left: 4px solid #00d4ff;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
            line-height: 1.8;
            color: #555;
            font-size: 15px;
        }
        .info-section {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
            border: 1px solid #00d4ff;
        }
        .info-section h3 {
            color: #0084ff;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-section p {
            color: #555;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        .info-section p:last-child {
            margin-bottom: 0;
        }
        .action-buttons {
            display: flex;
            gap: 15px;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: linear-gradient(135deg, #00d4ff 0%, #0084ff 100%);
            color: white;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 132, 255, 0.3);
        }
        .btn-secondary {
            background: #e0e0e0;
            color: #333;
        }
        .btn-secondary:hover {
            background: #d0d0d0;
            transform: translateY(-2px);
        }
        .footer {
            background: #f5f7fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            color: #999;
            font-size: 13px;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
        }
        .contact-item {
            font-size: 13px;
            color: #0084ff;
        }
        .divider {
            height: 1px;
            background: #e0e0e0;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .header {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .content {
                padding: 25px 20px;
            }
            .action-buttons {
                flex-direction: column;
            }
            .btn {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{{ $subject ?? 'Customer Support' }}</h1>
            <p>{{ $name ?? 'Frost' }} Support Team</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Greeting -->
            <div class="greeting">
                Hello <strong>{{ $customer->name ?? 'Valued Customer' }}</strong>,
            </div>

            <!-- Main Message -->
            <div class="message-box">
                {{ $body ?? 'This is a message from our support team.' }}
            </div>

            <!-- Additional Information (if provided) -->
            @if(isset($additionalInfo) && !empty($additionalInfo))
                <div class="info-section">
                    <h3>{{ $infoTitle ?? 'Important Information' }}</h3>
                    <p>{!! $additionalInfo !!}</p>
                </div>
            @endif

            <!-- Action Buttons (if provided) -->
            @if(isset($actionButtons) && count($actionButtons) > 0)
                <div class="action-buttons">
                    @foreach($actionButtons as $button)
                        <a href="{{ $button['url'] ?? '#' }}" class="btn {{ $button['type'] ?? 'btn-primary' }}">
                            {{ $button['label'] ?? 'Click Here' }}
                        </a>
                    @endforeach
                </div>
            @endif

            <!-- Order Details (if provided) -->
            @if(isset($order))
                <div class="info-section">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> {{ $order->order_id }}</p>
                    <p><strong>Date:</strong> {{ $order->created_at->format('Y-m-d H:i') }}</p>
                    <p><strong>Status:</strong> <span style="color: #00d4ff; font-weight: 600;">{{ ucfirst($order->status ?? 'Pending') }}</span></p>
                    @if($order->total)
                        <p><strong>Total:</strong> ${{ number_format($order->total, 2) }}</p>
                    @endif
                </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <div class="divider"></div>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td align="center" style="padding-top: 15px;">
                
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                
                                <!-- Item 1 -->
                                <td style="padding: 0 20px; font-size: 13px; color: #0084ff;">
                                    support@frostm.store
                                </td>
                
                                <!-- Item 2 -->
                                <td style="padding: 0 20px; font-size: 13px; color: #0084ff;">
                                    +212 6 10 20 30 34
                                </td>
                
                                <!-- Item 3 -->
                                <td style="padding: 0 20px; font-size: 13px; color: #0084ff;">
                                    <a href="{{ $discord }}" target="_blank" style="color:#0084ff; text-decoration:none;">
                                        Discord Support
                                    </a>
                                </td>
                
                            </tr>
                        </table>
                
                    </td>
                </tr>
            </table>
                
            <p style="margin-top: 15px; font-size: 12px;">
                © {{ date('Y') }} {{ $name ?? 'Your Company' }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>