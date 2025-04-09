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
        orderData = { paymentStatus };
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

  const httpServer = createServer(app);
  return httpServer;
}
