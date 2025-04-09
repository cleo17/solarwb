import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Package,
  FileText,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  SunMedium,
  BarChart2,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  isMobile: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar?: () => void;
}

export default function Sidebar({ 
  isMobile, 
  isCollapsed, 
  toggleSidebar,
  closeMobileSidebar
}: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAdmin = user && ["super_admin", "blog_editor", "sales_manager", "accountant"].includes(user.role);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/admin",
      roles: ["super_admin", "blog_editor", "sales_manager", "accountant"],
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      path: "/admin/products",
      roles: ["super_admin", "sales_manager"],
    },
    {
      title: "Blog Posts",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/blog-posts",
      roles: ["super_admin", "blog_editor"],
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/admin/orders",
      roles: ["super_admin", "sales_manager", "accountant"],
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
      roles: ["super_admin"],
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
      roles: ["super_admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleItemClick = () => {
    if (isMobile && closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  return (
    <div 
      className={`bg-sidebar border-r border-neutral-200 h-full overflow-y-auto flex flex-col
        ${isCollapsed && !isMobile ? 'w-[70px]' : 'w-64'} transition-all duration-300 ${isMobile ? 'fixed z-40 left-0 top-0 bottom-0' : ''}`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-200">
        <Link href="/" className="flex items-center overflow-hidden">
          <SunMedium className="text-primary mr-2 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-heading font-bold text-lg text-neutral-800 whitespace-nowrap">
              Limpias<span className="text-primary">Tech</span>
            </span>
          )}
        </Link>
        
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-neutral-500 hover:text-neutral-700"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-grow py-4">
        <div className="px-3 mb-2">
          {!isCollapsed && <p className="text-xs font-medium text-neutral-500 mb-2 px-3">MENU</p>}
          <nav className="space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={handleItemClick}
                >
                  <div
                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer relative
                      ${isActive 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      }`}
                    onMouseEnter={() => !isMobile && isCollapsed && setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {(!isCollapsed || isMobile) && (
                      <span className="ml-3">{item.title}</span>
                    )}
                    
                    {/* Tooltip for collapsed sidebar */}
                    {!isMobile && isCollapsed && hoveredItem === item.title && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded z-50 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <Separator className="my-4" />

        {!isCollapsed && (
          <div className="px-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 mr-1" /> Need Help?
              </h4>
              <p className="text-sm text-neutral-600 mb-3">
                Contact our support team if you need assistance.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => window.open('/contact', '_blank')}
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-neutral-200">
        {!isCollapsed && user && (
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2 overflow-hidden">
              <p className="font-medium text-sm truncate">{user.fullName}</p>
              <p className="text-xs text-neutral-500 truncate capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size={isCollapsed && !isMobile ? "icon" : "default"} 
          className="w-full justify-start text-neutral-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {(!isCollapsed || isMobile) && <span className="ml-2">Log Out</span>}
        </Button>
      </div>
    </div>
  );
}
