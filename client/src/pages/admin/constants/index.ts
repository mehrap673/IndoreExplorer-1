import {
  LayoutDashboard,
  MapPin,
  Utensils,
  Calendar,
  Image,
  User,
  Mail,
  Settings,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "places", label: "Places", icon: MapPin },
  { id: "food", label: "Food & Cuisine", icon: Utensils },
  { id: "events", label: "Events", icon: Calendar },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "about", label: "About/History", icon: User },
  { id: "contact", label: "Contact Messages", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];