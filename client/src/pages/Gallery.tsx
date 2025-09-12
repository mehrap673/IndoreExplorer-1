import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    alt: 'Rajwada Palace at Night',
    category: 'historical'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    alt: 'Indore Street Food',
    category: 'food'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=350',
    alt: 'Cultural Festival Dance',
    category: 'events'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1534050359320-02900022671e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
    alt: 'Lal Bagh Palace Interior',
    category: 'historical'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1532777946373-b6783242f211?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
    alt: 'Kanch Mandir Glass Temple',
    category: 'historical'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=350',
    alt: 'Traditional Sweets',
    category: 'food'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    alt: 'Indore Gardens and Nature',
    category: 'nature'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=550',
    alt: 'Ganesh Festival Celebration',
    category: 'events'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    alt: 'Traditional Kachori',
    category: 'food'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=450',
    alt: 'Architectural Details',
    category: 'historical'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
    alt: 'Patalpani Waterfall',
    category: 'nature'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=350',
    alt: 'Night Food Scene',
    category: 'food'
  }
];

const categories = ['all', 'historical', 'food', 'events', 'nature'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'historical': '🏛️',
      'food': '🍽️',
      'events': '🎉',
      'nature': '🌿'
    };
    return icons[category] || '📸';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'historical': 'bg-amber-500/20 text-amber-400',
      'food': 'bg-orange-500/20 text-orange-400',
      'events': 'bg-pink-500/20 text-pink-400',
      'nature': 'bg-green-500/20 text-green-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const selectedImageData = selectedImage ? galleryImages.find(img => img.id === selectedImage) : null;

  return (
    <Layout 
      title="Photo Gallery - Beautiful Images of Indore"
      description="Explore stunning photographs of Indore showcasing historical monuments, delicious food, cultural events, and natural beauty. Visual journey through the Heart of Madhya Pradesh."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Photo Gallery</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A visual journey through Indore's magnificent heritage, vibrant culture, and natural beauty
            </p>
          </motion.div>

          {/* Gallery Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">📸</div>
              <div className="text-2xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Photos</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">🏛️</div>
              <div className="text-2xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Monuments</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">🎉</div>
              <div className="text-2xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Events</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">🌿</div>
              <div className="text-2xl font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground">Nature Spots</div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
                {category} {category !== 'all' && `(${galleryImages.filter(img => img.category === category).length})`}
              </button>
            ))}
          </motion.div>

          {/* Image Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="break-inside-avoid group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => openLightbox(image.id)}
                data-testid={`image-${image.id}`}
              >
                <div className="relative overflow-hidden rounded-lg bg-card border border-border">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(image.category)}`}>
                        {getCategoryIcon(image.category)} {image.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {selectedImage && selectedImageData && (
            <motion.div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.div
                className="relative max-w-4xl max-h-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImageData.src}
                  alt={selectedImageData.alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-lg font-semibold mb-1">{selectedImageData.alt}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedImageData.category)}`}>
                        {getCategoryIcon(selectedImageData.category)} {selectedImageData.category}
                      </span>
                    </div>
                    <button
                      onClick={closeLightbox}
                      className="text-white hover:text-gray-300 transition-colors"
                      data-testid="button-close-lightbox"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Photography Tips */}
          <motion.div
            className="mt-16 bg-secondary p-8 rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Photography Tips for Indore</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🌅</div>
                <h3 className="font-semibold mb-2">Golden Hour</h3>
                <p className="text-sm text-muted-foreground">
                  Best lighting for monuments and architecture during sunrise and sunset
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="font-semibold mb-2">Architecture</h3>
                <p className="text-sm text-muted-foreground">
                  Capture intricate details of Rajwada and Lal Bagh Palace
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🍽️</div>
                <h3 className="font-semibold mb-2">Food Photography</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect lighting at Sarafa Bazaar during evening hours
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}