# Varasidhi Furnitures – Billing & Inventory ERP

A professional Billing & Inventory ERP system designed specifically for furniture businesses.  
This application helps manage invoices, inventory, suppliers, GRN, reports, and role-based access in a single unified system.

---

## Project Overview

This ERP is built for real-world furniture showroom and warehouse operations, focusing on:

- Billing & invoicing
- Inventory and stock tracking
- Supplier & GRN management
- Role-based dashboards
- Secure authentication
- Scalable, maintainable frontend architecture

---

## Tech Stack

This project is built using:

- **React** (with TypeScript)
- **Vite** (fast development & build)
- **Tailwind CSS**
- **shadcn/ui**
- **React Router**
- **Modern component-based architecture**

---

## Getting Started (Local Development)

### Prerequisites

- Node.js (v18+ recommended)
- npm (or pnpm/yarn)

### Setup Instructions

```sh
# 1. Clone the repository
git clone <YOUR_GIT_REPOSITORY_URL>

# 2. Navigate to the project directory
cd <PROJECT_DIRECTORY>

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
````

The application will be available at:

```
http://localhost:5173
```

---

## Project Structure (High Level)

```text
src/
 ├─ api/            # API clients & services
 ├─ components/     # Reusable UI components
 ├─ pages/          # Page-level components
 ├─ providers/      # Context providers (Auth, Theme, etc.)
 ├─ routes/         # Route definitions & guards
 ├─ styles/         # Global styles
 └─ main.tsx        # App entry point
```

---

## Authentication & Roles

* Secure login with access & refresh tokens
* Role-based access control (Admin, Inventory, Sales, etc.)
* Protected routes for authenticated users
* Public landing and login pages

---

## Deployment

This application can be deployed using any standard frontend hosting provider:

* Vercel
* Netlify
* AWS S3 + CloudFront
* Nginx / Apache

### Production Build

```sh
npm run build
```

The output will be generated in the `dist/` directory.

---

## Branding & Customization

This ERP is branded for **Varasidhi Furnitures**.
Logos, colors, and metadata can be customized if required for white-label or multi-tenant usage.

---

## License

© 2025 Varasidhi Furnitures.
All rights reserved.
