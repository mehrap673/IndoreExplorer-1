import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutDashboard,
  MapPin,
  Utensils,
  Calendar,
  Image,
  User,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
  category: "historical" | "religious" | "modern" | "nature";
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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "places", label: "Places", icon: MapPin },
  { id: "food", label: "Food & Cuisine", icon: Utensils },
  { id: "events", label: "Events", icon: Calendar },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "about", label: "About/History", icon: User },
  { id: "contact", label: "Contact Messages", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard({
  user,
  onLogout,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile menu backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
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
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                className="text-sm font-medium text-sidebar-foreground"
                data-testid="text-username"
              >
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
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
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
      <div
        className={`lg:ml-64 transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "ml-0"
        }`}
      >
        {/* Top header */}
        <header className="bg-card shadow-sm border-b border-border">
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
              <h1 className="text-xl font-semibold text-card-foreground capitalize">
                {activeSection === "dashboard"
                  ? "Dashboard"
                  : SIDEBAR_ITEMS.find((item) => item.id === activeSection)
                      ?.label}
              </h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {activeSection === "dashboard" && <DashboardContent />}
          {activeSection === "places" && <PlacesContent />}
          {activeSection === "food" && <FoodContent />}
          {activeSection === "events" && <EventsContent />}
          {activeSection === "gallery" && <GalleryContent />}
          {activeSection === "about" && <AboutContent />}
          {activeSection === "contact" && <ContactContent />}
          {activeSection === "settings" && <SettingsContent />}
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
          <CardDescription>
            Latest updates and changes to your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Stats card component
function StatsCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: any;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: places = [],
    isLoading,
    refetch,
  } = useQuery<Place[]>({
    queryKey: ["/api/places", { active: "all" }],
    queryFn: async () => {
      const res = await fetch("/api/places");
      if (!res.ok) throw new Error("Failed to fetch places");
      return res.json();
    },
  });

  const deletePlaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/places/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete place");
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const filteredPlaces = places.filter((place: Place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || place.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (place: any) => {
    setEditingPlace(place);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this place?")) {
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
        <Button
          onClick={() => setShowForm(true)}
          data-testid="button-add-place"
        >
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
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || categoryFilter !== "all"
                ? "No places match your filters"
                : "No places found. Add your first place!"}
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
                    <tr
                      key={place._id}
                      className="border-b border-border hover:bg-muted"
                    >
                      <td className="p-4">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-16 h-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/200/150";
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
                        <Badge
                          variant={place.isActive ? "default" : "destructive"}
                        >
                          {place.isActive ? "Active" : "Inactive"}
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

// ... All other sub-components (PlaceForm, FoodContent, etc.) would remain the same
// but I'll include them here with minor color variable adjustments for completeness.


// Place Form Component
function PlaceForm({
  place,
  onClose,
}: {
  place?: Place | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: place?.name || "",
    description: place?.description || "",
    category: place?.category || "historical",
    imageUrl: place?.imageUrl || "",
    location: place?.location || "",
    featured: place?.featured || false,
    rating: place?.rating || 0,
    visitingHours: place?.visitingHours || "",
    entryFee: place?.entryFee || "",
    isActive: place?.isActive ?? true,
  });

  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = place ? `/api/places/${place._id}` : "/api/places";
      const method = place ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save place");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Place ${place ? "updated" : "created"} successfully!`,
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {place ? "Edit Place" : "Add New Place"}
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
                {saveMutation.isPending ? "Saving..." : "Save Place"}
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

// Food Form Component
function FoodForm({
  food,
  onClose,
}: {
  food?: any | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: food?.name || "",
    description: food?.description || "",
    category: food?.category || "snacks",
    imageUrl: food?.imageUrl || "",
    priceRange: food?.priceRange || "",
    rating: food?.rating || 0,
    featured: food?.featured || false,
    ingredients: food?.ingredients?.join(", ") || "",
    restaurants: food?.restaurants?.join(", ") || "",
    isVegetarian: food?.isVegetarian ?? true,
    isActive: food?.isActive ?? true,
  });

  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = food ? `/api/food/${food._id}` : "/api/food";
      const method = food ? "PUT" : "POST";

      // Process arrays
      const processedData = {
        ...data,
        ingredients: data.ingredients
          ? data.ingredients
              .split(",")
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [],
        restaurants: data.restaurants
          ? data.restaurants
              .split(",")
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [],
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save food item");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Food item ${food ? "updated" : "created"} successfully!`,
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {food ? "Edit Food Item" : "Add New Food Item"}
        </h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Food Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
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
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="snacks">Snacks</option>
                  <option value="sweets">Sweets</option>
                  <option value="dinner">Dinner</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range *</Label>
                <Input
                  id="priceRange"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹50-₹100"
                  required
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">
                  Ingredients (comma separated)
                </Label>
                <Input
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="e.g., flour, sugar, milk"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restaurants">
                  Popular Restaurants (comma separated)
                </Label>
                <Input
                  id="restaurants"
                  name="restaurants"
                  value={formData.restaurants}
                  onChange={handleInputChange}
                  placeholder="e.g., Restaurant A, Restaurant B"
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
                />
                <Label htmlFor="featured">Featured Food</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVegetarian"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleInputChange}
                  className="rounded border-border"
                />
                <Label htmlFor="isVegetarian">Vegetarian</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-border"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Food Item"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Food Management Component
function FoodContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: foodItems = [],
    isLoading,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["/api/food", { active: "all" }],
  });

  const deleteFoodMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/food/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete food item");
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const filteredFood = foodItems.filter((food: any) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || food.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (food: any) => {
    setEditingFood(food);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this food item?")) {
      deleteFoodMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingFood(null);
    refetch();
  };

  if (showForm) {
    return <FoodForm food={editingFood} onClose={handleFormClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Food & Cuisine Management</h2>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-food">
          <Plus className="h-4 w-4 mr-2" />
          Add Food Item
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-food"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                data-testid="select-food-category-filter"
              >
                <option value="all">All Categories</option>
                <option value="breakfast">Breakfast</option>
                <option value="snacks">Snacks</option>
                <option value="sweets">Sweets</option>
                <option value="dinner">Dinner</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Items Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading food items...</p>
            </div>
          ) : filteredFood.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || categoryFilter !== "all"
                ? "No food items match your filters"
                : "No food items found. Add your first item!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Image</th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price Range</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Featured</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFood.map((food: any) => (
                    <tr
                      key={food._id}
                      className="border-b border-border hover:bg-muted"
                    >
                      <td className="p-4">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-16 h-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/200/150";
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {food.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="capitalize">
                          {food.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{food.priceRange}</td>
                      <td className="p-4">
                        <Badge
                          variant={food.isVegetarian ? "default" : "secondary"}
                        >
                          {food.isVegetarian ? "Vegetarian" : "Non-Veg"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {food.featured ? (
                          <Badge variant="default">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={food.isActive ? "default" : "destructive"}
                        >
                          {food.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(food)}
                            data-testid={`button-edit-food-${food._id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(food._id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-food-${food._id}`}
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

// Events Management Component
function EventsContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: events = [],
    isLoading,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["/api/events", { active: "all" }],
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete event");
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
    refetch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (showForm) {
    return <EventForm event={editingEvent} onClose={handleFormClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Events Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          data-testid="button-add-event"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-events"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                data-testid="select-event-category-filter"
              >
                <option value="all">All Categories</option>
                <option value="cultural">Cultural</option>
                <option value="religious">Religious</option>
                <option value="festival">Festival</option>
                <option value="food">Food</option>
                <option value="music">Music</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || categoryFilter !== "all"
                ? "No events match your filters"
                : "No events found. Add your first event!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Image</th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">Featured</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event: any) => (
                    <tr
                      key={event._id}
                      className="border-b border-border hover:bg-muted"
                    >
                      <td className="p-4">
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className="w-16 h-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/200/150";
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {event.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div>
                          <p>{formatDate(event.date)}</p>
                          {event.endDate && (
                            <p className="text-muted-foreground">
                              to {formatDate(event.endDate)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="capitalize">
                          {event.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{event.location}</td>
                      <td className="p-4">
                        {event.featured ? (
                          <Badge variant="default">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={event.isActive ? "default" : "destructive"}
                        >
                          {event.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(event)}
                            data-testid={`button-edit-event-${event._id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(event._id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-event-${event._id}`}
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

// Event Form Component
function EventForm({
  event,
  onClose,
}: {
  event?: any | null;
  onClose: () => void;
}) {
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    date: formatDateForInput(event?.date) || "",
    endDate: formatDateForInput(event?.endDate) || "",
    category: event?.category || "cultural",
    imageUrl: event?.imageUrl || "",
    location: event?.location || "",
    price: event?.price || "",
    organizer: event?.organizer || "",
    featured: event?.featured || false,
    isActive: event?.isActive ?? true,
  });

  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = event ? `/api/events/${event._id}` : "/api/events";
      const method = event ? "PUT" : "POST";

      // Process dates for API
      const processedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Event ${event ? "updated" : "created"} successfully!`,
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
    if (
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.date)
    ) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {event ? "Edit Event" : "Add New Event"}
        </h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
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
                >
                  <option value="cultural">Cultural</option>
                  <option value="religious">Religious</option>
                  <option value="festival">Festival</option>
                  <option value="food">Food</option>
                  <option value="music">Music</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Start Date & Time *</Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time (optional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (optional)</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹500 or Free"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer (optional)</Label>
                <Input
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Event organizer name"
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
                />
                <Label htmlFor="featured">Featured Event</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-border"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Event"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Gallery Management Component
function GalleryContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: galleryItems = [],
    isLoading,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["/api/gallery", { active: "all" }],
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete gallery item");
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const filteredGallery = galleryItems.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: any) => {
    setEditingGallery(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      deleteGalleryMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGallery(null);
    refetch();
  };

  if (showForm) {
    return (
      <GalleryForm galleryItem={editingGallery} onClose={handleFormClose} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          data-testid="button-add-image"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-gallery"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                data-testid="select-gallery-category-filter"
              >
                <option value="all">All Categories</option>
                <option value="places">Places</option>
                <option value="culture">Culture</option>
                <option value="food">Food</option>
                <option value="events">Events</option>
                <option value="people">People</option>
                <option value="architecture">Architecture</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading gallery...</p>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || categoryFilter !== "all"
                ? "No gallery items match your filters"
                : "No gallery items found. Add your first image!"}
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item: any) => (
                  <div
                    key={item._id}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/api/placeholder/400/300";
                      }}
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <Badge
                          variant="secondary"
                          className="capitalize text-xs"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {item.featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                          <Badge
                            variant={item.isActive ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            data-testid={`button-edit-gallery-${item._id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-gallery-${item._id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          <p className="text-muted-foreground">
            About/History management interface coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Contact Messages Management Component
function ContactContent() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["/api/contact"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to mark message as read");
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const response = await fetch(`/api/contact/${id}/reply`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ reply }),
      });
      if (!response.ok) throw new Error("Failed to send reply");
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setSelectedMessage(null);
    },
  });

  const filteredMessages = messages.filter((message: any) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !message.isRead) ||
      (statusFilter === "read" && message.isRead) ||
      (statusFilter === "replied" && message.isReplied);
    return matchesSearch && matchesStatus;
  });

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsReadMutation.mutate(message._id);
    }
  };

  const handleReply = (reply: string) => {
    if (selectedMessage) {
      replyMutation.mutate({ id: selectedMessage._id, reply });
    }
  };

  if (selectedMessage) {
    return (
      <ContactMessageView
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onReply={handleReply}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-messages"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                data-testid="select-message-status-filter"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "No messages match your filters"
                : "No contact messages found."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Subject</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message: any) => (
                    <tr
                      key={message._id}
                      className={`border-b border-border hover:bg-muted ${
                        !message.isRead ? "bg-accent" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex gap-2">
                          {!message.isRead && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                          {message.isReplied && (
                            <Badge variant="default" className="text-xs">
                              Replied
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{message.name}</td>
                      <td className="p-4 text-sm">{message.email}</td>
                      <td className="p-4">
                        <p className="truncate max-w-xs">{message.subject}</p>
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                          data-testid={`button-view-message-${message._id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
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

// Settings Management Component
function SettingsContent() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");

  const {
    data: settingsData = [],
    isLoading,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["/api/settings"],
  });

  // Update settings state when data changes
  useEffect(() => {
    if (settingsData) {
      const settingsMap = settingsData.reduce(
        (acc: Record<string, string>, setting: any) => {
          acc[setting.key] = setting.value;
          return acc;
        },
        {}
      );
      setSettings(settingsMap);
    }
  }, [settingsData]);

  const { toast } = useToast();

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch(`/api/settings/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) throw new Error("Failed to update setting");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Setting updated successfully!",
      });
      refetch();
      setEditingKey(null);
      setNewValue("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (key: string) => {
    setEditingKey(key);
    setNewValue(settings[key] || "");
  };

  const handleSave = () => {
    if (editingKey) {
      updateSettingMutation.mutate({ key: editingKey, value: newValue });
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setNewValue("");
  };

  const settingConfigs = [
    {
      key: "OPENWEATHER_API_KEY",
      label: "OpenWeather API Key",
      description: "API key for fetching weather data from OpenWeatherMap",
      placeholder: "Enter your OpenWeather API key",
      type: "password",
    },
    {
      key: "NEWS_API_KEY",
      label: "News API Key",
      description: "API key for fetching news articles",
      placeholder: "Enter your News API key",
      type: "password",
    },
    {
      key: "SITE_NAME",
      label: "Site Name",
      description: "Display name for your website",
      placeholder: "All About Indore",
      type: "text",
    },
    {
      key: "SITE_DESCRIPTION",
      label: "Site Description",
      description: "Brief description of your website",
      placeholder: "Discover the heart of Madhya Pradesh",
      type: "text",
    },
    {
      key: "CONTACT_EMAIL",
      label: "Contact Email",
      description: "Primary contact email for the website",
      placeholder: "contact@allaboutindore.com",
      type: "email",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>
            Manage API keys and site-wide settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading settings...</p>
            </div>
          ) : (
            settingConfigs.map((config) => (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {config.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {editingKey === config.key ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSave}
                          disabled={updateSettingMutation.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(config.key)}
                        data-testid={`button-edit-${config.key}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {editingKey === config.key ? (
                  <Input
                    type={config.type}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={config.placeholder}
                    data-testid={`input-${config.key}`}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono">
                      {settings[config.key] ? (
                        config.type === "password" ? (
                          "••••••••"
                        ) : (
                          settings[config.key]
                        )
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not set
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
} // Gallery Form Component
function GalleryForm({
  galleryItem,
  onClose,
}: {
  galleryItem?: any | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: galleryItem?.title || "",
    description: galleryItem?.description || "",
    imageUrl: galleryItem?.imageUrl || "",
    category: galleryItem?.category || "places",
    featured: galleryItem?.featured || false,
    tags: galleryItem?.tags?.join(", ") || "",
    photographer: galleryItem?.photographer || "",
    location: galleryItem?.location || "",
    isActive: galleryItem?.isActive ?? true,
  });

  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = galleryItem
        ? `/api/gallery/${galleryItem._id}`
        : "/api/gallery";
      const method = galleryItem ? "PUT" : "POST";

      const processedData = {
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean)
          : [],
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save gallery item");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Gallery item ${
          galleryItem ? "updated" : "created"
        } successfully!`,
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {galleryItem ? "Edit Gallery Item" : "Add New Gallery Item"}
        </h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
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
                >
                  <option value="places">Places</option>
                  <option value="culture">Culture</option>
                  <option value="food">Food</option>
                  <option value="events">Events</option>
                  <option value="people">People</option>
                  <option value="architecture">Architecture</option>
                </select>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photographer">Photographer</Label>
                <Input
                  id="photographer"
                  name="photographer"
                  value={formData.photographer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., historic, architecture, indore"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
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
                />
                <Label htmlFor="featured">Featured Image</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-border"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Gallery Item"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Contact Message View Component
function ContactMessageView({
  message,
  onClose,
  onReply,
}: {
  message: any;
  onClose: () => void;
  onReply: (reply: string) => void;
}) {
  const [reply, setReply] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim()) {
      onReply(reply);
      setReply("");
      setShowReplyForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Contact Message Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{message.subject}</CardTitle>
                <div className="flex gap-2">
                  {!message.isRead && <Badge variant="destructive">New</Badge>}
                  {message.isReplied && (
                    <Badge variant="default">Replied</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>

              {message.isReplied && message.reply && (
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium mb-2">Your Reply:</h4>
                  <div className="bg-primary/10 p-3 rounded">
                    <p className="whitespace-pre-wrap">{message.reply}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sent on {new Date(message.replyDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {!message.isReplied && (
                <div className="flex gap-2">
                  <Button onClick={() => setShowReplyForm(true)}>
                    Reply to Message
                  </Button>
                </div>
              )}

              {showReplyForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Send Reply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReply} className="space-y-4">
                      <Textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your reply here..."
                        rows={4}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit">Send Reply</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReplyForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Message Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">From:</Label>
                <p className="font-medium">{message.name}</p>
                <p className="text-sm text-muted-foreground">{message.email}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Date:</Label>
                <p>
                  {new Date(message.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Status:</Label>
                <div className="flex gap-2 mt-1">
                  <Badge variant={message.isRead ? "default" : "destructive"}>
                    {message.isRead ? "Read" : "Unread"}
                  </Badge>
                  {message.isReplied && (
                    <Badge variant="default">Replied</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}