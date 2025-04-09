import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu as MenuIcon, Search, Settings, User, LogOut, Home, Sun } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  toggleMobileSidebar: () => void;
  pageTitle: string;
}

export default function Header({ toggleMobileSidebar, pageTitle }: HeaderProps) {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden mr-2" 
          onClick={toggleMobileSidebar}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        
        <h1 className="text-xl font-heading font-bold text-neutral-800 mr-4">{pageTitle}</h1>
        
        <nav className="hidden md:flex space-x-1">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-sm">
              <Home className="h-4 w-4 mr-1" />
              <span>View Site</span>
            </Button>
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        <form onSubmit={handleSearch} className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-60 pl-9 h-9 text-sm focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.fullName.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.fullName}</span>
                <span className="text-xs text-neutral-500">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
