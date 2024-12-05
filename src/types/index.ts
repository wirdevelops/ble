export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'talent' | 'organizer' | 'admin';
  status: 'online' | 'offline' | 'away' | 'busy';
  bio?: string;
  location?: string;
  skills?: string[];
  achievements: Achievement[];
  stats: UserStats;
  availability: AvailabilitySchedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  totalEvents: number;
  hostedEvents: number;
  attendedEvents: number;
  totalConnections: number;
  totalEndorsements: number;
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  messageResponseRate: number;
  bookingResponseRate: number;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'badge' | 'milestone' | 'award' | 'certification';
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  progress?: {
    current: number;
    target: number;
  };
}

export interface Activity {
  id: string;
  userId: string;
  type: 'booking' | 'event' | 'connection' | 'achievement' | 'review' | 'endorsement';
  action: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'booking' | 'event' | 'system' | 'achievement' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'talent' | 'event' | 'opportunity';
  createdAt: Date;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters?: Record<string, any>;
  createdAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: Record<string, any>;
  createdAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  talentId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'one-time' | 'recurring';
  startTime: Date;
  endTime: Date;
  duration: number;
  notes?: string;
  location?: string;
  price?: number;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilitySchedule {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  metadata?: {
    breakTimes?: Array<{ start: string; end: string }>;
    maxBookingsPerDay?: number;
    bufferBetweenBookings?: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'talent' | 'event' | 'service';
  rating: number;
  comment: string;
  media?: string[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'booking' | 'event';
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}
