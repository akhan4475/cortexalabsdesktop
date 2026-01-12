export interface Lead {
  id: string;
  campaignId: string;
  name: string; // Decision Maker
  company: string;
  phone: string;
  email: string; // Optional but kept for compatibility
  address?: string;
  reviews?: string;
  rating?: string;
  website?: string;
  status: string; // Flexible status based on disposition
  summary: string; // Description
  lastContacted?: string;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  leadCount: number;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  closeDate: string;
  upfrontValue: number;
  monthlyValue: number;
  monthlyRetainerDate?: string; // Full date string for the first retainer payment (YYYY-MM-DD)
  status: 'active' | 'inactive';
}

export interface DemoEvent {
  id: string;
  leadId: string;
  date: string; // YYYY-MM-DD
}

export interface Conversation {
  id: string;
  contactName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export interface CallLog {
  id: string;
  leadId: string;
  leadName: string;
  duration: string;
  outcome: string;
  timestamp: string;
  recordingUrl?: string;
}