export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  cover_url: string;
  description: string;
  category: string;
  stock: number;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  book_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  book?: Book; // Populated when fetching with join
}

export interface Transaction {
  id: string;
  total_price: number;
  created_at: string;
  items: TransactionItem[]; // Populated when fetching with join
}

export type Category = "All" | "Child" | "Education" | "Technology";
