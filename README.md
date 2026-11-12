# Frost

Frost is a full-stack e-commerce application built with Laravel, React, Inertia.js, and Tailwind CSS. It combines a storefront for customers with a management dashboard for administrators, supporting product browsing, cart workflows, PayPal checkout, order tracking, inventory control, customer management, and store settings.

## Overview

The application is designed as a modern online shop with two primary experiences:

- Customer experience: browse products, filter by category, manage a cart, place orders, review order history, update profile information, and generate invoices.
- Admin experience: manage products, categories, stock, orders, customers, store settings, and activity logs through a dashboard.

The backend is powered by Laravel 12, while the frontend uses React components rendered through Inertia, giving the project a polished SPA-like experience without breaking server-side routing patterns.

## Key Features

### Storefront
- Public home page with products and categories
- Category-based product browsing
- Shopping cart functionality and checkout flow
- Customer login, registration, email verification, and password recovery
- Order history, order details, and downloadable PDFs
- Profile management with avatar/banner uploads
- Support page for customer messaging

### Checkout and Payments
- Order creation with inventory validation
- PayPal integration for order creation and capture
- Order status handling (Pending, Processing, Completed, Cancelled)
- Payment logs and order success/cancel flows

### Inventory and Commerce
- Product catalog with pricing, stock counts, and category associations
- Stock reservation and order-level stock tracking via dedicated stock records
- Admin monitoring of low-stock and out-of-stock products
- Order totals and revenue analytics

### Admin Dashboard
- Revenue, order, customer, and stock summaries
- Recent orders and product stock status panels
- Product CRUD management
- Category CRUD management
- Customer management and targeted mail sending
- Store settings configuration
- Activity/activity log viewing
- Maintenance mode control and global settings driven behavior

### Additional Platform Features
- Rate-limited checkout and support endpoints
- Middleware-based maintenance mode with admin bypass
- Visitor tracking and geographic activity monitoring
- PDF invoice generation for order records
- Security-related authentication and authorization middleware

## Tech Stack

- PHP 8.2
- Laravel 12
- Inertia.js
- React 19
- TypeScript
- Tailwind CSS
- Vite
- PayPal API integration
- Spatie Activity Log
- Dompdf for PDF invoice generation

## Application Structure

```text
app/
  Http/
    Controllers/
    Middleware/
  Models/
  Jobs/
  Mail/
  Services/
config/
database/
public/
resources/
  js/
  css/
routes/
tests/
```

Key modules include:
- `app/Http/Controllers/CustomerController.php` for storefront and customer account flows
- `app/Http/Controllers/AdminController.php` for admin operations and dashboard logic
- `app/Http/Controllers/CheckoutController.php` for order creation and PayPal payment handling
- `app/Services/PayPalService.php` for PayPal API calls
- `app/Models/Product.php`, `Order.php`, `Category.php`, `Stock.php`, and `User.php` for core business data
- `routes/web.php` for the app’s public and authenticated routes

## Database and Data Model

The app is built around a commerce-centric schema with relationships between:
- users and orders
- orders and products via a many-to-many relationship
- products and categories
- products and stock units for inventory tracking
- settings and maintenance mode configuration

This allows the platform to handle both storefront interactions and operational management without separating the business logic into multiple projects.

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm
- A MySQL or SQLite-compatible database
- PayPal sandbox or live credentials

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frost
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install frontend dependencies:

```bash
npm install
```

4. Create your environment file:

```bash
cp .env.example .env
```

If you are using Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

5. Generate the Laravel application key:

```bash
php artisan key:generate
```

6. Configure your database and PayPal credentials in `.env`:

```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=frost
DB_USERNAME=root
DB_PASSWORD=

PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
PAYPAL_MODE=sandbox
```

7. Run database migrations:

```bash
php artisan migrate
```

Optional seed data can be added if your project includes seeders:

```bash
php artisan db:seed
```

8. Start the app:

```bash
composer run dev
```

This runs the Laravel server, queue listener, and Vite dev server together.

Alternatively, run them separately:

```bash
php artisan serve
npm run dev
```

## Production Build

For frontend production assets:

```bash
npm run build
```

## Testing

```bash
php artisan test
```

The project uses Pest for tests, and the Laravel test suite can be expanded to cover storefront, checkout, and admin workflows.

## Default Roles and Access

The app distinguishes between different users:
- regular customers
- admin users

Admin-only routes are protected by the `Admin` middleware, while customer-only pages use authenticated routes with verification checks.

## Notes

This project is a full e-commerce platform rather than a simple starter application. It includes working order flows, stock protections, payment processing, and operational dashboard features that make it suitable for a real store management workflow.

## License

This project is distributed under the MIT license unless otherwise stated in the repository.
