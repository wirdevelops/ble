export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: {
    regular: number;
    vip?: number;
  };
  organizer: {
    name: string;
    image?: string;
  };
  categories: string[];
  attendees: number;
  liked: boolean;
  venue?: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    capacity: number;
    amenities: string[];
  };
}

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface LiveMoment {
  id: string;
  type: 'photo' | 'comment' | 'reaction';
  content: string;
  user: {
    name: string;
    avatar: string;
  };
  timestamp: Date;
  likes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  location: string;
}

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
}
