
// User types
export type UserRole = 'player' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

// Court types
export interface Court {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  imageUrl: string;
  features: string[];
  rating: number;
}

// Time slot types
export interface TimeSlot {
  id: string;
  courtId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isBooked: boolean;
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  timeSlotId: string;
  bookingDate: string; // ISO string
  status: 'pending' | 'confirmed' | 'canceled';
  paymentId?: string;
  createdAt: string; // ISO string
}

// Payment types
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string; // ISO string
}
