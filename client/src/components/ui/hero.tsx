import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200"
          alt="Panoramic view of Indore cityscape"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Welcome to Indore
          <motion.span
            className="text-primary block text-3xl md:text-5xl mt-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Heart of Madhya Pradesh
          </motion.span>
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Discover the rich heritage, vibrant culture, and delicious cuisine of India's cleanest city
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Link
            href="/places"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            data-testid="button-explore"
          >
            Explore More
          </Link>
          <Link
            href="/events"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-background px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            data-testid="button-plan-trip"
          >
            Plan Your Trip
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
