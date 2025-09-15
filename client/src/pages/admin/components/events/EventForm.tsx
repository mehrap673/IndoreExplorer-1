import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Event } from "../../types/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
}

export default function EventForm({ event, onClose }: EventFormProps) {
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:mm"
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
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save event");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Event ${event ? "updated" : "created"} successfully!`,
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
        <h2 className="text-2xl font-bold">{event ? "Edit Event" : "Add New Event"}</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="name">Event Name *</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="category">Category *</Label><select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" required><option value="cultural">Cultural</option><option value="religious">Religious</option><option value="festival">Festival</option><option value="food">Food</option><option value="music">Music</option></select></div>
              <div className="space-y-2"><Label htmlFor="date">Start Date & Time *</Label><Input id="date" name="date" type="datetime-local" value={formData.date} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="endDate">End Date & Time</Label><Input id="endDate" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="location">Location *</Label><Input id="location" name="location" value={formData.location} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="imageUrl">Image URL *</Label><Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., ₹500 or Free" /></div>
              <div className="space-y-2"><Label htmlFor="organizer">Organizer</Label><Input id="organizer" name="organizer" value={formData.organizer} onChange={handleInputChange} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} required /></div>
            <div className="flex items-center gap-4"><div className="flex items-center space-x-2"><input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} /><Label htmlFor="featured">Featured</Label></div><div className="flex items-center space-x-2"><input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} /><Label htmlFor="isActive">Active</Label></div></div>
            <div className="flex gap-4"><Button type="submit" disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Event"}</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}