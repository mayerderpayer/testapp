import { 
  type Card, 
  type InsertCard,
  type Transaction,
  type InsertTransaction,
  type Stock,
  type InsertStock,
  type PortfolioValue,
  type InsertPortfolioValue,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Cards
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, card: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: string): Promise<boolean>;

  // Transactions
  getTransactions(limit?: number): Promise<Transaction[]>;
  getTransactionsByCard(cardId: string): Promise<Transaction[]>;
  getTransactionsByCategory(): Promise<{ category: string; amount: string; count: number }[]>;
  getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Stocks
  getStocks(): Promise<Stock[]>;
  getStock(symbol: string): Promise<Stock | undefined>;
  createOrUpdateStock(stock: InsertStock): Promise<Stock>;

  // Portfolio
  getPortfolioHistory(): Promise<PortfolioValue[]>;
  addPortfolioValue(value: InsertPortfolioValue): Promise<PortfolioValue>;

  // User Settings
  getUserSettings(userId?: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;

  // Analytics
  getMonthlyTrends(): Promise<{ month: string; income: string; spending: string }[]>;
  getTotalBalance(): Promise<string>;
  getMonthlySpending(): Promise<string>;
  getMonthlyIncome(): Promise<string>;
  getInvestmentValue(): Promise<string>;
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;
  private transactions: Map<string, Transaction>;
  private stocks: Map<string, Stock>;
  private portfolioHistory: Map<string, PortfolioValue>;
  private userSettings: Map<string, UserSettings>;

  constructor() {
    this.cards = new Map();
    this.transactions = new Map();
    this.stocks = new Map();
    this.portfolioHistory = new Map();
    this.userSettings = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample cards
    const sampleCards: Card[] = [
      {
        id: randomUUID(),
        type: "visa",
        lastFour: "8901",
        cardholderName: "ALEX JOHNSON",
        expiryDate: "08/27",
        cardType: "debit",
        balance: "8450.67",
        creditLimit: null,
        gradient: "card-gradient-visa"
      },
      {
        id: randomUUID(),
        type: "mastercard",
        lastFour: "7612",
        cardholderName: "ALEX JOHNSON",
        expiryDate: "12/26",
        cardType: "credit",
        balance: "2340.23",
        creditLimit: "5000.00",
        gradient: "card-gradient-mastercard"
      },
      {
        id: randomUUID(),
        type: "amex",
        lastFour: "23001",
        cardholderName: "ALEX JOHNSON",
        expiryDate: "03/28",
        cardType: "platinum",
        balance: "13789.52",
        creditLimit: "25000.00",
        gradient: "card-gradient-amex"
      }
    ];

    sampleCards.forEach(card => this.cards.set(card.id, card));

    // Initialize sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: randomUUID(),
        cardId: sampleCards[0].id,
        amount: "-4.95",
        description: "Starbucks Coffee",
        category: "Food & Dining",
        date: new Date(),
        type: "expense",
        icon: "fas fa-utensils"
      },
      {
        id: randomUUID(),
        cardId: null,
        amount: "4225.00",
        description: "Salary Deposit",
        category: "Income",
        date: new Date(Date.now() - 86400000),
        type: "income",
        icon: "fas fa-building"
      },
      {
        id: randomUUID(),
        cardId: sampleCards[1].id,
        amount: "-127.49",
        description: "Amazon Purchase",
        category: "Shopping",
        date: new Date(Date.now() - 86400000),
        type: "expense",
        icon: "fas fa-shopping-bag"
      },
      {
        id: randomUUID(),
        cardId: sampleCards[0].id,
        amount: "-18.75",
        description: "Uber Ride",
        category: "Transportation",
        date: new Date(Date.now() - 172800000),
        type: "expense",
        icon: "fas fa-car"
      },
      {
        id: randomUUID(),
        cardId: sampleCards[1].id,
        amount: "-52.34",
        description: "Shell Gas Station",
        category: "Transportation",
        date: new Date(Date.now() - 259200000),
        type: "expense",
        icon: "fas fa-gas-pump"
      }
    ];

    sampleTransactions.forEach(transaction => this.transactions.set(transaction.id, transaction));

    // Initialize sample stocks
    const sampleStocks: Stock[] = [
      {
        id: randomUUID(),
        symbol: "AAPL",
        name: "Apple Inc.",
        price: "175.43",
        change: "4.02",
        changePercent: "2.34",
        marketCap: "2.7T",
        lastUpdated: new Date()
      },
      {
        id: randomUUID(),
        symbol: "TSLA",
        name: "Tesla Inc.",
        price: "242.67",
        change: "-3.85",
        changePercent: "-1.56",
        marketCap: "772B",
        lastUpdated: new Date()
      },
      {
        id: randomUUID(),
        symbol: "MSFT",
        name: "Microsoft Corp.",
        price: "378.85",
        change: "3.27",
        changePercent: "0.87",
        marketCap: "2.8T",
        lastUpdated: new Date()
      }
    ];

    sampleStocks.forEach(stock => this.stocks.set(stock.symbol, stock));

    // Initialize portfolio history
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 minute intervals
      const baseValue = 15000;
      const value = baseValue + Math.random() * 500 - 250;
      const portfolioValue: PortfolioValue = {
        id: randomUUID(),
        timestamp,
        value: value.toFixed(2)
      };
      this.portfolioHistory.set(portfolioValue.id, portfolioValue);
    }

    // Initialize user settings
    const defaultSettings: UserSettings = {
      id: randomUUID(),
      userId: "default_user",
      theme: "light",
      currency: "USD",
      preferences: {}
    };
    this.userSettings.set(defaultSettings.userId, defaultSettings);
  }

  async getCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = { 
      ...insertCard, 
      id,
      balance: insertCard.balance || "0.00",
      creditLimit: insertCard.creditLimit || null
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, updateCard: Partial<InsertCard>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;
    
    const updatedCard = { ...card, ...updateCard };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  async getTransactions(limit?: number): Promise<Transaction[]> {
    const transactions = Array.from(this.transactions.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? transactions.slice(0, limit) : transactions;
  }

  async getTransactionsByCard(cardId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.cardId === cardId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransactionsByCategory(): Promise<{ category: string; amount: string; count: number }[]> {
    const categoryMap = new Map<string, { total: number; count: number }>();
    
    Array.from(this.transactions.values())
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const amount = Math.abs(parseFloat(transaction.amount));
        const existing = categoryMap.get(transaction.category) || { total: 0, count: 0 };
        categoryMap.set(transaction.category, {
          total: existing.total + amount,
          count: existing.count + 1
        });
      });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.total.toFixed(2),
      count: data.count
    }));
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      date: new Date(),
      cardId: insertTransaction.cardId || null
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getStocks(): Promise<Stock[]> {
    return Array.from(this.stocks.values());
  }

  async getStock(symbol: string): Promise<Stock | undefined> {
    return this.stocks.get(symbol);
  }

  async createOrUpdateStock(insertStock: InsertStock): Promise<Stock> {
    const existing = this.stocks.get(insertStock.symbol);
    const stock: Stock = {
      ...insertStock,
      id: existing?.id || randomUUID(),
      lastUpdated: new Date(),
      marketCap: insertStock.marketCap || null
    };
    this.stocks.set(insertStock.symbol, stock);
    return stock;
  }

  async getPortfolioHistory(): Promise<PortfolioValue[]> {
    return Array.from(this.portfolioHistory.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async addPortfolioValue(insertValue: InsertPortfolioValue): Promise<PortfolioValue> {
    const id = randomUUID();
    const portfolioValue: PortfolioValue = {
      ...insertValue,
      id,
      timestamp: new Date()
    };
    this.portfolioHistory.set(id, portfolioValue);
    return portfolioValue;
  }

  async getUserSettings(userId = "default_user"): Promise<UserSettings | undefined> {
    return this.userSettings.get(userId);
  }

  async updateUserSettings(userId: string, updateSettings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = this.userSettings.get(userId);
    const settings: UserSettings = {
      id: existing?.id || randomUUID(),
      userId,
      theme: "light",
      currency: "USD",
      preferences: {},
      ...existing,
      ...updateSettings
    };
    this.userSettings.set(userId, settings);
    return settings;
  }

  async getMonthlyTrends(): Promise<{ month: string; income: string; spending: string }[]> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map(month => ({
      month,
      income: (8000 + Math.random() * 1000).toFixed(2),
      spending: (2500 + Math.random() * 1000).toFixed(2)
    }));
  }

  async getTotalBalance(): Promise<string> {
    const total = Array.from(this.cards.values())
      .reduce((sum, card) => sum + parseFloat(card.balance), 0);
    return total.toFixed(2);
  }

  async getMonthlySpending(): Promise<string> {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const monthlyExpenses = Array.from(this.transactions.values())
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    
    return monthlyExpenses.toFixed(2);
  }

  async getMonthlyIncome(): Promise<string> {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const monthlyIncome = Array.from(this.transactions.values())
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return monthlyIncome.toFixed(2);
  }

  async getInvestmentValue(): Promise<string> {
    const portfolioHistory = await this.getPortfolioHistory();
    const latest = portfolioHistory[portfolioHistory.length - 1];
    return latest?.value || "0.00";
  }
}

export const storage = new MemStorage();
