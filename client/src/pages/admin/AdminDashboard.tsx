import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  LayoutDashboard, MapPin, Utensils, Calendar, Image, 
  User, Mail, Settings, LogOut, Menu, X, Sun, Moon,
  Plus, Eye, Edit, Trash2, ArrowLeft, Save
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Place {
  _id: string;
  name: string;
  description: string;
  category: 'historical' | 'religious' | 'modern' | 'nature';
  imageUrl: string;
  location: string;
  featured: boolean;
  rating?: number;
  visitingHours?: string;
  entryFee?: string;
  isActive: boolean;
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

// Places Management Component
function PlacesContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: places = [], isLoading, refetch } = useQuery<Place[]>({
    queryKey: ['/api/places', { active: 'all' }],
  });

  const deletePlaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/places/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete place');
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const filteredPlaces = places.filter((place: Place) => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || place.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (place: any) => {
    setEditingPlace(place);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this place?')) {
      deletePlaceMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPlace(null);
    refetch();
  };

  if (showForm) {
    return <PlaceForm place={editingPlace} onClose={handleFormClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Places Management</h2>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-place">
          <Plus className="h-4 w-4 mr-2" />
          Add Place
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-places"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                data-testid="select-category-filter"
              >
                <option value="all">All Categories</option>
                <option value="historical">Historical</option>
                <option value="religious">Religious</option>
                <option value="modern">Modern</option>
                <option value="nature">Nature</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Places Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading places...</p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || categoryFilter !== 'all' ? 'No places match your filters' : 'No places found. Add your first place!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Image</th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">Featured</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlaces.map((place: any) => (
                    <tr key={place._id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-16 h-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/200/150';
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{place.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {place.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="capitalize">
                          {place.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{place.location}</td>
                      <td className="p-4">
                        {place.featured ? (
                          <Badge variant="default">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={place.isActive ? "default" : "destructive"}>
                          {place.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(place)}
                            data-testid={`button-edit-${place._id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(place._id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-${place._id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Place Form Component
function PlaceForm({ place, onClose }: { place?: Place | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: place?.name || '',
    description: place?.description || '',
    category: place?.category || 'historical',
    imageUrl: place?.imageUrl || '',
    location: place?.location || '',
    featured: place?.featured || false,
    rating: place?.rating || 0,
    visitingHours: place?.visitingHours || '',
    entryFee: place?.entryFee || '',
    isActive: place?.isActive ?? true,
  });

  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = place ? `/api/places/${place._id}` : '/api/places';
      const method = place ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save place');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Place ${place ? 'updated' : 'created'} successfully!`,
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? Number(value) 
              : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {place ? 'Edit Place' : 'Add New Place'}
        </h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Place Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                  data-testid="select-category"
                >
                  <option value="historical">Historical</option>
                  <option value="religious">Religious</option>
                  <option value="modern">Modern</option>
                  <option value="nature">Nature</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  data-testid="input-location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  data-testid="input-image-url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                  data-testid="input-rating"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryFee">Entry Fee</Label>
                <Input
                  id="entryFee"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹50 or Free"
                  data-testid="input-entry-fee"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitingHours">Visiting Hours</Label>
                <Input
                  id="visitingHours"
                  name="visitingHours"
                  value={formData.visitingHours}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                  data-testid="input-visiting-hours"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                data-testid="textarea-description"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-border"
                  data-testid="checkbox-featured"
                />
                <Label htmlFor="featured">Featured Place</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-border"
                  data-testid="checkbox-active"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                data-testid="button-save"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save Place'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
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