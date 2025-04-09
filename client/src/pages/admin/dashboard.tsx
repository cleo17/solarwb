import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation, useRoute } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/admin/sidebar';
import Header from '@/components/admin/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Package, 
  Loader2,
  Calendar,
} from 'lucide-react';

const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
];

const productCategoryData = [
  { name: 'Solar Panels', value: 40 },
  { name: 'Inverters', value: 25 },
  { name: 'Water Heaters', value: 20 },
  { name: 'Water Pumps', value: 10 },
  { name: 'Accessories', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

export default function AdminDashboard() {
  const [match, params] = useRoute('/admin');
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user,
  });
  
  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    enabled: !!user,
  });
  
  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    enabled: !!user && user.role === 'super_admin',
  });
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !['super_admin', 'blog_editor', 'sales_manager', 'accountant'].includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Auto-collapse sidebar on small screens
  useEffect(() => {
    setSidebarCollapsed(window.innerWidth < 1280);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Calculate dashboard stats
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((acc, order) => acc + order.total, 0) || 0;
  const totalProducts = products?.length || 0;
  const totalCustomers = users?.filter(u => u.role === 'customer').length || 0;
  
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Limpias Technologies</title>
      </Helmet>
      
      <div className="flex h-screen bg-neutral-50 overflow-hidden">
        {/* Sidebar */}
        {(isMobile && mobileSidebarOpen) && (
          <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setMobileSidebarOpen(false)}></div>
        )}
        
        {(mobileSidebarOpen || !isMobile) && (
          <Sidebar 
            isMobile={isMobile} 
            isCollapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar}
            closeMobileSidebar={() => setMobileSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleMobileSidebar={toggleMobileSidebar} pageTitle="Dashboard" />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col space-y-6">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-800">Welcome back, {user.fullName}!</h2>
                  <p className="text-neutral-500">{currentDate}</p>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                  <Calendar className="h-5 w-5 text-neutral-500 mr-2" />
                  <span className="text-sm text-neutral-500">Last login: Today, 9:30 AM</span>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>12% from last month</span>
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Total Orders</p>
                        <h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>8% from last month</span>
                        </p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Total Products</p>
                        <h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
                        <p className="text-xs text-amber-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>5% from last month</span>
                        </p>
                      </div>
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <Package className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Total Customers</p>
                        <h3 className="text-2xl font-bold mt-1">{totalCustomers}</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>15% from last month</span>
                        </p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Monthly sales trend for the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                            }}
                            formatter={(value) => [`$${value}`, 'Sales']}
                          />
                          <Bar dataKey="sales" fill="#0D8A6F" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Product Categories</CardTitle>
                    <CardDescription>Distribution of sales by product category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productCategoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {productCategoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Percentage']}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest orders and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : orders?.length === 0 ? (
                    <p className="text-center py-8 text-neutral-500">No recent orders found.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders?.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center border-b border-neutral-100 pb-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <ShoppingBag className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-neutral-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                            <p className={`text-xs ${
                              order.paymentStatus === 'completed' 
                                ? 'text-green-600' 
                                : order.paymentStatus === 'pending' 
                                  ? 'text-amber-600' 
                                  : 'text-red-600'
                            } capitalize`}>
                              {order.paymentStatus}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
