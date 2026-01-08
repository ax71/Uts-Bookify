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
      // Fetch transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (transactionsError) {
        console.error("Error getting transactions:", transactionsError);
        return [];
      }

      if (!transactions || transactions.length === 0) {
        return [];
      }

      // Fetch transaction items with book details
      const { data: items, error: itemsError } = await supabase
        .from("transaction_items")
        .select(
          `
          id,
          transaction_id,
          book_id,
          quantity,
          price_at_purchase,
          created_at,
          book:books(*)
        `
        )
        .in(
          "transaction_id",
          transactions.map((t) => t.id)
        );

      if (itemsError) {
        console.error("Error getting transaction items:", itemsError);
        return [];
      }

      // Group items by transaction and properly type the joined book data
      const transactionsWithItems = transactions.map((transaction) => ({
        ...transaction,
        items:
          items
            ?.filter((item) => item.transaction_id === transaction.id)
            .map((item) => ({
              ...item,
              // Supabase returns joined data as array, extract first element
              book: Array.isArray(item.book) ? item.book[0] : item.book,
            })) || [],
      }));

      return transactionsWithItems as Transaction[];
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  },

  async addTransaction(transactionData: {
    items: { book_id: string; quantity: number; price: number }[];
    totalPrice: number;
  }): Promise<Transaction | null> {
    try {
      // Create the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            total_price: transactionData.totalPrice,
          },
        ])
        .select()
        .single();

      if (transactionError || !transaction) {
        console.error("Error adding transaction:", transactionError);
        return null;
      }

      // Create transaction items
      const itemsToInsert = transactionData.items.map((item) => ({
        transaction_id: transaction.id,
        book_id: item.book_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { data: items, error: itemsError } = await supabase
        .from("transaction_items")
        .insert(itemsToInsert).select(`
          id,
          transaction_id,
          book_id,
          quantity,
          price_at_purchase,
          created_at,
          book:books(*)
        `);

      if (itemsError) {
        console.error("Error adding transaction items:", itemsError);
        // Rollback transaction if items failed
        await supabase.from("transactions").delete().eq("id", transaction.id);
        return null;
      }

      // Return complete transaction with items
      return {
        id: transaction.id,
        total_price: transaction.total_price,
        created_at: transaction.created_at,
        items:
          items?.map((item) => ({
            ...item,
            // Supabase returns joined data as array, extract first element
            book: Array.isArray(item.book) ? item.book[0] : item.book,
          })) || [],
      } as Transaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return null;
    }
  },
};
