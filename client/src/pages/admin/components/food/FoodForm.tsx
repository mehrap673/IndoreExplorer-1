import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Food } from "../../types/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";

interface FoodFormProps {
  food?: Food | null;
  onClose: () => void;
}

export default function FoodForm({ food, onClose }: FoodFormProps) {
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
      const processedData = {
        ...data,
        ingredients: data.ingredients.split(",").map((i: string) => i.trim()),
        restaurants: data.restaurants.split(",").map((r: string) => r.trim()),
      };
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(processedData),
      });
      if (!response.ok) throw new Error("Failed to save food item");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Food item ${food ? "updated" : "created"} successfully!`,
      });
      onClose();
    },
    onError: (error: any) => {
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
    const isCheckbox = type === 'checkbox';
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{food ? "Edit Food Item" : "Add New Food Item"}</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="name">Food Name *</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="category">Category *</Label><select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" required><option value="breakfast">Breakfast</option><option value="snacks">Snacks</option><option value="sweets">Sweets</option><option value="dinner">Dinner</option><option value="beverages">Beverages</option></select></div>
              <div className="space-y-2"><Label htmlFor="priceRange">Price Range *</Label><Input id="priceRange" name="priceRange" value={formData.priceRange} onChange={handleInputChange} placeholder="e.g., ₹50-₹100" required /></div>
              <div className="space-y-2"><Label htmlFor="imageUrl">Image URL *</Label><Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="rating">Rating (0-5)</Label><Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="ingredients">Ingredients (comma-separated)</Label><Input id="ingredients" name="ingredients" value={formData.ingredients} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="restaurants">Restaurants (comma-separated)</Label><Input id="restaurants" name="restaurants" value={formData.restaurants} onChange={handleInputChange} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} required /></div>
            <div className="flex items-center gap-4"><div className="flex items-center space-x-2"><input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} /><Label htmlFor="featured">Featured</Label></div><div className="flex items-center space-x-2"><input type="checkbox" id="isVegetarian" name="isVegetarian" checked={formData.isVegetarian} onChange={handleInputChange} /><Label htmlFor="isVegetarian">Vegetarian</Label></div><div className="flex items-center space-x-2"><input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} /><Label htmlFor="isActive">Active</Label></div></div>
            <div className="flex gap-4"><Button type="submit" disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Food Item"}</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}