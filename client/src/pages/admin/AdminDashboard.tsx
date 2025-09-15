import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

// Import types using the specified relative path
import { AdminUser } from "./types/index";

// Import local constants and components
import { SIDEBAR_ITEMS } from "./constants";
import DashboardContent from "./components/dashboard/DashboardContent";
import PlacesContent from "./components/places/PlacesContent";
import FoodContent from "./components/food/FoodContent";
import EventsContent from "./components/events/EventsContent";
import GalleryContent from "./components/gallery/GalleryContent";
import AboutContent from "./components/about/AboutContent";
import ContactContent from "./components/contact/ContactContent";
import SettingsContent from "./components/settings/SettingsContent";

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

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
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">
                {user.username}
              </p>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
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
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <div className={`lg:ml-64 transition-all duration-300`}>
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-card-foreground capitalize">
                {
                  SIDEBAR_ITEMS.find((item) => item.id === activeSection)
                    ?.label
                }
              </h1>
            </div>
          </div>
        </header>

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