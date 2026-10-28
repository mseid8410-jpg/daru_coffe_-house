export interface CoffeeItem {
  id: string;
  name: string;
  amharicName: string;
  category: 'traditional' | 'single_origin' | 'espresso' | 'cold' | 'bites';
  priceETB: number;
  priceUSD: number;
  description: string;
  origin?: string;
  tastingNotes?: string[];
  altitude?: string;
  process?: string;
  roastLevel?: 'Light' | 'Medium' | 'Dark';
  popular?: boolean;
  imageFallback: string;
}

export interface CartItem {
  item: CoffeeItem;
  quantity: number;
  customization?: {
    roast?: string;
    rueHerb?: boolean; // Tena'adam
    sugar?: 'None' | 'A little' | 'Normal' | 'Sweet';
    milk?: 'Whole' | 'Oat' | 'Almond' | 'None';
    shots?: 'Single' | 'Double' | 'Traditional';
  };
}

export interface CeremonyBooking {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  packageType: 'classic' | 'royal' | 'masterclass';
  specialRequests?: string;
}

export type CeremonyRound = 'abol' | 'tona' | 'bereka';

export type ClayFinish = 'obsidian' | 'terracotta' | 'gold_accent';

export type CameraPreset = 'cinematic' | 'sini' | 'spout' | 'rekebot';

export interface TerroirRegion {
  id: string;
  name: string;
  altitude: string;
  harvest: string;
  notes: string[];
  description: string;
  coordinates: [number, number]; // lat, long
  color: string;
}
