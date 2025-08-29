# E-Commerce Application

## Overview
A modern e-commerce application built with Next.js 14, Tailwind CSS, and Sanity CMS. This application includes product browsing, cart functionality, checkout process, and an admin dashboard for order management.

## Features

### Customer Features
- Browse products with category filtering and search
- View detailed product information
- Add products to cart
- Checkout process with shipping and payment information
- Order confirmation and tracking
- **User Authentication & Account Management**
  - Secure user registration and login
  - Personal dashboard with order history
  - Profile management and address updates
  - Password-protected account access

### Admin Features
- Secure admin dashboard
- View and manage all orders
- Update order status and payment status
- View detailed order information
- **User Management**
  - View all registered users
  - Manage user roles and permissions

## Technical Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend/CMS**: Sanity.io
- **State Management**: React Context API
- **Authentication**: NextAuth.js with Sanity adapter
- **Security**: bcryptjs for password hashing, JWT tokens
- **Database**: Sanity.io (Headless CMS)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Sanity account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   - Create `.env.local` file with the following variables:
   ```bash
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-sanity-api-token
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## User Dashboard

Access your personal dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard) after signing in.

## Admin Dashboard

Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin) using admin credentials.

## Authentication

The application includes a complete authentication system:
- **Sign Up**: `/auth/signup` - Create a new account
- **Sign In**: `/auth/signin` - Login to existing account
- **Dashboard**: `/dashboard` - User profile and order management

## Sanity Studio

To manage your content, access the Sanity Studio:

```bash
npm run sanity:dev
# or
yarn sanity:dev
```

Then open [http://localhost:3333](http://localhost:3333) in your browser.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
