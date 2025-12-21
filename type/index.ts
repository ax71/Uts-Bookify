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

export interface Transaction {
  id: string;
  items: {
    book: Book;
    quantity: number;
  }[];
  totalPrice: number;
  date: string;
}

export type Category = "All" | "Child" | "Education" | "Technology";
