import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const timelineEvents = [
  {
    year: '1715',
    title: 'Foundation of Indore',
    description: 'Rao Nandlal Chaudhary establishes Indore as a trading post on the banks of river Saraswati, marking the beginning of the city\'s commercial legacy.'
  },
  {
    year: '1733',
    title: 'Holkar Dynasty Begins',
    description: 'Malhar Rao Holkar I establishes the Holkar dynasty, transforming Indore into a major power center in Central India.'
  },
  {
    year: '1767-1795',
    title: 'Ahilya Bai\'s Golden Era',
    description: 'Queen Ahilya Bai Holkar\'s enlightened rule brings prosperity, with extensive temple construction and infrastructure development across the region.'
  },
  {
    year: '1886',
    title: 'Lal Bagh Palace',
    description: 'Construction of the magnificent Lal Bagh Palace begins, showcasing European architectural influences and royal grandeur.'
  },
  {
    year: '1947',
    title: 'Integration with India',
    description: 'Indore state merges with the Indian Union, marking the beginning of modern democratic governance and rapid development.'
  },
  {
    year: '2016-2022',
    title: 'Cleanest City Achievement',
    description: 'Indore wins the title of India\'s Cleanest City for six consecutive years, setting new standards in urban cleanliness and governance.'
  }
];

const facts = [
  { icon: '📅', label: 'Founded', value: '1715 AD' },
  { icon: '👥', label: 'Population', value: '3.2 Million' },
  { icon: '📍', label: 'Area', value: '530 km²' },
  { icon: '🗣️', label: 'Languages', value: 'Hindi, English' }
];

const culturalSignificance = [
  {
    icon: '🍽️',
    title: 'Food Capital',
    description: 'Recognized as India\'s food capital with unique culinary traditions and the highest concentration of food outlets.'
  },
  {
    icon: '🏭',
    title: 'Commercial Hub',
    description: 'Major commercial and industrial center contributing significantly to Madhya Pradesh\'s economy.'
  },
  {
    icon: '🎓',
    title: 'Educational Center',
    description: 'Home to prestigious institutions including IIT Indore and AIIMS, making it an important educational hub.'
  },
  {
    icon: '🏛️',
    title: 'Cultural Heritage',
    description: 'Rich cultural legacy with magnificent palaces, temples, and monuments reflecting diverse architectural styles.'
  }
];

export default function AboutPage() {
  return (
    <Layout 
      title="About Indore - History, Culture & Heritage"
      description="Discover the rich history and cultural heritage of Indore, from its founding in 1715 to becoming India's cleanest city. Learn about Queen Ahilya Bai Holkar's legacy and the city's modern achievements."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">About Indore</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the fascinating story of Indore, from its humble beginnings as a trading post to becoming the commercial capital of Madhya Pradesh and India's cleanest city.
            </p>
          </motion.div>

          {/* Quick Facts */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {facts.map((fact, index) => (
              <motion.div
                key={fact.label}
                className="text-center p-6 bg-card rounded-lg border border-border"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`fact-${fact.label.toLowerCase()}`}
              >
                <div className="text-3xl mb-3">{fact.icon}</div>
                <div className="text-2xl font-bold text-primary mb-2">{fact.value}</div>
                <div className="text-muted-foreground">{fact.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Historical Timeline */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-16">Historical Timeline</h2>
            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  className="flex flex-col md:flex-row gap-6 p-6 bg-card rounded-lg border border-border"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`timeline-${event.year}`}
                >
                  <div className="md:w-32 flex-shrink-0">
                    <div className="bg-primary text-primary-foreground text-lg font-bold text-center py-2 px-4 rounded-lg">
                      {event.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cultural Significance */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-16">Cultural Significance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {culturalSignificance.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="p-6 bg-card rounded-lg border border-border"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`cultural-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{item.icon}</span>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Modern Indore */}
          <motion.div
            className="bg-secondary p-8 rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Modern Indore</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Today's Indore stands as a testament to successful urban planning and governance. The city has emerged as a model for cleanliness and sustainability while maintaining its cultural identity and commercial importance.
                </p>
                <div className="space-y-4">
                  {[
                    'Six-time winner of India\'s Cleanest City award',
                    'Major IT and pharmaceutical hub',
                    'Home to prestigious educational institutions',
                    'Gateway to Madhya Pradesh tourism'
                  ].map((achievement, index) => (
                    <motion.div
                      key={achievement}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1596196387740-57d1f71e8dc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Modern Indore cityscape"
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