import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const foods = [
  {
    id: 1,
    name: 'Poha Jalebi',
    description: 'Indore\'s iconic breakfast combination - fluffed rice with crispy, sweet jalebis.',
    category: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹30-50',
    rating: 5
  },
  {
    id: 2,
    name: 'Indori Samosa',
    description: 'Perfectly spiced and crispy samosas served with tangy tamarind and mint chutneys.',
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹15-25',
    rating: 4
  },
  {
    id: 3,
    name: 'Garadu',
    description: 'Deep-fried yam pieces tossed in spices - a unique and beloved Indore street food specialty.',
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹25-40',
    rating: 4
  },
  {
    id: 4,
    name: 'Malpua',
    description: 'Traditional sweet pancakes served with thick rabri and dry fruits, perfect for festivals.',
    category: 'sweets',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹60-80',
    rating: 4
  },
  {
    id: 5,
    name: 'Dal Bafla',
    description: 'A hearty meal of steamed and baked wheat dumplings served with rich dal and ghee.',
    category: 'dinner',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹120-180',
    rating: 5
  },
  {
    id: 6,
    name: 'Khasta Kachori',
    description: 'Flaky, crispy kachoris stuffed with spiced dal, served with aloo sabzi and chutneys.',
    category: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹25-35',
    rating: 4
  }
];

const categories = ['all', 'breakfast', 'snacks', 'sweets', 'dinner'];

export default function FoodPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFoods = selectedCategory === 'all' 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'breakfast': '🌅',
      'snacks': '🍿',
      'sweets': '🍮',
      'dinner': '🍽️'
    };
    return icons[category] || '🍴';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'breakfast': 'bg-orange-500/20 text-orange-400',
      'snacks': 'bg-yellow-500/20 text-yellow-400',
      'sweets': 'bg-pink-500/20 text-pink-400',
      'dinner': 'bg-blue-500/20 text-blue-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <Layout 
      title="Food & Cuisine in Indore - Street Food Capital of India"
      description="Discover Indore's famous food culture including iconic Poha-Jalebi, street food specialties, traditional sweets, and authentic local cuisine. Experience the flavors of India's food capital."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Food & Cuisine</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the culinary capital of India, where every street corner offers a new flavor adventure
            </p>
          </motion.div>

          {/* Food Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">🍽️</div>
              <div className="text-2xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Food Varieties</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">🏪</div>
              <div className="text-2xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Food Outlets</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">⭐</div>
              <div className="text-2xl font-bold text-primary mb-2">#1</div>
              <div className="text-muted-foreground">Food Capital</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">🌙</div>
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Food Scene</div>
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
                {category}
              </button>
            ))}
          </motion.div>

          {/* Food Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredFoods.map((food, index) => (
              <motion.div
                key={food.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                data-testid={`food-${food.id}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
                      {getCategoryIcon(food.category)} {food.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {food.priceRange}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" data-testid={`food-name-${food.id}`}>
                      {food.name}
                    </h3>
                    <div className="flex items-center gap-1" data-testid={`food-rating-${food.id}`}>
                      {getRatingStars(food.rating)}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`food-description-${food.id}`}>
                    {food.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">{food.priceRange}</span>
                    <button className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1" data-testid={`food-try-${food.id}`}>
                      Try Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Famous Food Spots */}
          <motion.div
            className="bg-secondary p-8 rounded-lg mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Famous Food Spots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🌙</div>
                <h3 className="font-semibold mb-2">Sarafa Bazaar</h3>
                <p className="text-sm text-muted-foreground">
                  Night food market with 100+ stalls serving authentic street food
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏪</div>
                <h3 className="font-semibold mb-2">Chappan Dukan</h3>
                <p className="text-sm text-muted-foreground">
                  56 shops offering diverse snacks and traditional delicacies
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🍽️</div>
                <h3 className="font-semibold mb-2">Rajwada Area</h3>
                <p className="text-sm text-muted-foreground">
                  Historic area with traditional restaurants and sweet shops
                </p>
              </div>
            </div>
          </motion.div>

          {/* Food Culture */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Indore Food Culture</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Why Indore is the Food Capital</h3>
                <div className="space-y-4">
                  {[
                    'Highest number of food outlets per capita in India',
                    'Unique fusion of Gujarati, Rajasthani, and Malwa cuisines',
                    'Innovative street food varieties found nowhere else',
                    '24/7 food culture with night markets like Sarafa Bazaar'
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Indore street food scene"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}