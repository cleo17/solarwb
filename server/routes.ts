import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertProductSchema, 
  insertBlogPostSchema,
  insertOrderSchema, 
  insertOrderItemSchema,
  insertContactSubmissionSchema,
  insertNewsletterSubscriptionSchema
} from "@shared/schema";
import { upload, processImage, getUploadedFileUrl } from "./uploads";
import path from "path";
import fs from "fs";
import settingsPath from 'path';

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user has required role
const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Settings endpoints
  const SETTINGS_FILE = settingsPath.join(process.cwd(), 'server', 'settings.json');
  const defaultSettings = {
    siteName: 'Limpias Technologies',
    siteDescription: 'Your trusted partner in solar technology solutions',
    contactEmail: 'contact@limpiastech.com',
    contactPhone: '+1234567890',
    maintenanceMode: false,
    enableBlog: true,
    enableShop: true,
  };

  // GET /api/settings
  app.get('/api/settings', isAuthenticated, hasRole(['super_admin']), async (req, res) => {
    try {
      let settings = defaultSettings;
      if (fs.existsSync(SETTINGS_FILE)) {
        const file = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        settings = JSON.parse(file);
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Error loading settings' });
    }
  });

  // PUT /api/settings
  app.put('/api/settings', isAuthenticated, hasRole(['super_admin']), async (req, res) => {
    try {
      const {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
        maintenanceMode,
        enableBlog,
        enableShop,
      } = req.body;
      // Basic validation
      if (!siteName || !contactEmail) {
        return res.status(400).json({ message: 'Site name and contact email are required.' });
      }
      const newSettings = {
        siteName,
        siteDescription: siteDescription || '',
        contactEmail,
        contactPhone: contactPhone || '',
        maintenanceMode: !!maintenanceMode,
        enableBlog: !!enableBlog,
        enableShop: !!enableShop,
      };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), 'utf-8');
      res.json(newSettings);
    } catch (error) {
      res.status(500).json({ message: 'Error saving settings' });
    }
  });
  
  // Public GET /api/public-settings (no auth)
  app.get('/api/public-settings', async (req, res) => {
    try {
      let settings = defaultSettings;
      if (fs.existsSync(SETTINGS_FILE)) {
        const file = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        settings = JSON.parse(file);
      }
      // Only return public fields
      const { siteName, siteDescription, contactEmail, contactPhone } = settings;
      res.json({ siteName, siteDescription, contactEmail, contactPhone });
    } catch (error) {
      res.status(500).json({ message: 'Error loading public settings' });
    }
  });
  
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      let products;
      const { category, featured } = req.query;
      
      if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });
  
  app.post("/api/products", isAuthenticated, hasRole(["super_admin", "sales_manager"]), async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });
  
  app.put("/api/products/:id", isAuthenticated, hasRole(["super_admin", "sales_manager"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });
  
  app.delete("/api/products/:id", isAuthenticated, hasRole(["super_admin", "sales_manager"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });
  
  // Blog routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = req.isAuthenticated() && ["super_admin", "blog_editor"].includes(req.user?.role || '')
        ? await storage.getAllBlogPosts()
        : await storage.getApprovedBlogPosts();
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Only return unapproved posts to authenticated users with appropriate roles
      if (!post.isApproved && (!req.isAuthenticated() || !["super_admin", "blog_editor"].includes(req.user?.role || ''))) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });
  
  app.post("/api/blog-posts", isAuthenticated, hasRole(["super_admin", "blog_editor"]), async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      
      // If user is blog_editor, post requires approval
      if (req.user?.role === "blog_editor") {
        blogData.isApproved = false;
      }
      
      // Set author ID to current user
      blogData.authorId = req.user?.id || 1;
      
      const post = await storage.createBlogPost(blogData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating blog post" });
    }
  });
  
  app.put("/api/blog-posts/:id", isAuthenticated, hasRole(["super_admin", "blog_editor"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Blog editors can only edit their own posts
      if (req.user?.role === "blog_editor" && post.authorId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Blog editors cannot approve posts
      let blogData = insertBlogPostSchema.partial().parse(req.body);
      if (req.user?.role === "blog_editor") {
        delete blogData.isApproved;
      }
      
      const updatedPost = await storage.updateBlogPost(id, blogData);
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating blog post" });
    }
  });
  
  app.delete("/api/blog-posts/:id", isAuthenticated, hasRole(["super_admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting blog post" });
    }
  });
  
  // Order routes
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      let orders;
      
      // Regular users can only see their own orders
      if (["customer", ""].includes(req.user?.role || '')) {
        orders = await storage.getUserOrders(req.user?.id || 0);
      } else {
        orders = await storage.getAllOrders();
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Regular users can only see their own orders
      if (["customer", ""].includes(req.user?.role || '') && order.userId !== req.user?.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const orderItems = await storage.getOrderItems(id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });
  
  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Set user ID to current user
      orderData.userId = req.user?.id || 0;
      
      const order = await storage.createOrder(orderData);
      
      // Create order items
      const { items } = req.body;
      if (Array.isArray(items)) {
        for (const item of items) {
          const orderItemData = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          await storage.createOrderItem(orderItemData);
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order" });
    }
  });
  
  app.put("/api/orders/:id", isAuthenticated, hasRole(["super_admin", "sales_manager", "accountant"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const orderData = insertOrderSchema.partial().parse(req.body);
      
      // Accountants can only update payment status
      if (req.user?.role === "accountant") {
        const { paymentStatus } = orderData;
        if (!paymentStatus) {
          return res.status(400).json({ message: "No payment status provided" });
        }
        // Create a new object instead of reassigning
        const newOrderData = { paymentStatus };
        return storage.updateOrder(id, newOrderData)
          .then(order => {
            if (!order) {
              return res.status(404).json({ message: "Order not found" });
            }
            res.json(order);
          });
      }
      
      const order = await storage.updateOrder(id, orderData);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating order" });
    }
  });
  
  // Contact form submissions
  app.post("/api/contact", async (req, res) => {
    try {
      const submissionData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact form data", errors: error.errors });
      }
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });
  
  app.get("/api/contact", isAuthenticated, hasRole(["super_admin"]), async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contact submissions" });
    }
  });
  
  app.put("/api/contact/:id", isAuthenticated, hasRole(["super_admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submissionData = { isResolved: true };
      const submission = await storage.updateContactSubmission(id, submissionData);
      
      if (!submission) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Error updating contact submission" });
    }
  });
  
  // Newsletter subscriptions
  app.post("/api/newsletter", async (req, res) => {
    try {
      const subscriptionData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email address", errors: error.errors });
      }
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });
  
  app.get("/api/newsletter", isAuthenticated, hasRole(["super_admin"]), async (req, res) => {
    try {
      const subscriptions = await storage.getAllNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching newsletter subscriptions" });
    }
  });

  // Serve static files from the uploads directory
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'public', req.url);
    if (fs.existsSync(filePath) && !filePath.includes('..')) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });

  // File upload routes
  app.post('/api/upload/:uploadType', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const uploadType = req.params.uploadType;
      if (!['products', 'blog', 'profiles'].includes(uploadType)) {
        return res.status(400).json({ message: 'Invalid upload type' });
      }

      // Process the image based on type
      const filePath = req.file.path;
      let options: { width?: number; height?: number; quality?: number } = { quality: 80 };
      
      if (uploadType === 'products') {
        options = { width: 800, height: 800, quality: 80 };
      } else if (uploadType === 'blog') {
        options = { width: 1200, height: 800, quality: 80 };
      } else if (uploadType === 'profiles') {
        options = { width: 300, height: 300, quality: 80 };
      }

      const filename = await processImage(filePath, options);
      const fileUrl = getUploadedFileUrl(filename, uploadType);

      res.json({
        message: 'File uploaded successfully',
        filename: filename,
        url: fileUrl
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ message: error.message || 'Error uploading file' });
    }
  });

  // User profile routes
  app.get('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude sensitive information
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  });

  app.put('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Allow updating only non-sensitive fields
      const allowedFields = ['fullName', 'email', 'phone', 'profileImage', 'bio'];
      const updateData: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (field in req.body) {
          updateData[field] = req.body[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }

      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude sensitive information
      const { password, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile' });
    }
  });

  // Change password route
  app.put('/api/profile/password', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }

      // Verify current password and update to new password
      // This will be implemented in the auth service
      const success = await storage.updatePassword(userId, currentPassword, newPassword);
      if (!success) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating password' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
