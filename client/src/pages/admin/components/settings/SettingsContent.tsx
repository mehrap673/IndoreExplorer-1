import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Setting } from "../../types/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save } from "lucide-react";

export default function SettingsContent() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");

  const {
    data: settingsData = [],
    isLoading,
    refetch,
  } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      },
  });

  useEffect(() => {
    if (settingsData) {
      const settingsMap = settingsData.reduce(
        (acc: Record<string, any>, setting: Setting) => {
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
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
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
    { key: "SITE_NAME", label: "Site Name", description: "Display name for your website", type: "text" },
    { key: "SITE_DESCRIPTION", label: "Site Description", description: "Brief description of your website", type: "text" },
    { key: "CONTACT_EMAIL", label: "Contact Email", description: "Primary contact email for the website", type: "email" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Settings</h2></div>

      <Card>
        <CardHeader><CardTitle>Site Configuration</CardTitle><CardDescription>Manage site-wide settings</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (<div className="p-8 text-center">Loading...</div>) : (
            settingConfigs.map((config) => (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">{config.label}</Label>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {editingKey === config.key ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleSave} disabled={updateSettingMutation.isPending}><Save className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleEdit(config.key)}><Edit className="h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
                {editingKey === config.key ? (
                  <Input type={config.type} value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                ) : (
                  <div className="p-3 bg-muted rounded-lg"><p className="text-sm font-mono">{settings[config.key] ? settings[config.key] : (<span className="text-muted-foreground italic">Not set</span>)}</p></div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}