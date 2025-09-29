import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertCardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const validatedData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(validatedData);
      res.json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid card data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create card" });
      }
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = await storage.getTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/categories", async (req, res) => {
    try {
      const categories = await storage.getTransactionsByCategory();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction categories" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // Stocks
  app.get("/api/stocks", async (req, res) => {
    try {
      const stocks = await storage.getStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });

  // Portfolio
  app.get("/api/portfolio/history", async (req, res) => {
    try {
      const history = await storage.getPortfolioHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio history" });
    }
  });

  // Analytics
  app.get("/api/analytics/overview", async (req, res) => {
    try {
      const [totalBalance, monthlySpending, monthlyIncome, investmentValue] = await Promise.all([
        storage.getTotalBalance(),
        storage.getMonthlySpending(),
        storage.getMonthlyIncome(),
        storage.getInvestmentValue()
      ]);

      res.json({
        totalBalance,
        monthlySpending,
        monthlyIncome,
        investmentValue
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics overview" });
    }
  });

  app.get("/api/analytics/trends", async (req, res) => {
    try {
      const trends = await storage.getMonthlyTrends();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monthly trends" });
    }
  });

  // User Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const userId = "default_user";
      const settings = await storage.updateUserSettings(userId, req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  // Stock Market API integration
  app.get("/api/stocks/update", async (req, res) => {
    try {
      // This would typically fetch from Alpha Vantage or similar API
      // For now, simulate live updates
      const stocks = await storage.getStocks();
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          const priceChange = (Math.random() - 0.5) * 10; // Random price change
          const newPrice = parseFloat(stock.price) + priceChange;
          const changePercent = (priceChange / parseFloat(stock.price)) * 100;
          
          return await storage.createOrUpdateStock({
            symbol: stock.symbol,
            name: stock.name,
            price: newPrice.toFixed(2),
            change: priceChange.toFixed(2),
            changePercent: changePercent.toFixed(2),
            marketCap: stock.marketCap
          });
        })
      );
      
      res.json(updatedStocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to update stock prices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
