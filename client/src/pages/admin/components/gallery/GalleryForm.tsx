import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { GalleryItem } from "../../types/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";

interface GalleryFormProps {
  galleryItem?: GalleryItem | null;
  onClose: () => void;
}

export default function GalleryForm({ galleryItem, onClose }: GalleryFormProps) {
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
      const url = galleryItem ? `/api/gallery/${galleryItem._id}` : "/api/gallery";
      const method = galleryItem ? "PUT" : "POST";
      const processedData = {
        ...data,
        tags: data.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
      };
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(processedData),
      });
      if (!response.ok) throw new Error("Failed to save gallery item");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Gallery item ${galleryItem ? "updated" : "created"} successfully!`,
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
    const isCheckbox = type === "checkbox";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <h2 className="text-2xl font-bold">{galleryItem ? "Edit Gallery Item" : "Add New Gallery Item"}</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="category">Category *</Label><select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" required><option value="places">Places</option><option value="culture">Culture</option><option value="food">Food</option><option value="events">Events</option><option value="people">People</option><option value="architecture">Architecture</option></select></div>
              <div className="space-y-2"><Label htmlFor="imageUrl">Image URL *</Label><Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="photographer">Photographer</Label><Input id="photographer" name="photographer" value={formData.photographer} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" value={formData.location} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g., historic, indore" /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} /></div>
            <div className="flex gap-4"><div className="flex items-center space-x-2"><input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} /><Label htmlFor="featured">Featured</Label></div><div className="flex items-center space-x-2"><input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} /><Label htmlFor="isActive">Active</Label></div></div>
            <div className="flex gap-4"><Button type="submit" disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Item"}</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}