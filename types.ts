
export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: string;
  image: string;
  description: string;
  variants?: string[];
}

export interface Category {
  id: string;
  title: string;
  subcategories?: string[];
  order?: number;
}

export interface AppSettings {
  logoUrl: string;
  heroImageUrl: string;
}

export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: ChatRole;
  text: string;
}
