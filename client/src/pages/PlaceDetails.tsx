import React from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Tag, 
  DollarSign, 
  Star, 
  MapPin, 
  Calendar,
  Camera,
  Users,
  Info,
  Globe,
  Heart,
  Share2
} from 'lucide-react';
import Layout from "@/components/Layout";

// Updated type definitions based on new backend structure
interface WikipediaInfo {
  title: string;
  aliases?: string[];
  summary?: string;
  imageUrl?: string | null;
  infobox?: { [key: string]: any } | null;
  gallery?: { caption: string; imageUrl: string }[] | null;
  wikiUrl?: string;
}

interface Place {
  _id: string;
  name: string;
  description: string;
  location?: string;
  category?: string;
  rating?: number;
  imageUrl?: string;
  tags?: string[];
  visitingHours?: string;
  entryFee?: string;
  featured?: boolean;
  isActive?: boolean;
  wikipedia?: WikipediaInfo;
}

interface PlaceDetailsProps {
  placeId?: string;
}

// Fetch function for single place
const fetchPlace = async (id: string): Promise<Place> => {
  const res = await fetch(`/api/places/${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Place not found');
    }
    if (res.status === 400) {
      throw new Error('Invalid place ID');
    }
    throw new Error('Failed to fetch place details');
  }
  return res.json();
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <Layout title="Loading..." description="Loading place details...">
    <div className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="mb-8">
            <div className="h-6 w-32 bg-muted rounded"></div>
          </div>
          
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 w-3/4 bg-muted rounded mx-auto mb-6"></div>
            <div className="h-6 w-1/2 bg-muted rounded mx-auto mb-4"></div>
            <div className="h-4 w-1/4 bg-muted rounded mx-auto"></div>
          </div>
          
          {/* Image skeleton */}
          <div className="w-full h-96 bg-muted rounded-lg mb-12"></div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

// Error component
const ErrorDisplay = ({ error, onRetry }: { error: Error; onRetry: () => void }) => {
  return (
    <Layout title="Error" description="An error occurred">
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div 
            className="max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <MapPin className="w-20 h-20 text-muted-foreground mx-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {error.message === 'Place not found' ? 'Place Not Found' : 'Something went wrong'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {error.message === 'Place not found' 
                ? 'The place you\'re looking for doesn\'t exist or has been removed.'
                : 'We couldn\'t load the place details. Please try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                Try Again
              </button>
              <Link href="/places">
                <a className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-200 inline-block">
                  Back to Places
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

// Helper functions
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    historical: "🏛️",
    religious: "🕉️", 
    modern: "🏙️",
    nature: "🌿",
  };
  return icons[category.toLowerCase()] || "📍";
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    historical: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    religious: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    modern: "bg-blue-500/20 text-blue-400 border-blue-500/30", 
    nature: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return colors[category.toLowerCase()] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

// Info card component
const InfoCard = ({ icon: Icon, label, value, delay = 0 }: { 
  icon: any; 
  label: string; 
  value: string;
  delay?: number;
}) => (
  <motion.div 
    className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -4 }}
  >
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold text-card-foreground">{value}</p>
      </div>
    </div>
  </motion.div>
);

// Category badge component
const CategoryBadge = ({ category }: { category: string }) => (
  <motion.span
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border capitalize ${getCategoryColor(category)}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    whileHover={{ scale: 1.05 }}
  >
    <span>{getCategoryIcon(category)}</span>
    {category}
  </motion.span>
);

// Tags component
const TagsList = ({ tags }: { tags: string[] }) => (
  <motion.div 
    className="flex flex-wrap gap-3 mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.6 }}
  >
    {tags.map((tag, index) => (
      <motion.span
        key={index}
        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary border border-border text-foreground text-sm rounded-full hover:bg-muted transition-colors cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
        whileHover={{ scale: 1.05 }}
      >
        <Tag className="w-3 h-3" />
        {tag}
      </motion.span>
    ))}
  </motion.div>
);

// Aliases component
const AliasesList = ({ aliases }: { aliases: string[] }) => (
  <motion.div 
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.5 }}
  >
    <p className="text-muted-foreground text-sm mb-2">Also known as:</p>
    <div className="flex flex-wrap gap-2">
      {aliases.map((alias, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-muted text-sm rounded-full border"
        >
          {alias}
        </span>
      ))}
    </div>
  </motion.div>
);

// Gallery component
const Gallery = ({ gallery }: { gallery: { caption: string; imageUrl: string }[] }) => (
  <motion.div 
    className="mb-8"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.9 }}
  >
    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <Camera className="w-6 h-6 text-primary" />
      Gallery
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gallery.map((item, index) => (
        <motion.div
          key={index}
          className="relative group overflow-hidden rounded-lg bg-muted aspect-video"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={item.imageUrl}
            alt={item.caption}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          {item.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
              <p className="text-sm">{item.caption}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Infobox component
const InfoboxCard = ({ infobox }: { infobox: { [key: string]: any } }) => (
  <motion.div 
    className="bg-secondary border border-border rounded-lg p-6 mb-8"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.8 }}
  >
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Info className="w-5 h-5 text-primary" />
      Quick Facts
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(infobox).map(([key, value], index) => (
        <div key={key} className="border-l-2 border-primary/30 pl-3">
          <p className="text-sm text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </p>
          <p className="font-medium text-sm">{String(value)}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

// Action buttons component
const ActionButtons = () => (
  <motion.div
    className="flex gap-3 mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
  >
    <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
      <Heart className="w-4 h-4" />
      Save
    </button>
    <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-muted transition-colors">
      <Share2 className="w-4 h-4" />
      Share
    </button>
  </motion.div>
);

// Main component
const PlaceDetails: React.FC<PlaceDetailsProps> = ({ placeId }) => {
  const params = useParams();
  const id = params.placeId || placeId;

  const {
    data: place,
    isLoading,
    error,
    refetch
  } = useQuery<Place, Error>({
    queryKey: [`/api/places/${id}`],
    enabled: !!id,
    queryFn: () => fetchPlace(id!),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => refetch()} />;
  }

  if (!place) {
    return <ErrorDisplay error={new Error('Place not found')} onRetry={() => refetch()} />;
  }

  const { wikipedia } = place;
  const displayImage = wikipedia?.imageUrl || place.imageUrl;
  const displaySummary = wikipedia?.summary || place.description;

  return (
    <Layout 
      title={`${place.name} - Places to Visit in Indore`}
      description={displaySummary || `Discover ${place.name}, one of the must-visit places in Indore.`}
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Back button */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/places">
              <a className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Places
              </a>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">{place.name}</h1>
            
            {/* Aliases */}
            {wikipedia?.aliases && wikipedia.aliases.length > 0 && (
              <AliasesList aliases={wikipedia.aliases} />
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              {place.category && <CategoryBadge category={place.category} />}
              {place.featured && (
                <motion.span 
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-full font-medium flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-4 h-4" />
                  Featured
                </motion.span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
              {place.rating && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold text-foreground">
                    {place.rating.toFixed(1)}
                  </span>
                  <span className="text-sm">/ 5.0</span>
                </motion.div>
              )}
              {place.location && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{place.location}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <ActionButtons />

          {/* Hero Image */}
          {displayImage && (
            <motion.div 
              className="relative h-96 rounded-lg overflow-hidden mb-12 group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src={displayImage}
                alt={place.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute top-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && <TagsList tags={place.tags} />}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description and Wikipedia Content */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Wikipedia Summary */}
              {displaySummary && (
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-6">About {place.name}</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-foreground">
                      {displaySummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Infobox */}
              {wikipedia?.infobox && (
                <InfoboxCard infobox={wikipedia.infobox} />
              )}

              {/* Gallery */}
              {wikipedia?.gallery && wikipedia.gallery.length > 0 && (
                <Gallery gallery={wikipedia.gallery} />
              )}

              {/* Additional DB Description */}
              {place.description && place.description !== displaySummary && (
                <motion.div 
                  className="bg-secondary border border-border rounded-lg p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    Local Insights
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {place.description}
                  </p>
                </motion.div>
              )}

              {/* Wikipedia Link */}
              {wikipedia?.wikiUrl && (
                <motion.div 
                  className="bg-card border border-border rounded-lg p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Learn More</h4>
                        <p className="text-sm text-muted-foreground">
                          Explore detailed information on Wikipedia
                        </p>
                      </div>
                    </div>
                    <a
                      href={wikipedia.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Wikipedia
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Info Cards Sidebar */}
            <div className="space-y-6">
              {place.rating && (
                <InfoCard
                  icon={Star}
                  label="Rating"
                  value={`${place.rating.toFixed(1)} / 5.0`}
                  delay={0.5}
                />
              )}
              
              {place.visitingHours && (
                <InfoCard
                  icon={Clock}
                  label="Visiting Hours"
                  value={place.visitingHours}
                  delay={0.6}
                />
              )}
              
              {place.entryFee && (
                <InfoCard
                  icon={DollarSign}
                  label="Entry Fee"
                  value={place.entryFee}
                  delay={0.7}
                />
              )}
              
              {place.category && (
                <InfoCard
                  icon={Calendar}
                  label="Category"
                  value={place.category.charAt(0).toUpperCase() + place.category.slice(1)}
                  delay={0.8}
                />
              )}

              {place.tags && place.tags.length > 0 && (
                <InfoCard
                  icon={Tag}
                  label="Tags"
                  value={`${place.tags.length} categories`}
                  delay={0.9}
                />
              )}

              {/* Enhanced Tips Card */}
              <motion.div
                className="bg-gradient-to-br from-primary/10 to-secondary/20 border border-border rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Travel Tips
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Best visited during early morning or evening for pleasant weather</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Carry water and wear comfortable walking shoes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Respect local customs and photography guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Check opening hours before visiting</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Call to Action */}
          <motion.div
            className="mt-16 bg-secondary p-8 rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Discover more amazing places in Indore and plan your perfect itinerary.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/places">
                  <a className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium">
                    <MapPin className="w-5 h-5" />
                    Explore More Places
                  </a>
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-3 border border-border rounded-lg hover:bg-muted transition-all duration-200 font-medium">
                  <Calendar className="w-5 h-5" />
                  Plan Your Visit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PlaceDetails;