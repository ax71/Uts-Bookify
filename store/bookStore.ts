import { Book, CartItem, Transaction } from "@/type";
import { create } from "zustand";
import { storage } from "../utils/storage";

// Dummy data
const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Giant Kingdom",
    author: "John Smith",
    price: 29.99,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    description: "Extracurricular reading / Growing motivational story book",
    category: "Child",
    stock: 261,
  },
  {
    id: "2",
    title: "Bear's Wish",
    author: "Emily Brown",
    price: 24.99,
    coverUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    description: "Extracurricular reading / Child education story",
    category: "Child",
    stock: 261,
  },
  {
    id: "3",
    title: "Animal Adventures",
    author: "Michael Green",
    price: 34.99,
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    description: "Extracurricular reading / Growing motivational story book",
    category: "Child",
    stock: 261,
  },
];

interface BookStore {
  books: Book[];
  cart: CartItem[];
  transactions: Transaction[];
  isLoading: boolean;

  // Books
  initializeBooks: () => Promise<void>;
  addBook: (book: Omit<Book, "id">) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;

  // Cart
  addToCart: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Transactions
  checkout: () => Promise<void>;
  loadTransactions: () => Promise<void>;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  cart: [],
  transactions: [],
  isLoading: false,

  // Initialize books from storage or use dummy data
  initializeBooks: async () => {
    set({ isLoading: true });
    const storedBooks = await storage.getBooks();

    if (storedBooks.length === 0) {
      // If no books in storage, use initial dummy data
      await storage.saveBooks(initialBooks);
      set({ books: initialBooks, isLoading: false });
    } else {
      set({ books: storedBooks, isLoading: false });
    }
  },

  addBook: async (bookData) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
    };

    const updatedBooks = [...get().books, newBook];
    await storage.saveBooks(updatedBooks);
    set({ books: updatedBooks });
  },

  updateBook: async (id, bookData) => {
    const updatedBooks = get().books.map((book) =>
      book.id === id ? { ...book, ...bookData } : book
    );
    await storage.saveBooks(updatedBooks);
    set({ books: updatedBooks });
  },

  deleteBook: async (id) => {
    const updatedBooks = get().books.filter((book) => book.id !== id);
    await storage.saveBooks(updatedBooks);
    set({ books: updatedBooks });

    // Remove from cart if exists
    const updatedCart = get().cart.filter((item) => item.bookId !== id);
    set({ cart: updatedCart });
  },

  getBookById: (id) => {
    return get().books.find((book) => book.id === id);
  },

  // Cart operations
  addToCart: (bookId, quantity) => {
    const cart = get().cart;
    const existingItem = cart.find((item) => item.bookId === bookId);

    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.bookId === bookId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { bookId, quantity }] });
    }
  },

  removeFromCart: (bookId) => {
    set({ cart: get().cart.filter((item) => item.bookId !== bookId) });
  },

  updateCartQuantity: (bookId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(bookId);
      return;
    }

    set({
      cart: get().cart.map((item) =>
        item.bookId === bookId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => {
    set({ cart: [] });
  },

  getCartTotal: () => {
    const { cart, books } = get();
    return cart.reduce((total, item) => {
      const book = books.find((b) => b.id === item.bookId);
      return total + (book?.price || 0) * item.quantity;
    }, 0);
  },

  // Checkout
  checkout: async () => {
    const { cart, books, transactions } = get();

    if (cart.length === 0) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      items: cart.map((item) => {
        const book = books.find((b) => b.id === item.bookId)!;
        return { book, quantity: item.quantity };
      }),
      totalPrice: get().getCartTotal(),
      date: new Date().toISOString(),
    };

    const updatedTransactions = [transaction, ...transactions];
    await storage.saveTransactions(updatedTransactions);

    set({ transactions: updatedTransactions, cart: [] });
  },

  loadTransactions: async () => {
    const transactions = await storage.getTransactions();
    set({ transactions });
  },
}));
