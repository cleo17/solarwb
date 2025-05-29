import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import ServicesPage from "@/pages/services-page";
import BlogPage from "@/pages/blog-page";
import BlogPostPage from "@/pages/blog-post-page";
import ContactPage from "@/pages/contact-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminBlogPosts from "@/pages/admin/blog-posts";
import AdminOrders from "@/pages/admin/orders";
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:id" component={BlogPostPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/cart" component={CartPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} />
      <ProtectedRoute path="/admin/blog-posts" component={AdminBlogPosts} />
      <ProtectedRoute path="/admin/orders" component={AdminOrders} />
      <ProtectedRoute path="/admin/users" component={AdminUsers} />
      <ProtectedRoute path="/admin/settings" component={AdminSettings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
