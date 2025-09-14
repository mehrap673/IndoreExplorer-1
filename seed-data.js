import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

const samplePlaces = [
  {
    name: "Rajwada Palace",
    description: "A magnificent seven-story palace showcasing Indo-Saracenic architecture, built by the Holkar dynasty. This historic fort stands as the crown jewel of Indore's heritage.",
    location: "Rajwada, Central Indore",
    category: "Historical",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
    tags: ["heritage", "architecture", "historical", "palace", "holkar"],
    openingHours: "9:00 AM - 6:00 PM",
    entryFee: "₹10 for Indians, ₹100 for foreigners",
    featured: true,
    isActive: true
  },
  {
    name: "Lal Bagh Palace",
    description: "An opulent palace showcasing European architecture with beautiful gardens, built by Maharaja Shivaji Rao Holkar. Famous for its lavish interiors and historical artifacts.",
    location: "Lal Bagh Palace Road",
    category: "Historical",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df0?w=800&h=600&fit=crop",
    tags: ["palace", "heritage", "architecture", "gardens", "holkar"],
    openingHours: "10:00 AM - 5:00 PM",
    entryFee: "₹20 for Indians, ₹200 for foreigners",
    featured: true,
    isActive: true
  },
  {
    name: "Kanch Mandir",
    description: "A stunning Jain temple entirely decorated with glass and mirrors, creating a mesmerizing play of light and reflection. A masterpiece of artistic craftsmanship.",
    location: "Itwaria Market",
    category: "Religious",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1582655493336-1c6c893c7df1?w=800&h=600&fit=crop",
    tags: ["jain temple", "glass work", "religious", "art", "architecture"],
    openingHours: "6:00 AM - 8:00 PM",
    entryFee: "Free",
    featured: true,
    isActive: true
  },
  {
    name: "Central Museum Indore",
    description: "A treasure trove of artifacts showcasing the rich cultural heritage of Malwa region, including ancient sculptures, coins, and manuscripts.",
    location: "A.B. Road",
    category: "Museums",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1615906656784-8c6f0f565bd7?w=800&h=600&fit=crop",
    tags: ["museum", "history", "culture", "artifacts", "education"],
    openingHours: "10:00 AM - 5:00 PM (Closed Mondays)",
    entryFee: "₹5 for Indians, ₹50 for foreigners",
    featured: false,
    isActive: true
  },
  {
    name: "Indore White Church",
    description: "A beautiful Gothic architecture church built during the British era, known for its serene atmosphere and stunning stained glass windows.",
    location: "MG Road",
    category: "Religious",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c73a?w=800&h=600&fit=crop",
    tags: ["church", "british era", "gothic", "architecture", "christian"],
    openingHours: "6:00 AM - 8:00 PM",
    entryFee: "Free",
    featured: false,
    isActive: true
  },
  {
    name: "Ralamandal Wildlife Sanctuary",
    description: "A beautiful wildlife sanctuary offering nature trails, birdwatching, and peaceful environment just outside the city. Home to various species of birds and animals.",
    location: "Ralamandal, Indore",
    category: "Nature",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    tags: ["wildlife", "nature", "sanctuary", "birds", "trekking"],
    openingHours: "6:00 AM - 6:00 PM",
    entryFee: "₹20 per person",
    featured: false,
    isActive: true
  }
];

const sampleFood = [
  {
    name: "Poha Jalebi",
    description: "Indore's most iconic breakfast combo - fluffy poha served with crispy, sweet jalebis. A perfect balance of savory and sweet flavors that defines Indore's food culture.",
    category: "Street Food",
    price: "₹40-60",
    isVegetarian: true,
    spiceLevel: "Mild",
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea8dcadb4db?w=800&h=600&fit=crop",
    tags: ["breakfast", "street food", "iconic", "sweet", "traditional"],
    bestPlaces: ["Joshi Dada Ka Poha", "Vinod Chat House", "Johnny Hot Dog"],
    featured: true,
    isActive: true
  },
  {
    name: "Indori Namkeen",
    description: "Crispy, spicy mixed namkeen including bhujia, mixture, and various fried delicacies. Perfect snack with tea and a specialty of Indore.",
    category: "Snacks",
    price: "₹100-200 per kg",
    isVegetarian: true,
    spiceLevel: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    tags: ["namkeen", "snacks", "spicy", "tea time", "local specialty"],
    bestPlaces: ["Ratlami Namkeen", "Aggarwal Namkeen", "Prakash Namkeen"],
    featured: true,
    isActive: true
  },
  {
    name: "Bhutte Ka Kees",
    description: "Grated corn cooked with milk, spices, and garnished with coriander. A unique Indori delicacy that's both creamy and flavorful.",
    category: "Street Food",
    price: "₹50-80",
    isVegetarian: true,
    spiceLevel: "Mild",
    imageUrl: "https://images.unsplash.com/photo-1591381516154-cce2764b5cca?w=800&h=600&fit=crop",
    tags: ["corn", "street food", "local specialty", "creamy", "seasonal"],
    bestPlaces: ["Gurukripa Restaurant", "New York Food Point", "Chappan Dukan"],
    featured: true,
    isActive: true
  },
  {
    name: "Garadu",
    description: "Deep-fried sweet potato chunks served with tangy chutneys and spices. A popular winter street food that's crispy outside and soft inside.",
    category: "Street Food",
    price: "₹30-50",
    isVegetarian: true,
    spiceLevel: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1553978297-833d09932d68?w=800&h=600&fit=crop",
    tags: ["sweet potato", "fried", "winter special", "chutneys", "crispy"],
    bestPlaces: ["Chappan Dukan", "Sarafa Bazaar", "Street vendors"],
    featured: false,
    isActive: true
  },
  {
    name: "Dal Bafla",
    description: "Traditional Malwa region dish - wheat dough balls served with spicy dal, ghee, and chutney. A hearty and nutritious meal.",
    category: "Main Course",
    price: "₹120-180",
    isVegetarian: true,
    spiceLevel: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    tags: ["traditional", "main course", "dal", "wheat", "ghee"],
    bestPlaces: ["Chappan Bhog", "Sagar Ratna", "Local restaurants"],
    featured: false,
    isActive: true
  },
  {
    name: "Malpua Rabri",
    description: "Sweet pancakes served with thick, creamy rabri and nuts. A rich dessert that's perfect for festivals and special occasions.",
    category: "Desserts",
    price: "₹80-120",
    isVegetarian: true,
    spiceLevel: "None",
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
    tags: ["dessert", "sweet", "rabri", "festival food", "rich"],
    bestPlaces: ["Guru Kripa", "Joshi Dada", "Sweet shops"],
    featured: false,
    isActive: true
  }
];

const sampleEvents = [
  {
    title: "Indore Food Festival 2024",
    description: "A grand celebration of Indore's rich culinary heritage featuring local food vendors, cooking competitions, and food stalls from across the city. Experience the best of Indori cuisine in one place.",
    startDate: new Date("2024-12-15T10:00:00Z"),
    endDate: new Date("2024-12-17T22:00:00Z"),
    location: "Brilliant Convention Centre, Indore",
    category: "Food & Culture",
    organizer: "Indore Municipal Corporation",
    ticketPrice: "₹100-500",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    tags: ["food", "festival", "culture", "indore", "culinary"],
    maxAttendees: 5000,
    isPublic: true,
    featured: true,
    isActive: true
  },
  {
    title: "Malwa Heritage Walk",
    description: "Guided heritage walk covering Rajwada Palace, Kanch Mandir, and other historical sites. Learn about Indore's rich history and architectural marvels.",
    startDate: new Date("2024-11-25T07:00:00Z"),
    endDate: new Date("2024-11-25T11:00:00Z"),
    location: "Starting from Rajwada Palace",
    category: "Heritage & History",
    organizer: "Indore Heritage Society",
    ticketPrice: "₹200 per person",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop",
    tags: ["heritage", "history", "walk", "architecture", "guided tour"],
    maxAttendees: 50,
    isPublic: true,
    featured: true,
    isActive: true
  },
  {
    title: "Navratri Celebrations at Lal Bagh Palace",
    description: "Grand Navratri celebrations with traditional Garba and Dandiya nights in the beautiful setting of Lal Bagh Palace gardens. Cultural performances and food stalls.",
    startDate: new Date("2024-10-15T18:00:00Z"),
    endDate: new Date("2024-10-23T23:00:00Z"),
    location: "Lal Bagh Palace Gardens",
    category: "Festival & Culture",
    organizer: "Lal Bagh Palace Trust",
    ticketPrice: "₹300-1000",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    tags: ["navratri", "garba", "dandiya", "festival", "culture"],
    maxAttendees: 2000,
    isPublic: true,
    featured: false,
    isActive: true
  },
  {
    title: "Photography Workshop - Capturing Indore",
    description: "Learn photography techniques while exploring Indore's iconic locations. Workshop includes technical guidance and practical sessions at various heritage sites.",
    startDate: new Date("2024-12-08T09:00:00Z"),
    endDate: new Date("2024-12-08T17:00:00Z"),
    location: "Various locations in Indore",
    category: "Workshop & Learning",
    organizer: "Indore Photography Club",
    ticketPrice: "₹1500 per person",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
    tags: ["photography", "workshop", "learning", "heritage", "technique"],
    maxAttendees: 20,
    isPublic: true,
    featured: false,
    isActive: true
  },
  {
    title: "Indore Business Summit 2024",
    description: "Annual business summit bringing together entrepreneurs, investors, and business leaders to discuss opportunities and growth in central India.",
    startDate: new Date("2024-11-30T09:00:00Z"),
    endDate: new Date("2024-12-01T18:00:00Z"),
    location: "Marriott Hotel, Indore",
    category: "Business & Networking",
    organizer: "Indore Chamber of Commerce",
    ticketPrice: "₹2500-5000",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
    tags: ["business", "summit", "networking", "entrepreneurs", "investment"],
    maxAttendees: 500,
    isPublic: true,
    featured: false,
    isActive: true
  }
];

const sampleGallery = [
  {
    title: "Rajwada Palace Sunset",
    description: "Beautiful sunset view of the magnificent Rajwada Palace showcasing its seven-story architecture",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop",
    category: "architecture",
    photographer: "Rajesh Sharma",
    location: "Rajwada Palace",
    tags: ["rajwada", "palace", "sunset", "architecture", "heritage"],
    featured: true,
    isActive: true
  },
  {
    title: "Kanch Mandir Interior",
    description: "Stunning interior of the Glass Temple with intricate mirror work and artistic craftsmanship",
    imageUrl: "https://images.unsplash.com/photo-1582655493336-1c6c893c7df1?w=1200&h=800&fit=crop",
    category: "culture",
    photographer: "Priya Malhotra",
    location: "Kanch Mandir",
    tags: ["kanch mandir", "glass temple", "mirrors", "jain", "art"],
    featured: true,
    isActive: true
  },
  {
    title: "Poha Jalebi Combo",
    description: "Indore's iconic breakfast - steaming hot Poha served with crispy golden Jalebis",
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea8dcadb4db?w=1200&h=800&fit=crop",
    category: "food",
    photographer: "Amit Gupta",
    location: "Chappan Dukan",
    tags: ["poha", "jalebi", "breakfast", "street food", "indore special"],
    featured: true,
    isActive: true
  },
  {
    title: "Lal Bagh Palace Gardens",
    description: "Beautifully manicured gardens of Lal Bagh Palace with European architectural elements",
    imageUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df0?w=1200&h=800&fit=crop",
    category: "places",
    photographer: "Neha Joshi",
    location: "Lal Bagh Palace",
    tags: ["lal bagh", "palace", "gardens", "architecture", "holkar"],
    featured: false,
    isActive: true
  },
  {
    title: "Sarafa Night Market",
    description: "Bustling night food market with colorful lights and food stalls serving local delicacies",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
    category: "culture",
    photographer: "Vikram Singh",
    location: "Sarafa Bazaar",
    tags: ["sarafa", "night market", "street food", "lights", "culture"],
    featured: false,
    isActive: true
  },
  {
    title: "Central Museum Artifacts",
    description: "Ancient sculptures and artifacts displaying the rich heritage of Malwa region",
    imageUrl: "https://images.unsplash.com/photo-1615906656784-8c6f0f565bd7?w=1200&h=800&fit=crop",
    category: "culture",
    photographer: "Dr. Suresh Patel",
    location: "Central Museum",
    tags: ["museum", "artifacts", "history", "culture", "malwa"],
    featured: false,
    isActive: true
  }
];

const sampleSettings = [
  {
    key: "weather_api_key",
    value: "",
    category: "api",
    description: "OpenWeatherMap API key for weather data"
  },
  {
    key: "news_api_key", 
    value: "",
    category: "api",
    description: "NewsAPI key for latest news updates"
  },
  {
    key: "site_title",
    value: "All About Indore - Your Complete Tourism Guide",
    category: "site",
    description: "Main title for the website"
  },
  {
    key: "site_description",
    value: "Discover Indore's rich culture, heritage, cuisine and attractions. Your comprehensive guide to the heart of Madhya Pradesh.",
    category: "site",
    description: "Site meta description"
  },
  {
    key: "contact_email",
    value: "info@allaboutindore.com",
    category: "contact",
    description: "Primary contact email for inquiries"
  },
  {
    key: "contact_phone",
    value: "+91-731-XXXXXXX",
    category: "contact", 
    description: "Contact phone number"
  }
];

const sampleContacts = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    subject: "Tourism Package Inquiry",
    message: "Hi, I'm planning a 3-day trip to Indore with my family. Could you please provide information about popular tourist attractions and recommended food places? Also, do you have any package deals available?",
    isRead: false,
    isReplied: false,
    createdAt: new Date("2024-10-20T10:30:00Z")
  },
  {
    name: "Priya Sharma", 
    email: "priya.s@gmail.com",
    subject: "Heritage Walk Details",
    message: "I saw information about heritage walks on your website. Can you provide more details about the schedule, duration, and booking process? I'm particularly interested in the historical significance of Rajwada Palace.",
    isRead: true,
    isReplied: true,
    reply: "Thank you for your interest! Our heritage walks are conducted every weekend starting at 7 AM from Rajwada Palace. The duration is 4 hours covering major historical sites. Booking can be done online or by calling our office. I'll send you detailed itinerary via email.",
    replyDate: new Date("2024-10-18T14:20:00Z"),
    createdAt: new Date("2024-10-17T16:45:00Z")
  },
  {
    name: "Michael Johnson",
    email: "michael.j@international.com", 
    subject: "Photography Tour Information",
    message: "Hello, I'm a travel photographer visiting India next month. I'm interested in capturing Indore's architecture and street life. Do you offer photography tours or can recommend good locations and best times for photography?",
    isRead: true,
    isReplied: false,
    createdAt: new Date("2024-10-19T09:15:00Z")
  }
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB for seeding...');
    
    const db = client.db();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      db.collection('places').deleteMany({}),
      db.collection('food').deleteMany({}), 
      db.collection('events').deleteMany({}),
      db.collection('gallery').deleteMany({}),
      db.collection('settings').deleteMany({}),
      db.collection('contacts').deleteMany({})
    ]);
    
    // Insert sample data
    console.log('Inserting sample places...');
    await db.collection('places').insertMany(samplePlaces);
    
    console.log('Inserting sample food items...');
    await db.collection('food').insertMany(sampleFood);
    
    console.log('Inserting sample events...');
    await db.collection('events').insertMany(sampleEvents);
    
    console.log('Inserting sample gallery items...');
    await db.collection('gallery').insertMany(sampleGallery);
    
    console.log('Inserting sample settings...');
    await db.collection('settings').insertMany(sampleSettings);
    
    console.log('Inserting sample contact messages...');
    await db.collection('contacts').insertMany(sampleContacts);
    
    console.log('Database seeded successfully!');
    
    // Print summary
    const placesCount = await db.collection('places').countDocuments();
    const foodCount = await db.collection('food').countDocuments();
    const eventsCount = await db.collection('events').countDocuments();
    const galleryCount = await db.collection('gallery').countDocuments();
    const settingsCount = await db.collection('settings').countDocuments();
    const contactsCount = await db.collection('contacts').countDocuments();
    
    console.log('\n=== SEEDING SUMMARY ===');
    console.log(`Places: ${placesCount} items`);
    console.log(`Food: ${foodCount} items`);
    console.log(`Events: ${eventsCount} items`);
    console.log(`Gallery: ${galleryCount} items`);
    console.log(`Settings: ${settingsCount} items`);
    console.log(`Contacts: ${contactsCount} items`);
    console.log('======================\n');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();