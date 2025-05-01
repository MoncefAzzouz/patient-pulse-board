
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NavigationMenuDemo from './NavigationMenu';

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
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleAddPatient}
          >
            <PlusCircle className="h-4 w-4" />
            Add Patient
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <NavigationMenuDemo />
    </header>
  );
};

export default Header;
