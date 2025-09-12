import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const events = [
  {
    id: 1,
    name: 'Rangpanchami Festival',
    description: 'A vibrant celebration of colors marking the end of Holi festivities, unique to Indore with traditional dances and community gatherings.',
    date: 'March 18, 2024',
    category: 'festival',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    location: 'City Center, Rajwada Palace',
    price: 'Free'
  },
  {
    id: 2,
    name: 'Ahilya Utsav',
    description: 'Annual cultural festival celebrating Rani Ahilya Bai Holkar with classical music, dance performances, and art exhibitions.',
    date: 'December 2-8, 2024',
    category: 'cultural',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    location: 'Lal Bagh Palace Grounds',
    price: '₹100-500'
  },
  {
    id: 3,
    name: 'Ganesh Chaturthi',
    description: 'Grand celebration with elaborate processions, beautifully decorated pandals, and the famous Khajrana Ganesh temple festivities.',
    date: 'August 30, 2024',
    category: 'religious',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    location: 'Khajrana Ganesh Temple',
    price: 'Free'
  },
  {
    id: 4,
    name: 'Navratri Festival',
    description: 'Nine nights of energetic garba and dandiya dancing with live music and traditional festivities.',
    date: 'October 15-24, 2024',
    category: 'festival',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    location: 'Various venues across city',
    price: '₹150-800'
  }
];

const eventCategories = [
  { name: 'Cultural Festivals', count: 12, color: 'bg-green-500/20 text-green-400' },
  { name: 'Religious Events', count: 8, color: 'bg-blue-500/20 text-blue-400' },
  { name: 'Food Festivals', count: 5, color: 'bg-yellow-500/20 text-yellow-400' },
  { name: 'Music & Arts', count: 6, color: 'bg-purple-500/20 text-purple-400' }
];

export default function EventsPage() {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'festival': '🎉',
      'cultural': '🎭',
      'religious': '🕉️',
      'food': '🍴',
      'music': '🎵'
    };
    return icons[category] || '📅';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'festival': 'bg-pink-500/20 text-pink-400',
      'cultural': 'bg-purple-500/20 text-purple-400',
      'religious': 'bg-blue-500/20 text-blue-400',
      'food': 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Layout 
      title="Events & Festivals in Indore - Cultural Celebrations & Festivities"
      description="Explore the vibrant events and festivals in Indore including Rangpanchami, Ahilya Utsav, Ganesh Chaturthi, and cultural celebrations throughout the year."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Events & Festivals</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the vibrant cultural celebrations that bring Indore to life throughout the year
            </p>
          </motion.div>

          {/* Event Categories Overview */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {eventCategories.map((category, index) => (
              <motion.div
                key={category.name}
                className="text-center p-6 bg-card rounded-lg border border-border"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`text-xl font-bold mb-2 px-3 py-1 rounded-full ${category.color}`}>
                  {category.count}+
                </div>
                <div className="text-sm font-medium">{category.name}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Events */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  data-testid={`event-${event.id}`}
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 relative">
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="object-cover w-full h-48 md:h-full"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                          {getCategoryIcon(event.category)} {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-xl font-bold mb-3" data-testid={`event-name-${event.id}`}>
                        {event.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`event-description-${event.id}`}>
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span data-testid={`event-date-${event.id}`}>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span data-testid={`event-location-${event.id}`}>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="font-semibold text-primary" data-testid={`event-price-${event.id}`}>{event.price}</span>
                        </div>
                      </div>
                      <button className="mt-4 text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1" data-testid={`event-details-${event.id}`}>
                        Event Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Event Calendar */}
          <motion.div
            className="bg-secondary p-8 rounded-lg mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Annual Event Calendar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { month: 'January', events: ['Republic Day Celebration', 'Makar Sankranti'] },
                { month: 'March', events: ['Holi', 'Rangpanchami', 'Malwa Utsav'] },
                { month: 'April', events: ['Ram Navami', 'Mahavir Jayanti'] },
                { month: 'August', events: ['Independence Day', 'Ganesh Chaturthi'] },
                { month: 'October', events: ['Navratri', 'Dussehra', 'Karva Chauth'] },
                { month: 'December', events: ['Ahilya Utsav', 'Christmas Celebration'] }
              ].map((monthData, index) => (
                <motion.div
                  key={monthData.month}
                  className="bg-card p-4 rounded-lg border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`calendar-${monthData.month.toLowerCase()}`}
                >
                  <h3 className="font-semibold text-primary mb-3">{monthData.month}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {monthData.events.map((event, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {event}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cultural Heritage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Cultural Heritage</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Celebrating Traditions</h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Indore's events and festivals reflect the city's rich cultural tapestry, blending ancient traditions with modern celebrations. From the unique Rangpanchami festival to the grandeur of Ahilya Utsav, each event tells a story of the city's vibrant heritage.
                </p>
                <div className="space-y-4">
                  {[
                    'Traditional folk dances and music performances',
                    'Religious celebrations bringing communities together',
                    'Cultural exhibitions showcasing local arts and crafts',
                    'Food festivals highlighting Indore\'s culinary heritage'
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
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Cultural celebration in Indore"
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