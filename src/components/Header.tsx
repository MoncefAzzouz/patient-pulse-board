
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, PlusCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NavigationMenuDemo from './NavigationMenu';
import { Card } from './ui/card';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Emergency Department Triage Dashboard" }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    navigate('/login');
  };

  const handleAddPatient = () => {
    navigate('/add-patient');
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 py-4 px-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
            onClick={handleAddPatient}
          >
            <PlusCircle className="h-4 w-4" />
            Add Patient
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 flex items-center gap-2 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm p-1 rounded-xl">
        <NavigationMenuDemo />
      </Card>
    </header>
  );
};

export default Header;
