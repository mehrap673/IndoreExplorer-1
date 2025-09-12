import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const places = [
  {
    id: 1,
    name: 'Rajwada Palace',
    description: 'A seven-story palace of the Holkar dynasty, showcasing magnificent Maratha architecture and Indo-Saracenic style.',
    category: 'historical',
    imageUrl: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Central Indore'
  },
  {
    id: 2,
    name: 'Lal Bagh Palace',
    description: 'An opulent palace built by the Holkar rulers, featuring European architecture and luxurious interiors.',
    category: 'historical',
    imageUrl: 'https://images.unsplash.com/photo-1534050359320-02900022671e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Lal Bagh'
  },
  {
    id: 3,
    name: 'Sarafa Bazaar',
    description: 'The famous night food market where jewelry shops transform into street food paradise after dark.',
    category: 'modern',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Sarafa Bazaar'
  },
  {
    id: 4,
    name: 'Kanch Mandir',
    description: 'A magnificent Jain temple made entirely of glass and mirrors, creating a dazzling spiritual experience.',
    category: 'religious',
    imageUrl: 'https://images.unsplash.com/photo-1532777946373-b6783242f211?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Itwaria Bazaar'
  },
  {
    id: 5,
    name: 'Patalpani Waterfall',
    description: 'A scenic waterfall near Indore, perfect for trekking and experiencing nature\'s beauty during monsoons.',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: '35km from Indore'
  },
  {
    id: 6,
    name: 'Central Museum',
    description: 'Houses rare artifacts, sculptures, and archaeological findings showcasing the region\'s rich history.',
    category: 'historical',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0d8e23ca4ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'A.B. Road'
  },
  {
    id: 7,
    name: 'Khajrana Ganesh Temple',
    description: 'One of the most revered temples in Indore, famous for its wish-fulfilling Ganesh deity.',
    category: 'religious',
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Khajrana'
  },
  {
    id: 8,
    name: 'Ralamandal Wildlife Sanctuary',
    description: 'A beautiful wildlife sanctuary offering nature trails, bird watching, and peaceful surroundings.',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: '15km from Indore'
  }
];

const categories = ['all', 'historical', 'religious', 'modern', 'nature'];

export default function PlacesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'historical': '🏛️',
      'religious': '🕉️',
      'modern': '🏙️',
      'nature': '🌿'
    };
    return icons[category] || '📍';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'historical': 'bg-amber-500/20 text-amber-400',
      'religious': 'bg-purple-500/20 text-purple-400',
      'modern': 'bg-blue-500/20 text-blue-400',
      'nature': 'bg-green-500/20 text-green-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Layout 
      title="Places to Visit in Indore - Tourist Attractions & Monuments"
      description="Explore the best places to visit in Indore including historical palaces, religious temples, modern attractions, and natural spots. Discover Rajwada, Lal Bagh Palace, Khajrana Temple and more."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Places to Visit in Indore</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the magnificent heritage, spiritual sanctuaries, and natural beauty that make Indore a captivating destination
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 capitalize flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted border border-border'
                }`}
                data-testid={`filter-${category}`}
              >
                {category !== 'all' && <span>{getCategoryIcon(category)}</span>}
                {category}
              </button>
            ))}
          </motion.div>

          {/* Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                data-testid={`place-${place.id}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(place.category)}`}>
                      {getCategoryIcon(place.category)} {place.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {place.location}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3" data-testid={`place-name-${place.id}`}>
                    {place.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`place-description-${place.id}`}>
                    {place.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{place.location}</span>
                    <button className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1" data-testid={`place-learn-more-${place.id}`}>
                      Learn More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Travel Tips */}
          <motion.div
            className="bg-secondary p-8 rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Travel Tips for Exploring Indore</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🚗</div>
                <h3 className="font-semibold mb-2">Transportation</h3>
                <p className="text-sm text-muted-foreground">
                  Use auto-rickshaws, cabs, or rent a car for convenient city travel
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="font-semibold mb-2">Best Time</h3>
                <p className="text-sm text-muted-foreground">
                  Visit between October to March for pleasant weather
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="font-semibold mb-2">Photography</h3>
                <p className="text-sm text-muted-foreground">
                  Most places allow photography, but check rules at religious sites
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎫</div>
                <h3 className="font-semibold mb-2">Entry Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Some historical sites have nominal entry fees for maintenance
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}