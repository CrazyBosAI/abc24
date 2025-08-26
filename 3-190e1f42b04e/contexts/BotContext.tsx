import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bot {
  id: string;
  name: string;
  pair: string;
  type: 'DCA' | 'Grid' | 'Long' | 'Short';
  profit: number;
  profitPercent: number;
  status: 'active' | 'inactive' | 'error';
  trades: number;
  created: string;
  baseOrderSize: number;
  safetyOrderSize: number;
  maxSafetyTrades: number;
  takeProfit: number;
  stopLoss?: number;
  priceDeviation?: number;
  safetyOrderStepScale?: number;
  safetyOrderVolumeScale?: number;
  userId: string;
}

export interface BotConfig {
  name: string;
  type: 'DCA' | 'Grid' | 'Long' | 'Short';
  pair: string;
  baseOrderSize: string;
  safetyOrderSize: string;
  maxSafetyTrades: string;
  priceDeviation: string;
  safetyOrderStepScale: string;
  safetyOrderVolumeScale: string;
  takeProfit: string;
  stopLoss: string;
}

interface BotContextType {
  bots: Bot[];
  isLoading: boolean;
  createBot: (config: BotConfig, userId: string) => Promise<Bot>;
  updateBot: (botId: string, updates: Partial<Bot>) => Promise<void>;
  deleteBot: (botId: string) => Promise<void>;
  getBotById: (botId: string) => Bot | undefined;
  getUserBots: (userId: string) => Bot[];
  toggleBotStatus: (botId: string) => Promise<void>;
  refreshBots: () => Promise<void>;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

const STORAGE_KEY = '@3commas_bots';

// Generate unique ID using timestamp and random number
const generateBotId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 9);
  return `bot_${timestamp}_${random}`;
};

// Mock initial bots for demo
const getInitialBots = (userId: string): Bot[] => [
  {
    id: generateBotId(),
    name: 'BTC Long Bot',
    pair: 'BTC/USDT',
    type: 'Long',
    profit: 234.56,
    profitPercent: 5.67,
    status: 'active',
    trades: 23,
    created: '2024-01-15',
    baseOrderSize: 100,
    safetyOrderSize: 200,
    maxSafetyTrades: 5,
    takeProfit: 2.5,
    stopLoss: 5.0,
    userId,
  },
  {
    id: generateBotId(),
    name: 'ETH DCA Bot',
    pair: 'ETH/USDT',
    type: 'DCA',
    profit: -45.23,
    profitPercent: -2.34,
    status: 'active',
    trades: 12,
    created: '2024-01-10',
    baseOrderSize: 50,
    safetyOrderSize: 100,
    maxSafetyTrades: 7,
    takeProfit: 1.5,
    priceDeviation: 2.5,
    safetyOrderStepScale: 1.05,
    safetyOrderVolumeScale: 1.05,
    userId,
  },
  {
    id: generateBotId(),
    name: 'ADA Grid Bot',
    pair: 'ADA/USDT',
    type: 'Grid',
    profit: 123.45,
    profitPercent: 8.91,
    status: 'inactive',
    trades: 45,
    created: '2024-01-05',
    baseOrderSize: 25,
    safetyOrderSize: 50,
    maxSafetyTrades: 10,
    takeProfit: 3.0,
    priceDeviation: 1.0,
    userId,
  },
  {
    id: generateBotId(),
    name: 'SOL Short Bot',
    pair: 'SOL/USDT',
    type: 'Short',
    profit: 67.89,
    profitPercent: 3.45,
    status: 'error',
    trades: 8,
    created: '2024-01-20',
    baseOrderSize: 75,
    safetyOrderSize: 150,
    maxSafetyTrades: 3,
    takeProfit: 2.0,
    stopLoss: 5.0,
    userId,
  },
];

export function BotProvider({ children }: { children: ReactNode }) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      console.log('Loading bots from storage...');
      const storedBots = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedBots) {
        const parsedBots = JSON.parse(storedBots);
        console.log(`Loaded ${parsedBots.length} bots from storage`);
        setBots(parsedBots);
      } else {
        console.log('No stored bots found, using empty array');
        setBots([]);
      }
    } catch (error) {
      console.error('Error loading bots:', error);
      setBots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBots = async (botsToSave: Bot[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(botsToSave));
      console.log(`Saved ${botsToSave.length} bots to storage`);
    } catch (error) {
      console.error('Error saving bots:', error);
    }
  };

  const createBot = async (config: BotConfig, userId: string): Promise<Bot> => {
    try {
      const newBot: Bot = {
        id: generateBotId(),
        name: config.name,
        pair: config.pair,
        type: config.type,
        profit: 0,
        profitPercent: 0,
        status: 'inactive',
        trades: 0,
        created: new Date().toISOString().split('T')[0],
        baseOrderSize: parseFloat(config.baseOrderSize) || 0,
        safetyOrderSize: parseFloat(config.safetyOrderSize) || 0,
        maxSafetyTrades: parseInt(config.maxSafetyTrades) || 0,
        takeProfit: parseFloat(config.takeProfit) || 0,
        stopLoss: config.stopLoss ? parseFloat(config.stopLoss) : undefined,
        priceDeviation: config.priceDeviation ? parseFloat(config.priceDeviation) : undefined,
        safetyOrderStepScale: config.safetyOrderStepScale ? parseFloat(config.safetyOrderStepScale) : undefined,
        safetyOrderVolumeScale: config.safetyOrderVolumeScale ? parseFloat(config.safetyOrderVolumeScale) : undefined,
        userId,
      };

      console.log('Creating new bot:', newBot);
      
      const updatedBots = [...bots, newBot];
      setBots(updatedBots);
      await saveBots(updatedBots);
      
      console.log(`Bot created successfully with ID: ${newBot.id}`);
      return newBot;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw error;
    }
  };

  const updateBot = async (botId: string, updates: Partial<Bot>): Promise<void> => {
    try {
      console.log(`Updating bot ${botId}:`, updates);
      
      const updatedBots = bots.map(bot => 
        bot.id === botId ? { ...bot, ...updates } : bot
      );
      
      setBots(updatedBots);
      await saveBots(updatedBots);
      
      console.log(`Bot ${botId} updated successfully`);
    } catch (error) {
      console.error('Error updating bot:', error);
      throw error;
    }
  };

  const deleteBot = async (botId: string): Promise<void> => {
    try {
      console.log(`Deleting bot ${botId}`);
      
      const updatedBots = bots.filter(bot => bot.id !== botId);
      setBots(updatedBots);
      await saveBots(updatedBots);
      
      console.log(`Bot ${botId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting bot:', error);
      throw error;
    }
  };

  const getBotById = (botId: string): Bot | undefined => {
    return bots.find(bot => bot.id === botId);
  };

  const getUserBots = (userId: string): Bot[] => {
    return bots.filter(bot => bot.userId === userId);
  };

  const toggleBotStatus = async (botId: string): Promise<void> => {
    try {
      const bot = getBotById(botId);
      if (!bot) {
        throw new Error(`Bot with ID ${botId} not found`);
      }

      const newStatus = bot.status === 'active' ? 'inactive' : 'active';
      await updateBot(botId, { status: newStatus });
      
      console.log(`Bot ${botId} status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error toggling bot status:', error);
      throw error;
    }
  };

  const refreshBots = async (): Promise<void> => {
    await loadBots();
  };

  // Initialize demo bots for new users
  const initializeDemoBots = async (userId: string) => {
    if (bots.length === 0) {
      console.log('Initializing demo bots for new user');
      const demoBots = getInitialBots(userId);
      setBots(demoBots);
      await saveBots(demoBots);
    }
  };

  const value: BotContextType = {
    bots,
    isLoading,
    createBot,
    updateBot,
    deleteBot,
    getBotById,
    getUserBots,
    toggleBotStatus,
    refreshBots,
  };

  return (
    <BotContext.Provider value={value}>
      {children}
    </BotContext.Provider>
  );
}

export function useBot() {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
}