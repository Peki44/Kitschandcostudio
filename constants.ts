
import { Category, Product } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { 
    id: 'kozmetika', 
    title: 'KOZMETIKA', 
    subcategories: ['Sapuni (9 vrsta)', 'Ulja za bradu', 'Sve'],
    order: 1
  },
  { 
    id: 'lavandin', 
    title: 'LAVANDIN',
    subcategories: ['Eterično ulje (10ml)', 'Eterično ulje (30ml)', 'Sapun od magarećeg mlijeka', 'Blagi sapun'],
    order: 2
  },
  { 
    id: 'svijece', 
    title: 'SVIJEĆE',
    subcategories: ['Svijeće u posudama', 'Dekorativne svijeće', 'Sve'],
    order: 3
  },
  { 
    id: 'dekoracije', 
    title: 'DEKORACIJE', 
    subcategories: ['Posudica za sapun'],
    order: 4
  },
  { id: 'poklon-paketi', title: 'POKLON PAKETI', order: 5 },
  { id: 'zahvalnice', title: 'ZAHVALNICE', order: 6 },
  { id: 'korporativni', title: 'KORPORATIVNI POKLONI', order: 7 },
  { id: 'kolekcije', title: 'KOLEKCIJE', order: 8 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Milky Coco',
    category: 'kozmetika',
    subcategory: 'Sapuni (9 vrsta)',
    price: '12.00 €',
    image: 'https://picsum.photos/id/102/800/800',
    description: 'Sapun s magarećim mlijekom za lice i tijelo.',
    variants: ['Classic', 'Lavanda', 'Ruža & Glina']
  },
  {
    id: '2',
    name: 'Lavandin Pure',
    category: 'lavandin',
    subcategory: 'Eterično ulje (10ml)',
    price: '15.00 €',
    image: 'https://picsum.photos/id/360/800/800',
    description: 'Eterično ulje lavandina, 10ml.',
    variants: ['10 ml', '30 ml', '50 ml']
  },
  {
    id: '3',
    name: 'Beard Elixir',
    category: 'kozmetika',
    subcategory: 'Ulja za bradu',
    price: '22.00 €',
    image: 'https://picsum.photos/id/338/800/800',
    description: 'Njegujuće ulje za bradu s prirodnim sastojcima.',
    variants: ['Cedarwood', 'Citrus Breeze', 'Unscented']
  },
  {
    id: '4',
    name: 'Neon Glow Candle',
    category: 'svijece',
    subcategory: 'Svijeće u posudama',
    price: '18.00 €',
    image: 'https://picsum.photos/id/400/800/800',
    description: 'Svijeća od sojinog voska u ručno rađenoj posudi.',
    variants: ['Bijela', 'Neon Roza', 'Crna']
  },
  {
    id: '5',
    name: 'Sculptural Knot',
    category: 'svijece',
    subcategory: 'Dekorativne svijeće',
    price: '25.00 €',
    image: 'https://picsum.photos/id/535/800/800',
    description: 'Dekorativna svijeća neobičnog oblika.'
  },
  {
    id: '6',
    name: 'Ceramic Dish',
    category: 'dekoracije',
    subcategory: 'Posudica za sapun',
    price: '10.00 €',
    image: 'https://picsum.photos/id/111/800/800',
    description: 'Ručno rađena keramička posudica za sapun.',
    variants: ['Bež', 'Terrakota', 'Pjegava']
  }
];
