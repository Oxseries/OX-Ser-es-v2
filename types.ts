
export type Language = 'tr' | 'en';

export interface Pharmacy {
  name: string;
  distance: string;
  inStock: boolean;
  lat: number;
  lng: number;
}

export interface AdvantageProduct {
  name: string;
  emoji: string;
  image?: string;
  secondaryImage?: string;
  price: string;
  margin: string;
  cost: string;
  profit?: string;
  volume?: string;
  sku?: string;
  description: string;
  detailedDescription?: string;
}
