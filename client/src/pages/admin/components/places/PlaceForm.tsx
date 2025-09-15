import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Place } from "../../types/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";

interface PlaceFormProps {
  place?: Place | null;
  onClose: () => void;
}

export default function PlaceForm({ place, onClose }: PlaceFormProps) {
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
      if (!response.ok) throw new Error("Failed to save place");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const isNumber = type === "number";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (isNumber ? Number(value) : value),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <h2 className="text-2xl font-bold">{place ? "Edit Place" : "Add New Place"}</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="name">Place Name *</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="category">Category *</Label><select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" required><option value="historical">Historical</option><option value="religious">Religious</option><option value="modern">Modern</option><option value="nature">Nature</option></select></div>
              <div className="space-y-2"><Label htmlFor="location">Location *</Label><Input id="location" name="location" value={formData.location} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="imageUrl">Image URL *</Label><Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="rating">Rating (0-5)</Label><Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="entryFee">Entry Fee</Label><Input id="entryFee" name="entryFee" value={formData.entryFee} onChange={handleInputChange} placeholder="e.g., ₹50 or Free" /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="visitingHours">Visiting Hours</Label><Input id="visitingHours" name="visitingHours" value={formData.visitingHours} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 6:00 PM" /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} required /></div>
            <div className="flex gap-4"><div className="flex items-center space-x-2"><input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} /><Label htmlFor="featured">Featured</Label></div><div className="flex items-center space-x-2"><input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} /><Label htmlFor="isActive">Active</Label></div></div>
            <div className="flex gap-4"><Button type="submit" disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Place"}</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}