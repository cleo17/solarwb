import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { z } from "zod";
import { User as SelectUser, insertUserSchema } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return bcrypt.compare(supplied, stored);
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || "limpias-tech-session-secret";
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if the input is an email address
        const isEmail = username.includes('@');
        
        // Get user by username or email
        const user = isEmail 
          ? await storage.getUserByEmail(username)
          : await storage.getUserByUsername(username);
          
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Extend the schema to add password confirmation
      const registerSchema = insertUserSchema.extend({
        confirmPassword: z.string()
      }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
      });
      
      const userData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password and create user
      userData.password = await hashPassword(userData.password);
      
      // By default, new registrations are customers
      if (!userData.role || userData.role === "") {
        userData.role = "customer";
      }
      
      // Remove confirmPassword before creating user
      const { confirmPassword, ...userDataToSave } = userData;
      
      const user = await storage.createUser(userDataToSave);
      
      // Login the user after registration
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Authentication failed" });
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });
  
  // Users management (only for super admin)
  app.get("/api/users", (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    storage.getAllUsers()
      .then(users => res.json(users))
      .catch(next);
  });
  
  app.put("/api/users/:id", async (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      // Check if user exists
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow certain fields to be updated
      const allowedFields = ["fullName", "email", "phone", "role"];
      const updates: Partial<SelectUser> = {};
      
      for (const field of allowedFields) {
        if (field in req.body) {
          updates[field as keyof SelectUser] = req.body[field];
        }
      }
      
      // If password is being updated, hash it
      if (req.body.password) {
        updates.password = await hashPassword(req.body.password);
      }
      
      const updatedUser = await storage.updateUser(id, updates);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete("/api/users/:id", async (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      // Prevent deleting your own account
      if (id === req.user.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}
