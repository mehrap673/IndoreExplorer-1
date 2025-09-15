import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Place } from "../../types/index";
import PlaceForm from "./PlaceForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";

export default // Places Management Component
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
