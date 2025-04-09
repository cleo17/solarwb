import { users, products, blogPosts, orders, orderItems, contactSubmissions, newsletterSubscriptions } from "@shared/schema";
import type { 
  User, InsertUser, 
  Product, InsertProduct, 
  BlogPost, InsertBlogPost, 
  Order, InsertOrder, 
  OrderItem, InsertOrderItem,
  ContactSubmission, InsertContactSubmission,
  NewsletterSubscription, InsertNewsletterSubscription
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Blog operations
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getApprovedBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined>;
  
  // OrderItem operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Contact operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  updateContactSubmission(id: number, submission: Partial<ContactSubmission>): Promise<ContactSubmission | undefined>;
  
  // Newsletter operations
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private blogPosts: Map<number, BlogPost>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  sessionStore: session.SessionStore;
  
  private userCurrentId: number;
  private productCurrentId: number;
  private blogPostCurrentId: number;
  private orderCurrentId: number;
  private orderItemCurrentId: number;
  private contactSubmissionCurrentId: number;
  private newsletterSubscriptionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.blogPosts = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();
    
    this.userCurrentId = 1;
    this.productCurrentId = 1;
    this.blogPostCurrentId = 1;
    this.orderCurrentId = 1;
    this.orderItemCurrentId = 1;
    this.contactSubmissionCurrentId = 1;
    this.newsletterSubscriptionCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add a default super admin
    this.createUser({
      username: "admin",
      password: "$2b$10$wZcXSTiRZmjN2jCWOUyxZuEhkYZM.Mjm2pGQTTAq.kmRZ1BK2rF/C", // password: admin123
      email: "admin@limpiastech.com",
      fullName: "Admin User",
      role: "super_admin"
    });
    
    // Seed some initial products
    this.seedProducts();
  }
  
  private seedProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Solar Panel 400W",
        description: "High-efficiency monocrystalline solar panel with 25-year performance warranty.",
        price: 349.99,
        category: "Solar Panels",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        specifications: {
          power: "400W",
          efficiency: "21.5%",
          cells: "144 half-cut monocrystalline cells",
          dimensions: "2000 x 1000 x 35 mm"
        },
        stock: 50,
        featured: true
      },
      {
        name: "SmartInvert Pro 5kW",
        description: "Hybrid solar inverter with battery backup capability and smart monitoring.",
        price: 1299.99,
        category: "Inverters",
        imageUrl: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        specifications: {
          power: "5kW",
          efficiency: "98%",
          mppt: "2 MPPT trackers",
          warranty: "10 years"
        },
        stock: 25,
        featured: true
      },
      {
        name: "EcoHeat Solar 200L",
        description: "Evacuated tube solar water heater with 200-liter capacity for residential use.",
        price: 899.99,
        category: "Water Heaters",
        imageUrl: "https://images.unsplash.com/photo-1621267860478-dbad5e247732?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        specifications: {
          capacity: "200L",
          tubes: "20 evacuated tubes",
          tank: "Stainless steel, insulated",
          mountType: "Roof or ground mounted"
        },
        stock: 15,
        featured: true
      },
      {
        name: "SolarPump 3HP",
        description: "3HP submersible solar water pump for agriculture and domestic applications.",
        price: 749.99,
        category: "Water Pumps",
        imageUrl: "https://images.unsplash.com/photo-1592833167578-28dedde37909?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        specifications: {
          power: "3HP",
          maxHead: "80m",
          flow: "10,000L/hour",
          material: "Stainless steel"
        },
        stock: 20,
        featured: true
      }
    ];
    
    sampleProducts.forEach(product => this.createProduct(product));
    
    // Seed some blog posts
    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: "The Benefits of Solar Energy for Residential Properties",
        content: "Discover how installing solar panels can significantly reduce your electricity bills and increase your property value while contributing to a greener planet.",
        imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        authorId: 1,
        isApproved: true
      },
      {
        title: "How Solar Water Pumps Revolutionize Agriculture",
        content: "Solar water pumps are changing the face of agriculture by providing reliable irrigation solutions that are both cost-effective and environmentally friendly.",
        imageUrl: "https://images.unsplash.com/photo-1559302995-f8d7c620f2d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        authorId: 1,
        isApproved: true
      },
      {
        title: "Choosing the Right Solar Inverter for Your Home",
        content: "Learn about the different types of solar inverters available and how to select the most suitable one for your specific energy needs and budget.",
        imageUrl: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        authorId: 1,
        isApproved: true
      }
    ];
    
    sampleBlogPosts.forEach(post => this.createBlogPost(post));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const newUser: User = { ...user, id, createdAt };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.featured
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const newProduct: Product = { ...product, id, createdAt, updatedAt };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined> {
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) return undefined;
    
    const updatedAt = new Date();
    const updatedProduct = { ...existingProduct, ...product, updatedAt };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Blog operations
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async getApprovedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(
      post => post.isApproved
    );
  }
  
  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const newBlogPost: BlogPost = { ...blogPost, id, createdAt, updatedAt };
    this.blogPosts.set(id, newBlogPost);
    return newBlogPost;
  }
  
  async updateBlogPost(id: number, blogPost: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const existingBlogPost = await this.getBlogPost(id);
    if (!existingBlogPost) return undefined;
    
    const updatedAt = new Date();
    const updatedBlogPost = { ...existingBlogPost, ...blogPost, updatedAt };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const createdAt = new Date();
    const newOrder: Order = { ...order, id, createdAt };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined> {
    const existingOrder = await this.getOrder(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder = { ...existingOrder, ...order };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // OrderItem operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCurrentId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Contact operations
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.contactSubmissionCurrentId++;
    const createdAt = new Date();
    const isResolved = false;
    const newSubmission: ContactSubmission = { ...submission, id, createdAt, isResolved };
    this.contactSubmissions.set(id, newSubmission);
    return newSubmission;
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
  
  async updateContactSubmission(id: number, submission: Partial<ContactSubmission>): Promise<ContactSubmission | undefined> {
    const existingSubmission = this.contactSubmissions.get(id);
    if (!existingSubmission) return undefined;
    
    const updatedSubmission = { ...existingSubmission, ...submission };
    this.contactSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  // Newsletter operations
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if email already exists
    const existingSubscription = Array.from(this.newsletterSubscriptions.values()).find(
      sub => sub.email === subscription.email
    );
    
    if (existingSubscription) return existingSubscription;
    
    const id = this.newsletterSubscriptionCurrentId++;
    const createdAt = new Date();
    const newSubscription: NewsletterSubscription = { ...subscription, id, createdAt };
    this.newsletterSubscriptions.set(id, newSubscription);
    return newSubscription;
  }
  
  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values());
  }
}

export const storage = new MemStorage();
