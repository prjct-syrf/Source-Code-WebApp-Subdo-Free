
export interface Subdomain {
  id: string;
  name: string;
  domain: string;
  target: string;
  type: 'A' | 'CNAME' | 'AAAA';
  proxied: boolean;
  createdAt: string;
  status: 'active' | 'pending' | 'error';
}

export interface CloudflareConfig {
  apiKey: string;
  email: string;
  zoneId: string;
}

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GenerationResult {
  imageUrl?: string;
  text?: string;
  error?: string;
}
