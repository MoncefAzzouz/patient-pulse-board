
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  Home, 
  PlusCircle, 
  Fingerprint, 
  Database, 
  BarChart4 
} from 'lucide-react';

const NavigationMenuDemo = () => {
  const location = useLocation();
  
  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList className="flex gap-1">
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(), 
                "bg-transparent transition-all duration-200 hover:scale-105",
                location.pathname === '/' ? "bg-accent/50" : "",
                "flex items-center gap-2"
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/add-patient">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(), 
                "bg-transparent transition-all duration-200 hover:scale-105",
                location.pathname === '/add-patient' ? "bg-accent/50" : "",
                "flex items-center gap-2"
              )}
            >
              <PlusCircle className="h-4 w-4" />
              Add Patient
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/fingerprint-scan">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(), 
                "bg-transparent transition-all duration-200 hover:scale-105",
                location.pathname === '/fingerprint-scan' ? "bg-accent/50" : "",
                "flex items-center gap-2"
              )}
            >
              <Fingerprint className="h-4 w-4" />
              Fingerprint Scan
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/dataset">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(), 
                "bg-transparent transition-all duration-200 hover:scale-105",
                location.pathname === '/dataset' ? "bg-accent/50" : "",
                "flex items-center gap-2"
              )}
            >
              <Database className="h-4 w-4" />
              Dataset Management
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/analytics">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(), 
                "bg-transparent transition-all duration-200 hover:scale-105",
                location.pathname === '/analytics' ? "bg-accent/50" : "",
                "flex items-center gap-2"
              )}
            >
              <BarChart4 className="h-4 w-4" />
              Analytics
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuDemo;
