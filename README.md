# ShopEase - E-commerce Platform

A modern, full-stack e-commerce application built with Next.js, Sanity CMS, and Tailwind CSS.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Product Management**: Full CRUD operations for products, categories, and banners
- **User Authentication**: Secure login/signup with NextAuth.js
- **Shopping Cart**: Persistent cart with real-time updates
- **Wishlist**: Save favorite products for later
- **Order Management**: Complete order lifecycle management
- **Admin Dashboard**: Comprehensive admin panel for store management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Built-in SEO features and sitemap generation

## 🚀 Enhanced Loading System

### Overview
ShopEase now features a comprehensive loading system that provides excellent user experience during navigation and data fetching:

1. **Initial App Loader**: Beautiful startup animation that prevents white screen
2. **Route Change Loading**: Smooth loading indicators during navigation
3. **Data Fetching Loading**: Contextual loading states for API calls
4. **Progress Bar**: Top-of-page progress indicator during navigation

### Components

#### InitialLoader
- Shows on first app load
- Beautiful logo animation with gradient background
- Prevents white screen flash
- Auto-hides after 1.5 seconds

#### PageLoader
- Full-screen loading overlay
- Different states for route changes vs data loading
- Animated spinner with progress bar
- Contextual loading messages

#### LoadingBar
- Thin progress bar at top of page
- Shows during route changes
- Smooth gradient animation

#### LoadingWrapper
- Wraps individual page content
- Shows loading state while data fetches
- Customizable loading text and fallback

### Usage Examples

```tsx
// In any component
import { useLoading } from '@/context/LoadingContext';

const MyComponent = () => {
  const { showLoading, hideLoading, setRouteChanging } = useLoading();

  const handleNavigation = () => {
    setRouteChanging(true); // Shows route change loading
  };

  const handleDataFetch = async () => {
    showLoading('Fetching data...'); // Shows data loading
    try {
      // API call
    } finally {
      hideLoading(); // Hides loading
    }
  };

  return (
    // Your component JSX
  );
};
```

### Features
- **Automatic Route Detection**: Automatically shows loading on route changes
- **Customizable Messages**: Different loading text for different actions
- **Smooth Animations**: Framer Motion powered animations
- **Dark Mode Support**: Consistent with app theme
- **Performance Optimized**: Minimal impact on app performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.2, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **CMS**: Sanity.io
- **Authentication**: NextAuth.js
- **Database**: Sanity (MongoDB)
- **Deployment**: Vercel
- **Email**: Resend, Nodemailer
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Sanity account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SHOP_EASE_CHECKING_PROCESS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token
   
   # NextAuth
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   
   # Admin Setup
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=secure_password
   ```

4. **Set up Sanity Studio**
   ```bash
   npm run sanity:dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Admin Setup

1. **Access admin setup**
   Navigate to `/admin-setup` on first run

2. **Create admin account**
   - Enter your email and password
   - This will be your admin credentials

3. **Access admin panel**
   Navigate to `/admin` and login with your credentials

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables
   - Deploy!

### Environment Variables for Production
Make sure to add all environment variables in your Vercel dashboard:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## 🎨 Customization

### Colors and Theme
Modify `tailwind.config.ts` to customize:
- Primary colors
- Dark mode colors
- Custom animations
- Font families

### Components
All components are in the `components/` directory:
- Reusable UI components in `components/ui/`
- Page-specific components in `components/`
- Context providers in `context/`

### Styling
- Global styles in `app/globals.css`
- Component-specific styles using Tailwind classes
- Custom CSS animations for loading states

## 📁 Project Structure

```
SHOP_EASE_CHECKING_PROCESS/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── products/          # Product pages
│   └── ...                # Other pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   └── ...                # Page components
├── context/                # React Context providers
├── lib/                    # Utility functions
├── sanity/                 # Sanity CMS configuration
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sanity:dev` - Start Sanity Studio
- `npm run sanity:build` - Build Sanity Studio
- `npm run sanity:deploy` - Deploy Sanity Studio

## 🌟 Key Features

### User Experience
- **Smooth Navigation**: Loading states prevent white screens
- **Responsive Design**: Works perfectly on all devices
- **Fast Loading**: Optimized images and code splitting
- **Accessibility**: WCAG compliant design

### Performance
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Efficient data caching strategies
- **SEO**: Built-in SEO optimization

### Security
- **Authentication**: Secure user authentication
- **Authorization**: Role-based access control
- **Data Validation**: Input sanitization and validation
- **HTTPS**: Secure communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with details
4. Contact the development team

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Payment gateway integration
- [ ] Inventory management
- [ ] Customer reviews
- [ ] Social media integration

---

**Built with ❤️ using Next.js, Sanity, and Tailwind CSS**
