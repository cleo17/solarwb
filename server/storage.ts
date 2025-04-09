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
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, and, desc } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

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
  
  // Initialize the database schema and seed data
  initializeDatabase(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: 'sessions',
      createTableIfMissing: true
    });
    
    // Initialize database schema and seed initial data if needed
    this.initializeDatabase();
  }
  
  async initializeDatabase(): Promise<void> {
    try {
      // Check if users table is empty
      const userCount = await db.select({ count: users.id }).from(users);
      
      if (userCount.length === 0 || userCount[0].count === 0) {
        // Add default admin user
        await this.createUser({
          username: "admin",
          password: "$2b$10$YQIiU/lMw59BirWSCjfQHOC/tbsMu96vP536DZPiw8o5hcPdjng/W", // password: admin123
          email: "admin@limpiastech.com",
          fullName: "Admin User",
          role: "super_admin"
        });
        
        // Seed products
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
        
        for (const product of sampleProducts) {
          await this.createProduct(product);
        }
        
        // Seed blog posts
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
        
        for (const post of sampleBlogPosts) {
          await this.createBlogPost(post);
        }
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    // Set updatedAt to current date
    productData.updatedAt = new Date();
    
    const [updatedProduct] = await db.update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    
    return updatedProduct || undefined;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Blog operations
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }
  
  async getApprovedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.isApproved, true))
      .orderBy(desc(blogPosts.createdAt));
  }
  
  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [newBlogPost] = await db.insert(blogPosts).values(blogPost).returning();
    return newBlogPost;
  }
  
  async updateBlogPost(id: number, blogPostData: Partial<BlogPost>): Promise<BlogPost | undefined> {
    // Set updatedAt to current date
    blogPostData.updatedAt = new Date();
    
    const [updatedBlogPost] = await db.update(blogPosts)
      .set(blogPostData)
      .where(eq(blogPosts.id, id))
      .returning();
    
    return updatedBlogPost || undefined;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }
  
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  
  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders)
      .set(orderData)
      .where(eq(orders.id, id))
      .returning();
    
    return updatedOrder || undefined;
  }

  // OrderItem operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Contact operations
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db.insert(contactSubmissions)
      .values({ ...submission, isResolved: false })
      .returning();
    
    return newSubmission;
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
  
  async updateContactSubmission(id: number, submission: Partial<ContactSubmission>): Promise<ContactSubmission | undefined> {
    const [updatedSubmission] = await db.update(contactSubmissions)
      .set(submission)
      .where(eq(contactSubmissions.id, id))
      .returning();
    
    return updatedSubmission || undefined;
  }

  // Newsletter operations
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if email already exists
    const [existingSubscription] = await db.select().from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, subscription.email));
    
    if (existingSubscription) return existingSubscription;
    
    const [newSubscription] = await db.insert(newsletterSubscriptions)
      .values(subscription)
      .returning();
    
    return newSubscription;
  }
  
  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await db.select().from(newsletterSubscriptions);
  }
}

export const storage = new DatabaseStorage();
