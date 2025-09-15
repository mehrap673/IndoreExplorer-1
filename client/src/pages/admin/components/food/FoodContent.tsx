import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Food } from "../../types/index";
import FoodForm from "./FoodForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function FoodContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: foodItems = [],
    isLoading,
    refetch,
  } = useQuery<Food[]>({
    queryKey: ["/api/food", { active: "all" }],
    queryFn: async () => {
        const res = await fetch("/api/food");
        if (!res.ok) throw new Error("Failed to fetch food items");
        return res.json();
      },
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

  const filteredFood = foodItems.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || food.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (food: Food) => {
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
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Food Item
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price Range</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFood.map((food) => (
                    <tr key={food._id} className="border-b border-border hover:bg-muted">
                      <td className="p-4 font-medium">{food.name}</td>
                      <td className="p-4"><Badge variant="secondary" className="capitalize">{food.category}</Badge></td>
                      <td className="p-4 text-sm">{food.priceRange}</td>
                      <td className="p-4">
                        <Badge variant={food.isActive ? "default" : "destructive"}>
                          {food.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(food)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(food._id)} className="text-destructive">
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