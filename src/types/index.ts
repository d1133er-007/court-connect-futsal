
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

// Extended booking type with related data
export interface ExtendedBooking extends Booking {
  court?: Court;
  timeSlot?: TimeSlot;
  user?: User;
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

// Database conversion helpers
export const mapDbCourt = (dbCourt: any): Court => ({
  id: dbCourt.id,
  name: dbCourt.name,
  location: dbCourt.location,
  description: dbCourt.description,
  pricePerHour: dbCourt.price_per_hour,
  imageUrl: dbCourt.image_url,
  features: dbCourt.features,
  rating: dbCourt.rating
});

export const mapDbTimeSlot = (dbTimeSlot: any): TimeSlot => ({
  id: dbTimeSlot.id,
  courtId: dbTimeSlot.court_id,
  startTime: dbTimeSlot.start_time,
  endTime: dbTimeSlot.end_time,
  isBooked: dbTimeSlot.is_booked
});

export const mapDbBooking = (dbBooking: any): Booking => ({
  id: dbBooking.id,
  userId: dbBooking.user_id,
  courtId: dbBooking.court_id,
  timeSlotId: dbBooking.time_slot_id,
  bookingDate: dbBooking.booking_date,
  status: dbBooking.status,
  paymentId: dbBooking.payment_id,
  createdAt: dbBooking.created_at
});

export const mapDbUser = (dbProfile: any): User => ({
  id: dbProfile.id,
  email: dbProfile.email,
  name: dbProfile.name,
  role: dbProfile.role,
  phone: dbProfile.phone,
  avatarUrl: dbProfile.avatar_url
});
