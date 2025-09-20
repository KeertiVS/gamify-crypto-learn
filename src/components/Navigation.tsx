import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Gamepad2, 
  BookOpen, 
  Coins, 
  Settings, 
  User,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userPoints: number;
}

const Navigation = ({ currentPage, onPageChange, userPoints }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'learn', label: 'Learn & Earn', icon: BookOpen },
    { id: 'sandbox', label: 'Sandbox', icon: Coins },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold crypto-gradient bg-clip-text text-transparent">
            Quest Crypto
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="glow-border">
              <Coins className="w-3 h-3 mr-1" />
              {userPoints}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="glow-border"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${
                    currentPage === item.id ? 'glow-border neon-glow' : 'hover:glow-border'
                  }`}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold crypto-gradient bg-clip-text text-transparent">
            Quest Crypto Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Learn • Play • Earn
          </p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Crypto Learner</div>
              <div className="text-sm text-muted-foreground">Level 3</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="glow-border">
              <Coins className="w-3 h-3 mr-1" />
              {userPoints} Points
            </Badge>
            <Button variant="ghost" size="sm" className="hover:glow-border">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  currentPage === item.id ? 'glow-border neon-glow' : 'hover:glow-border'
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {item.id === 'games' && (
                  <Badge variant="outline" className="ml-auto">
                    New
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 hover:glow-border"
            onClick={() => onPageChange('settings')}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navigation;