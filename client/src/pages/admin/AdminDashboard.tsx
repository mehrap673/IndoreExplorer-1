import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, MapPin, Utensils, Calendar, Image, 
  User, Mail, Settings, LogOut, Menu, X, Sun, Moon,
  Plus, Eye, Edit, Trash2
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'places', label: 'Places', icon: MapPin },
  { id: 'food', label: 'Food & Cuisine', icon: Utensils },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'about', label: 'About/History', icon: User },
  { id: 'contact', label: 'Contact Messages', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Admin Panel
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            data-testid="button-close-sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white" data-testid="text-username">
                {user.username}
              </p>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`lg:ml-64 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2"
                data-testid="button-open-sidebar"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white capitalize">
                {activeSection === 'dashboard' ? 'Dashboard' : SIDEBAR_ITEMS.find(item => item.id === activeSection)?.label}
              </h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {activeSection === 'dashboard' && <DashboardContent />}
          {activeSection === 'places' && <PlacesContent />}
          {activeSection === 'food' && <FoodContent />}
          {activeSection === 'events' && <EventsContent />}
          {activeSection === 'gallery' && <GalleryContent />}
          {activeSection === 'about' && <AboutContent />}
          {activeSection === 'contact' && <ContactContent />}
          {activeSection === 'settings' && <SettingsContent />}
        </main>
      </div>
    </div>
  );
}

// Dashboard overview component
function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Places" value="0" icon={MapPin} />
        <StatsCard title="Food Items" value="0" icon={Utensils} />
        <StatsCard title="Events" value="0" icon={Calendar} />
        <StatsCard title="Gallery Images" value="0" icon={Image} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes to your content</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Stats card component
function StatsCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder content components
function PlacesContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Places Management</h2>
        <Button data-testid="button-add-place">
          <Plus className="h-4 w-4 mr-2" />
          Add Place
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Places management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function FoodContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Food & Cuisine Management</h2>
        <Button data-testid="button-add-food">
          <Plus className="h-4 w-4 mr-2" />
          Add Food Item
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Food management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function EventsContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events Management</h2>
        <Button data-testid="button-add-event">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Events management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function GalleryContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Button data-testid="button-add-image">
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Gallery management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">About/History Management</h2>
        <Button data-testid="button-add-section">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">About/History management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Contact messages interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Settings management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}