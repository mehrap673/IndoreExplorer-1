import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Weather from "@/pages/Weather";
import News from "@/pages/News";
import Places from "@/pages/Places";
import Food from "@/pages/Food";
import Events from "@/pages/Events";
import Gallery from "@/pages/Gallery";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/weather" component={Weather} />
      <Route path="/news" component={News} />
      <Route path="/places" component={Places} />
      <Route path="/food" component={Food} />
      <Route path="/events" component={Events} />
      <Route path="/gallery" component={Gallery} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
