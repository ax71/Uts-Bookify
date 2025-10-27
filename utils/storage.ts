import { Book, Transaction } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKS_KEY = "@bookify_books";
const TRANSACTIONS_KEY = "@bookify_transactions";

export const storage = {
  // Books
  async getBooks(): Promise<Book[]> {
    try {
      const data = await AsyncStorage.getItem(BOOKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting books:", error);
      return [];
    }
  },

  async saveBooks(books: Book[]): Promise<void> {
    try {
      await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    } catch (error) {
      console.error("Error saving books:", error);
    }
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  },

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        TRANSACTIONS_KEY,
        JSON.stringify(transactions)
      );
    } catch (error) {
      console.error("Error saving transactions:", error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([BOOKS_KEY, TRANSACTIONS_KEY]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
