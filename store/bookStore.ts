import { Book, CartItem, Transaction } from "@/type";
import { create } from "zustand";
import { storage } from "../utils/storage";

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

  // Initialize books from Supabase
  initializeBooks: async () => {
    set({ isLoading: true });
    const books = await storage.getBooks();
    set({ books, isLoading: false });
  },

  addBook: async (bookData) => {
    const newBook = await storage.addBook(bookData);

    if (newBook) {
      const updatedBooks = [...get().books, newBook];
      set({ books: updatedBooks });
    }
  },

  updateBook: async (id, bookData) => {
    const success = await storage.updateBook(id, bookData);

    if (success) {
      const updatedBooks = get().books.map((book) =>
        book.id === id ? { ...book, ...bookData } : book
      );
      set({ books: updatedBooks });
    }
  },

  deleteBook: async (id) => {
    const success = await storage.deleteBook(id);

    if (success) {
      const updatedBooks = get().books.filter((book) => book.id !== id);
      set({ books: updatedBooks });

      // Remove from cart if exists
      const updatedCart = get().cart.filter((item) => item.bookId !== id);
      set({ cart: updatedCart });
    }
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

    const transactionData = {
      items: cart.map((item) => {
        const book = books.find((b) => b.id === item.bookId)!;
        return {
          book_id: book.id,
          quantity: item.quantity,
          price: book.price,
        };
      }),
      totalPrice: get().getCartTotal(),
    };

    const newTransaction = await storage.addTransaction(transactionData);

    if (newTransaction) {
      const updatedTransactions = [newTransaction, ...transactions];
      set({ transactions: updatedTransactions, cart: [] });
    }
  },

  loadTransactions: async () => {
    const transactions = await storage.getTransactions();
    set({ transactions });
  },
}));
