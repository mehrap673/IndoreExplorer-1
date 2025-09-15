import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AboutContent() {
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