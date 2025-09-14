import { 
  AdminUser, Place, Food, Event, Gallery, About, ContactMessage, Settings,
  type IAdminUser, type IPlace, type IFood, type IEvent, 
  type IGallery, type IAbout, type IContactMessage, type ISettings
} from "@shared/mongodb-schemas";
import { connectToMongoDB } from "./database";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Admin User methods
  getAdminUser(id: string): Promise<IAdminUser | null>;
  getAdminUserByUsername(username: string): Promise<IAdminUser | null>;
  getAdminUserByEmail(email: string): Promise<IAdminUser | null>;
  createAdminUser(userData: Partial<IAdminUser>): Promise<IAdminUser>;
  getAllAdminUsers(): Promise<IAdminUser[]>;
  
  // Places methods
  getAllPlaces(isActive?: boolean): Promise<IPlace[]>;
  getPlace(id: string): Promise<IPlace | null>;
  createPlace(placeData: Partial<IPlace>): Promise<IPlace>;
  updatePlace(id: string, placeData: Partial<IPlace>): Promise<IPlace | null>;
  deletePlace(id: string): Promise<boolean>;
  
  // Food methods
  getAllFood(isActive?: boolean): Promise<IFood[]>;
  getFood(id: string): Promise<IFood | null>;
  createFood(foodData: Partial<IFood>): Promise<IFood>;
  updateFood(id: string, foodData: Partial<IFood>): Promise<IFood | null>;
  deleteFood(id: string): Promise<boolean>;
  
  // Events methods
  getAllEvents(isActive?: boolean): Promise<IEvent[]>;
  getEvent(id: string): Promise<IEvent | null>;
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  updateEvent(id: string, eventData: Partial<IEvent>): Promise<IEvent | null>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Gallery methods
  getAllGallery(isActive?: boolean): Promise<IGallery[]>;
  getGalleryItem(id: string): Promise<IGallery | null>;
  createGalleryItem(galleryData: Partial<IGallery>): Promise<IGallery>;
  updateGalleryItem(id: string, galleryData: Partial<IGallery>): Promise<IGallery | null>;
  deleteGalleryItem(id: string): Promise<boolean>;
  
  // About methods
  getAllAbout(isActive?: boolean): Promise<IAbout[]>;
  getAbout(id: string): Promise<IAbout | null>;
  createAbout(aboutData: Partial<IAbout>): Promise<IAbout>;
  updateAbout(id: string, aboutData: Partial<IAbout>): Promise<IAbout | null>;
  deleteAbout(id: string): Promise<boolean>;
  
  // Contact Messages methods
  getAllContactMessages(): Promise<IContactMessage[]>;
  getContactMessage(id: string): Promise<IContactMessage | null>;
  createContactMessage(messageData: Partial<IContactMessage>): Promise<IContactMessage>;
  markMessageAsRead(id: string): Promise<boolean>;
  replyToMessage(id: string, reply: string): Promise<boolean>;
  
  // Settings methods
  getAllSettings(): Promise<ISettings[]>;
  getSetting(key: string): Promise<ISettings | null>;
  createSetting(settingData: Partial<ISettings>): Promise<ISettings>;
  updateSetting(key: string, value: string): Promise<ISettings | null>;
  deleteSetting(key: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  private isConnected = false;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      await connectToMongoDB();
      this.isConnected = true;
      console.log('MongoStorage: Successfully connected to MongoDB');
    } catch (error) {
      console.error('MongoStorage: Failed to connect to MongoDB:', error);
      this.isConnected = false;
    }
  }

  private async ensureConnection() {
    if (!this.isConnected) {
      throw new Error('MongoDB connection not available. Please check your connection string.');
    }
  }

  // Admin User methods
  async getAdminUser(id: string): Promise<IAdminUser | null> {
    return await AdminUser.findById(id);
  }

  async getAdminUserByUsername(username: string): Promise<IAdminUser | null> {
    return await AdminUser.findOne({ username });
  }

  async getAdminUserByEmail(email: string): Promise<IAdminUser | null> {
    return await AdminUser.findOne({ email });
  }

  async createAdminUser(userData: Partial<IAdminUser>): Promise<IAdminUser> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = new AdminUser(userData);
    return await user.save();
  }

  async getAllAdminUsers(): Promise<IAdminUser[]> {
    return await AdminUser.find().select('-password');
  }

  // Places methods
  async getAllPlaces(isActive?: boolean): Promise<IPlace[]> {
    const filter = isActive !== undefined ? { isActive } : {};
    return await Place.find(filter).sort({ createdAt: -1 });
  }

  async getPlace(id: string): Promise<IPlace | null> {
    return await Place.findById(id);
  }

  async createPlace(placeData: Partial<IPlace>): Promise<IPlace> {
    const place = new Place(placeData);
    return await place.save();
  }

  async updatePlace(id: string, placeData: Partial<IPlace>): Promise<IPlace | null> {
    return await Place.findByIdAndUpdate(id, placeData, { new: true });
  }

  async deletePlace(id: string): Promise<boolean> {
    const result = await Place.findByIdAndDelete(id);
    return !!result;
  }

  // Food methods
  async getAllFood(isActive?: boolean): Promise<IFood[]> {
    const filter = isActive !== undefined ? { isActive } : {};
    return await Food.find(filter).sort({ createdAt: -1 });
  }

  async getFood(id: string): Promise<IFood | null> {
    return await Food.findById(id);
  }

  async createFood(foodData: Partial<IFood>): Promise<IFood> {
    const food = new Food(foodData);
    return await food.save();
  }

  async updateFood(id: string, foodData: Partial<IFood>): Promise<IFood | null> {
    return await Food.findByIdAndUpdate(id, foodData, { new: true });
  }

  async deleteFood(id: string): Promise<boolean> {
    const result = await Food.findByIdAndDelete(id);
    return !!result;
  }

  // Events methods
  async getAllEvents(isActive?: boolean): Promise<IEvent[]> {
    const filter = isActive !== undefined ? { isActive } : {};
    return await Event.find(filter).sort({ date: -1 });
  }

  async getEvent(id: string): Promise<IEvent | null> {
    return await Event.findById(id);
  }

  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    const event = new Event(eventData);
    return await event.save();
  }

  async updateEvent(id: string, eventData: Partial<IEvent>): Promise<IEvent | null> {
    return await Event.findByIdAndUpdate(id, eventData, { new: true });
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await Event.findByIdAndDelete(id);
    return !!result;
  }

  // Gallery methods
  async getAllGallery(isActive?: boolean): Promise<IGallery[]> {
    const filter = isActive !== undefined ? { isActive } : {};
    return await Gallery.find(filter).sort({ createdAt: -1 });
  }

  async getGalleryItem(id: string): Promise<IGallery | null> {
    return await Gallery.findById(id);
  }

  async createGalleryItem(galleryData: Partial<IGallery>): Promise<IGallery> {
    const galleryItem = new Gallery(galleryData);
    return await galleryItem.save();
  }

  async updateGalleryItem(id: string, galleryData: Partial<IGallery>): Promise<IGallery | null> {
    return await Gallery.findByIdAndUpdate(id, galleryData, { new: true });
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const result = await Gallery.findByIdAndDelete(id);
    return !!result;
  }

  // About methods
  async getAllAbout(isActive?: boolean): Promise<IAbout[]> {
    const filter = isActive !== undefined ? { isActive } : {};
    return await About.find(filter).sort({ order: 1 });
  }

  async getAbout(id: string): Promise<IAbout | null> {
    return await About.findById(id);
  }

  async createAbout(aboutData: Partial<IAbout>): Promise<IAbout> {
    const about = new About(aboutData);
    return await about.save();
  }

  async updateAbout(id: string, aboutData: Partial<IAbout>): Promise<IAbout | null> {
    return await About.findByIdAndUpdate(id, aboutData, { new: true });
  }

  async deleteAbout(id: string): Promise<boolean> {
    const result = await About.findByIdAndDelete(id);
    return !!result;
  }

  // Contact Messages methods
  async getAllContactMessages(): Promise<IContactMessage[]> {
    return await ContactMessage.find().sort({ createdAt: -1 });
  }

  async getContactMessage(id: string): Promise<IContactMessage | null> {
    return await ContactMessage.findById(id);
  }

  async createContactMessage(messageData: Partial<IContactMessage>): Promise<IContactMessage> {
    const message = new ContactMessage(messageData);
    return await message.save();
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await ContactMessage.findByIdAndUpdate(id, { isRead: true });
    return !!result;
  }

  async replyToMessage(id: string, reply: string): Promise<boolean> {
    const result = await ContactMessage.findByIdAndUpdate(id, { 
      reply, 
      replyDate: new Date(), 
      isReplied: true 
    });
    return !!result;
  }

  // Settings methods
  async getAllSettings(): Promise<ISettings[]> {
    return await Settings.find({ isActive: true }).sort({ key: 1 });
  }

  async getSetting(key: string): Promise<ISettings | null> {
    return await Settings.findOne({ key, isActive: true });
  }

  async createSetting(settingData: Partial<ISettings>): Promise<ISettings> {
    const setting = new Settings(settingData);
    return await setting.save();
  }

  async updateSetting(key: string, value: string): Promise<ISettings | null> {
    return await Settings.findOneAndUpdate({ key }, { value }, { new: true });
  }

  async deleteSetting(key: string): Promise<boolean> {
    const result = await Settings.findOneAndUpdate({ key }, { isActive: false });
    return !!result;
  }
}

export const storage = new MongoStorage();
