import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Utensils, Calendar, Image } from "lucide-react";
import StatsCard from "./StatsCard";

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Places" value="0" icon={MapPin} />
        <StatsCard title="Food Items" value="0" icon={Utensils} />
        <StatsCard title="Events" value="0" icon={Calendar} />
        <StatsCard title="Gallery Images" value="0" icon={Image} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and changes to your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    </div>
  );
}