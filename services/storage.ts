
import { Product, Category, AppSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';

const DB_NAME = 'KitschStudioDB';
const DB_VERSION = 3; // Incremented to force update of categories with order

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = (event.target as IDBOpenDBRequest).transaction;

      // Products Store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        INITIAL_PRODUCTS.forEach(p => productStore.add(p));
      }
      
      // Categories Store
      let catStore: IDBObjectStore;
      if (!db.objectStoreNames.contains('categories')) {
        catStore = db.createObjectStore('categories', { keyPath: 'id' });
      } else {
        catStore = transaction!.objectStore('categories');
        // Clear existing categories to update structure with orders
        catStore.clear();
      }
      // Populate with new category structure
      INITIAL_CATEGORIES.forEach(c => catStore.put(c));

      // Settings Store
      if (!db.objectStoreNames.contains('settings')) {
        const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
        settingsStore.add({ key: 'logoUrl', value: '/Kitsch-logo.png' });
        settingsStore.add({ key: 'heroImageUrl', value: 'kitschandcostudio_1.jpg' });
      }
    };
  });
};

const getDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Checks if the database is empty and re-seeds it with initial data if so.
 * This handles cases where browser storage was cleared but DB structure remains,
 * or onupgradeneeded didn't fire.
 */
export const checkAndSeed = async () => {
  const db = await getDB();
  
  // Check Products
  const prodTx = db.transaction('products', 'readwrite');
  const prodStore = prodTx.objectStore('products');
  const prodCountReq = prodStore.count();
  
  prodCountReq.onsuccess = () => {
    if (prodCountReq.result === 0) {
      console.log("Seeding Products...");
      INITIAL_PRODUCTS.forEach(p => prodStore.put(p));
    }
  };

  // Check Categories
  const catTx = db.transaction('categories', 'readwrite');
  const catStore = catTx.objectStore('categories');
  const catCountReq = catStore.count();
  
  catCountReq.onsuccess = () => {
    if (catCountReq.result === 0) {
      console.log("Seeding Categories...");
      INITIAL_CATEGORIES.forEach(c => catStore.put(c));
    }
  };
  
  // Check Settings
  const setTx = db.transaction('settings', 'readwrite');
  const setStore = setTx.objectStore('settings');
  const setCountReq = setStore.count();
  
  setCountReq.onsuccess = () => {
     if (setCountReq.result === 0) {
        console.log("Seeding Settings...");
        setStore.put({ key: 'logoUrl', value: '/Kitsch-logo.png' });
        setStore.put({ key: 'heroImageUrl', value: 'kitschandcostudio_1.jpg' });
     }
  };
};

export const storage = {
  async getProducts(): Promise<Product[]> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async saveProduct(product: Product): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.put(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async deleteProduct(id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getCategories(): Promise<Category[]> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('categories', 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result as Category[];
        // Sort by 'order' property
        results.sort((a, b) => (a.order || 999) - (b.order || 999));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async saveCategory(category: Category): Promise<void> {
    const db = await getDB();
    
    // Calculate order if missing
    if (category.order === undefined) {
      const allCats = await this.getCategories();
      const maxOrder = allCats.reduce((max, c) => Math.max(max, c.order || 0), 0);
      category.order = maxOrder + 1;
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.put(category);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async deleteCategory(id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getSettings(): Promise<AppSettings> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.getAll();
      request.onsuccess = () => {
        const result = request.result;
        const settings: any = {};
        result.forEach((item: any) => {
          settings[item.key] = item.value;
        });
        resolve(settings as AppSettings);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async saveSetting(key: string, value: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
