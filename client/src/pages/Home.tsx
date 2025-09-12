import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Hero from '@/components/ui/hero';
import Layout from '@/components/Layout';

const highlights = [
  {
    title: 'Historical Places',
    description: 'Explore magnificent palaces, ancient temples, and architectural marvels',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    href: '/places',
    icon: '🏛️',
    stats: '15+ Attractions'
  },
  {
    title: 'Food & Cuisine',
    description: 'Savor authentic Indori flavors from famous poha-jalebi to diverse street food delights',
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    href: '/food',
    icon: '🍽️',
    stats: '200+ Dishes'
  },
  {
    title: 'Events & Festivals',
    description: 'Join vibrant celebrations and cultural events that bring the city to life throughout the year',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    href: '/events',
    icon: '🎉',
    stats: '50+ Events'
  },
  {
    title: 'Weather',
    description: 'Stay updated with real-time weather conditions and plan your perfect visit to Indore',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    href: '/weather',
    icon: '🌤️',
    stats: 'Live Updates'
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Delhi',
    text: 'Indore exceeded all my expectations! The food was incredible and the people were so welcoming.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c96a2ba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'
  },
  {
    name: 'Rajesh Kumar',
    location: 'Mumbai',
    text: 'The perfect blend of history and modernity. I loved exploring the palaces and trying street food.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'
  },
  {
    name: 'Sarah Johnson',
    location: 'London',
    text: 'An amazing cultural experience! The festivals and local traditions were absolutely fascinating.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'
  }
];

const cityStats = [
  { number: '3M+', label: 'Population', description: 'Vibrant metropolitan city' },
  { number: '500+', label: 'Years Old', description: 'Rich historical heritage' },
  { number: '15+', label: 'Attractions', description: 'Must-visit destinations' },
  { number: '200+', label: 'Food Items', description: 'Culinary diversity' }
];

const features = [
  {
    icon: '🍴',
    title: 'Food Capital',
    description: 'Known as the food capital of India with world-famous street food'
  },
  {
    icon: '🏆',
    title: 'Cleanest City',
    description: 'Ranked as one of Indias cleanest cities for multiple years'
  },
  {
    icon: '🎭',
    title: 'Cultural Hub',
    description: 'Rich cultural heritage with vibrant festivals and traditions'
  },
  {
    icon: '🏭',
    title: 'Commercial Center',
    description: 'Major commercial and industrial hub of Madhya Pradesh'
  }
];

export default function HomePage() {
  return (
    <Layout 
      title="All About Indore - Discover the Heart of Madhya Pradesh"
      description="Explore Indore's rich culture, delicious cuisine, historical places, and vibrant events. Your complete guide to the Heart of Madhya Pradesh."
    >
      <Hero />
      
      {/* Quick Highlights */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Discover Indore</h2>
            <p className="text-muted-foreground text-lg">Experience the best of what our city has to offer</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-background border border-border rounded-lg p-6 card-hover cursor-pointer"
                data-testid={`card-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Link href={item.href}>
                  <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex items-center mb-3">
                    <span className="text-xl mr-3">{item.icon}</span>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">{item.stats}</span>
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-foreground">Why Visit Indore?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Indore, the largest city in Madhya Pradesh, is a perfect blend of historical significance and modern development. Known as the commercial capital of the state, it offers visitors a unique experience with its rich culture, delicious food, and warm hospitality.
              </p>
              <div className="space-y-4">
                {[
                  'Rich historical heritage and architecture',
                  'World-famous street food culture',
                  'Vibrant festivals and cultural events',
                  'Modern shopping and entertainment'
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
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1609920658906-8223bd289001?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Indore architectural beauty"
                className="rounded-lg shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* City Statistics */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-primary-foreground">Indore by Numbers</h2>
            <p className="text-primary-foreground/80 text-lg">Discover what makes our city special</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {cityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold text-primary-foreground mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-primary-foreground mb-1">{stat.label}</div>
                <div className="text-primary-foreground/70">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">What Makes Indore Special</h2>
            <p className="text-muted-foreground text-lg">Discover the unique characteristics of our beloved city</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-card rounded-lg border border-border card-hover"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-secondary-foreground">What Visitors Say</h2>
            <p className="text-secondary-foreground/80 text-lg">Hear from travelers who fell in love with Indore</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-background p-6 rounded-lg border border-border card-hover"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-foreground italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-accent-foreground">Stay Updated</h2>
            <p className="text-accent-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Get the latest news about events, festivals, and new attractions in Indore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-primary-foreground">Start Your Journey Today</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're planning a short visit or an extended stay, Indore has something special waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/places"
                className="bg-background text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-background/90 transition-colors"
                data-testid="button-explore-places"
              >
                Explore Places
              </Link>
              <Link
                href="/food"
                className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                data-testid="button-discover-food"
              >
                Discover Food
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}