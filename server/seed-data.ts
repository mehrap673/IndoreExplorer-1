import { storage } from './storage';

const samplePlaces = [
  {
    name: 'Rajwada Palace',
    description: 'A seven-story palace of the Holkar dynasty, showcasing magnificent Maratha architecture and Indo-Saracenic style. Built in the 18th century, it stands as a symbol of Indore\'s royal heritage.',
    category: 'historical' as const,
    imageUrl: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Central Indore',
    featured: true,
    rating: 4.5,
    visitingHours: '9:00 AM - 6:00 PM',
    entryFee: '₹25',
    isActive: true
  },
  {
    name: 'Lal Bagh Palace',
    description: 'An opulent palace built by the Holkar rulers, featuring European architecture and luxurious interiors. The palace showcases a blend of European and Indian architectural styles.',
    category: 'historical' as const,
    imageUrl: 'https://images.unsplash.com/photo-1534050359320-02900022671e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Lal Bagh',
    featured: true,
    rating: 4.7,
    visitingHours: '10:00 AM - 5:00 PM',
    entryFee: '₹50',
    isActive: true
  },
  {
    name: 'Kanch Mandir',
    description: 'A magnificent Jain temple made entirely of glass and mirrors, creating a dazzling spiritual experience. The intricate glasswork and mirror designs are truly breathtaking.',
    category: 'religious' as const,
    imageUrl: 'https://images.unsplash.com/photo-1532777946373-b6783242f211?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Itwaria Bazaar',
    featured: false,
    rating: 4.3,
    visitingHours: '6:00 AM - 8:00 PM',
    entryFee: 'Free',
    isActive: true
  },
  {
    name: 'Khajrana Ganesh Temple',
    description: 'One of the most revered temples in Indore, famous for its wish-fulfilling Ganesh deity. The temple attracts thousands of devotees daily and is known for its spiritual significance.',
    category: 'religious' as const,
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Khajrana',
    featured: true,
    rating: 4.8,
    visitingHours: '5:00 AM - 10:00 PM',
    entryFee: 'Free',
    isActive: true
  },
  {
    name: 'Patalpani Waterfall',
    description: 'A scenic waterfall near Indore, perfect for trekking and experiencing nature\'s beauty during monsoons. The waterfall cascades from a height of 300 feet creating a mesmerizing view.',
    category: 'nature' as const,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: '35km from Indore',
    featured: false,
    rating: 4.4,
    visitingHours: '6:00 AM - 6:00 PM',
    entryFee: '₹20',
    isActive: true
  },
  {
    name: 'Central Museum',
    description: 'Houses rare artifacts, sculptures, and archaeological findings showcasing the region\'s rich history. The museum contains prehistoric tools, coins, and stone sculptures.',
    category: 'historical' as const,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0d8e23ca4ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'A.B. Road',
    featured: false,
    rating: 4.1,
    visitingHours: '10:00 AM - 5:00 PM',
    entryFee: '₹10',
    isActive: true
  },
  {
    name: 'Sarafa Bazaar',
    description: 'The famous night food market where jewelry shops transform into street food paradise after dark. Experience the vibrant food culture and local delicacies.',
    category: 'modern' as const,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    location: 'Sarafa Bazaar',
    featured: true,
    rating: 4.6,
    visitingHours: '7:00 PM - 2:00 AM',
    entryFee: 'Free',
    isActive: true
  }
];

const sampleFood = [
  {
    name: 'Poha Jalebi',
    description: 'Indore\'s iconic breakfast combination - fluffed rice with crispy, sweet jalebis. A perfect blend of savory and sweet that defines Indore\'s morning culture.',
    category: 'breakfast' as const,
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹30-50',
    rating: 5,
    featured: true,
    ingredients: ['Rice flakes', 'Onions', 'Green chilies', 'Turmeric', 'Mustard seeds', 'Curry leaves'],
    restaurants: ['Vijay Chaat House', 'Sharma Poha Center', 'Indore Breakfast Corner'],
    isVegetarian: true,
    isActive: true
  },
  {
    name: 'Indori Samosa',
    description: 'Perfectly spiced and crispy samosas served with tangy tamarind and mint chutneys. The filling is a delightful mix of potatoes, peas, and aromatic spices.',
    category: 'snacks' as const,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹15-25',
    rating: 4.5,
    featured: false,
    ingredients: ['Potatoes', 'Green peas', 'Ginger-garlic', 'Garam masala', 'Coriander', 'Wheat flour'],
    restaurants: ['Samosa King', 'Chatori Gali', 'Street Food Junction'],
    isVegetarian: true,
    isActive: true
  },
  {
    name: 'Garadu',
    description: 'Deep-fried yam pieces tossed in spices - a unique and beloved Indore street food specialty. Crispy outside, soft inside, with a perfect spice coating.',
    category: 'snacks' as const,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹25-40',
    rating: 4.3,
    featured: true,
    ingredients: ['Yam (Arbi)', 'Red chili powder', 'Chaat masala', 'Black salt', 'Lemon juice'],
    restaurants: ['Johny Hot Dog', 'Chatori Gali', 'Sarafa Bazaar vendors'],
    isVegetarian: true,
    isActive: true
  },
  {
    name: 'Dal Bafla',
    description: 'A hearty meal of steamed and baked wheat dumplings served with rich dal and ghee. This traditional dish represents the authentic flavors of Madhya Pradesh.',
    category: 'dinner' as const,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    priceRange: '₹120-180',
    rating: 4.7,
    featured: true,
    ingredients: ['Wheat flour', 'Dal (lentils)', 'Ghee', 'Onions', 'Tomatoes', 'Turmeric', 'Cumin'],
    restaurants: ['Nafees Restaurant', 'Madhya Pradesh Bhawan', 'Traditional Kitchen'],
    isVegetarian: true,
    isActive: true
  }
];

const sampleEvents = [
  {
    name: 'Rangpanchami Festival',
    description: 'A vibrant celebration of colors marking the end of Holi festivities, unique to Indore with traditional dances and community gatherings.',
    date: new Date('2024-03-18'),
    category: 'festival' as const,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    location: 'City Center, Rajwada Palace',
    price: 'Free',
    organizer: 'Indore Municipal Corporation',
    featured: true,
    isActive: true
  },
  {
    name: 'Ahilya Utsav',
    description: 'Annual cultural festival celebrating Rani Ahilya Bai Holkar with classical music, dance performances, and art exhibitions.',
    date: new Date('2024-12-02'),
    endDate: new Date('2024-12-08'),
    category: 'cultural' as const,
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    location: 'Lal Bagh Palace Grounds',
    price: '₹100-500',
    organizer: 'Madhya Pradesh Tourism',
    featured: true,
    isActive: true
  },
  {
    name: 'Ganesh Chaturthi',
    description: 'Grand celebration with elaborate processions, beautifully decorated pandals, and the famous Khajrana Ganesh temple festivities.',
    date: new Date('2024-08-30'),
    category: 'religious' as const,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    location: 'Khajrana Ganesh Temple',
    price: 'Free',
    organizer: 'Khajrana Ganesh Temple Committee',
    featured: false,
    isActive: true
  }
];

const sampleGallery = [
  {
    title: 'Rajwada Palace at Night',
    description: 'The magnificent Rajwada Palace illuminated against the night sky, showcasing its architectural grandeur.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    category: 'places' as const,
    featured: true,
    tags: ['palace', 'night', 'architecture', 'historical'],
    photographer: 'Rajesh Kumar',
    location: 'Rajwada Palace',
    isActive: true
  },
  {
    title: 'Street Food Delights',
    description: 'The vibrant street food scene of Indore capturing the essence of local culinary culture.',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    category: 'food' as const,
    featured: true,
    tags: ['street food', 'culture', 'local', 'evening'],
    photographer: 'Priya Sharma',
    location: 'Sarafa Bazaar',
    isActive: true
  },
  {
    title: 'Cultural Festival Dance',
    description: 'Traditional dancers performing during a cultural festival, representing the rich heritage of Indore.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=350',
    category: 'events' as const,
    featured: false,
    tags: ['dance', 'festival', 'culture', 'traditional'],
    photographer: 'Amit Verma',
    location: 'Lal Bagh Palace',
    isActive: true
  }
];

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Check if data already exists
    const existingPlaces = await storage.getAllPlaces();
    if (existingPlaces.length > 0) {
      console.log('Database already has data. Skipping seeding.');
      return;
    }

    // Seed Places
    console.log('Seeding places...');
    for (const place of samplePlaces) {
      await storage.createPlace(place);
    }

    // Seed Food
    console.log('Seeding food items...');
    for (const food of sampleFood) {
      await storage.createFood(food);
    }

    // Seed Events
    console.log('Seeding events...');
    for (const event of sampleEvents) {
      await storage.createEvent(event);
    }

    // Seed Gallery
    console.log('Seeding gallery...');
    for (const gallery of sampleGallery) {
      await storage.createGalleryItem(gallery);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}