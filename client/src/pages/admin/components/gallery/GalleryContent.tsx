import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GalleryItem } from "../../types/index";
import GalleryForm from "./GalleryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function GalleryContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: galleryItems = [],
    isLoading,
    refetch,
  } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery", { active: "all" }],
    queryFn: async () => {
        const res = await fetch("/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch gallery items");
        return res.json();
      },
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

  const filteredGallery = galleryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: GalleryItem) => {
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

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : filteredGallery.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || categoryFilter !== "all"
                ? "No gallery items match your filters"
                : "No gallery items found. Add your first image!"}
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => (
                  <div
                    key={item._id}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <Badge variant="secondary" className="capitalize text-xs">{item.category}</Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {item.featured && (<Badge variant="default" className="text-xs">Featured</Badge>)}
                          <Badge variant={item.isActive ? "default" : "destructive"} className="text-xs">{item.isActive ? "Active" : "Inactive"}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(item._id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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