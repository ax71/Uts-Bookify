import { supabase } from "@/lib/supabase";
import { Book, Transaction } from "@/type";

export const storage = {
  // Books
  async getBooks(): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error getting books:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error getting books:", error);
      return [];
    }
  },

  async addBook(book: Omit<Book, "id">): Promise<Book | null> {
    try {
      const { data, error } = await supabase
        .from("books")
        .insert([book])
        .select()
        .single();

      if (error) {
        console.error("Error adding book:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error adding book:", error);
      return null;
    }
  },

  async updateBook(id: string, book: Partial<Book>): Promise<boolean> {
    try {
      const { error } = await supabase.from("books").update(book).eq("id", id);

      if (error) {
        console.error("Error updating book:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating book:", error);
      return false;
    }
  },

  async deleteBook(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);

      if (error) {
        console.error("Error deleting book:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting book:", error);
      return false;
    }
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error getting transactions:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  },

  async addTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            items: transaction.items,
            total_price: transaction.totalPrice,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding transaction:", error);
        return null;
      }

      // Map Supabase response back to Transaction type
      return {
        id: data.id,
        items: data.items,
        totalPrice: data.total_price,
        date: data.created_at,
      };
    } catch (error) {
      console.error("Error adding transaction:", error);
      return null;
    }
  },
};
