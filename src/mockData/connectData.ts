export interface User {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  skills: string[];
  avatar: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  image: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'direct' | 'group';
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  replies: number;
  likes: number;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'meetup' | 'workshop' | 'networking';
  attendees: number;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  attendees: string[];
  organizer: string;
  type: 'one-on-one' | 'group' | 'workshop';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone?: string;
  tags: string[];
  lastContact: string;
  notes: string;
  connectionLevel: 'first' | 'second' | 'third';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed';
  dueDate: string;
  team: string[];
  progress: number;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'presentation' | 'spreadsheet' | 'link';
  owner: string;
  shared: string[];
  lastModified: string;
  size?: string;
  url: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  experience: number;
  rating: number;
  availability: 'high' | 'medium' | 'low';
  mentees: number;
  bio: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolled: number;
  modules: {
    id: string;
    title: string;
    duration: string;
    completed?: boolean;
  }[];
  creator: string;
}

export interface SkillShare {
  id: string;
  title: string;
  instructor: string;
  type: 'workshop' | 'presentation' | 'course';
  date: string;
  duration: string;
  skills: string[];
  capacity: number;
  enrolled: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
}

export interface NetworkingEvent {
  id: string;
  title: string;
  type: 'conference' | 'meetup' | 'webinar';
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxCapacity: number;
  description: string;
  speakers: string[];
  topics: string[];
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Software Engineer',
    company: 'Tech Corp',
    industry: 'Technology',
    skills: ['React', 'TypeScript', 'Node.js'],
    avatar: '/avatars/john.jpg'
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Product Manager',
    company: 'Innovation Inc',
    industry: 'Product Management',
    skills: ['Product Strategy', 'Agile', 'User Research'],
    avatar: '/avatars/jane.jpg'
  },
  // Add more mock users as needed
];

// Mock Industry Groups
export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Tech Innovators',
    description: 'A group for technology enthusiasts and innovators',
    members: 1200,
    category: 'Technology',
    image: '/groups/tech.jpg'
  },
  {
    id: '2',
    name: 'Product Leaders',
    description: 'Connect with product management professionals',
    members: 800,
    category: 'Product Management',
    image: '/groups/product.jpg'
  },
  // Add more mock groups as needed
];

// Mock Discussions
export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Future of Remote Work',
    content: 'How are companies adapting to remote work culture?',
    author: 'John Doe',
    timestamp: '2024-01-15T10:00:00Z',
    replies: 25,
    likes: 45,
    category: 'Work Culture'
  },
  {
    id: '2',
    title: 'AI in Product Development',
    content: 'Discussing the impact of AI on product development',
    author: 'Jane Smith',
    timestamp: '2024-01-14T15:30:00Z',
    replies: 18,
    likes: 32,
    category: 'Technology'
  },
  // Add more mock discussions as needed
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Meetup 2024',
    description: 'Annual technology meetup for professionals',
    date: '2024-02-20T18:00:00Z',
    type: 'meetup',
    attendees: 150
  },
  {
    id: '2',
    title: 'Product Management Workshop',
    description: 'Learn advanced product management techniques',
    date: '2024-02-25T14:00:00Z',
    type: 'workshop',
    attendees: 50
  },
  // Add more mock events as needed
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'Hi, would you like to collaborate on a project?',
    timestamp: '2024-01-15T09:00:00Z',
    type: 'direct'
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    content: 'Sure, I\'d love to hear more about it!',
    timestamp: '2024-01-15T09:05:00Z',
    type: 'direct'
  },
  // Add more mock messages as needed
];

// Mock Meetings
export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Project Kickoff',
    description: 'Initial meeting to discuss project scope and objectives',
    date: '2024-02-01',
    time: '10:00',
    duration: 60,
    attendees: ['2', '3', '4'],
    organizer: '1',
    type: 'group',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Mentorship Session',
    description: 'Monthly mentorship catch-up',
    date: '2024-02-02',
    time: '14:00',
    duration: 45,
    attendees: ['2'],
    organizer: '1',
    type: 'one-on-one',
    status: 'scheduled'
  }
];

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'Product Designer',
    company: 'Design Co',
    email: 'alice@designco.com',
    phone: '+1234567890',
    tags: ['design', 'ux', 'mentor'],
    lastContact: '2024-01-15',
    notes: 'Met at UX Conference 2023',
    connectionLevel: 'first'
  },
  {
    id: '2',
    name: 'Bob Wilson',
    role: 'Tech Lead',
    company: 'Tech Solutions',
    email: 'bob@techsolutions.com',
    tags: ['engineering', 'architecture'],
    lastContact: '2024-01-10',
    notes: 'Potential collaboration opportunity',
    connectionLevel: 'second'
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Modernizing the company website with new features',
    status: 'in-progress',
    dueDate: '2024-03-15',
    team: ['1', '2', '3'],
    progress: 60,
    tasks: [
      { id: '1', title: 'Design System', completed: true },
      { id: '2', title: 'Homepage Layout', completed: true },
      { id: '3', title: 'Mobile Responsiveness', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Mobile App Launch',
    description: 'Preparing for the Q1 mobile app launch',
    status: 'planning',
    dueDate: '2024-04-01',
    team: ['2', '4'],
    progress: 25,
    tasks: [
      { id: '1', title: 'Market Research', completed: true },
      { id: '2', title: 'Feature Specification', completed: false }
    ]
  }
];

// Mock Resources
export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Q1 Strategy Deck',
    type: 'presentation',
    owner: '1',
    shared: ['2', '3'],
    lastModified: '2024-01-20',
    size: '2.5 MB',
    url: '/resources/strategy-deck.pdf'
  },
  {
    id: '2',
    title: 'Design Guidelines',
    type: 'document',
    owner: '2',
    shared: ['1', '3', '4'],
    lastModified: '2024-01-18',
    size: '1.8 MB',
    url: '/resources/guidelines.pdf'
  }
];

// Mock Mentors
export const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Senior Engineering Manager',
    company: 'TechCorp',
    expertise: ['System Design', 'Leadership', 'Cloud Architecture'],
    experience: 12,
    rating: 4.8,
    availability: 'medium',
    mentees: 5,
    bio: 'Passionate about helping engineers grow in their careers. Specialized in distributed systems and engineering leadership.'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Product Director',
    company: 'InnovateLabs',
    expertise: ['Product Strategy', 'UX Design', 'Agile Management'],
    experience: 8,
    rating: 4.9,
    availability: 'high',
    mentees: 3,
    bio: 'Former startup founder turned product director. Helping product managers and designers level up their skills.'
  }
];

// Mock Learning Paths
export const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Full-Stack Development Mastery',
    description: 'Comprehensive path to becoming a full-stack developer',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    duration: '12 weeks',
    level: 'intermediate',
    enrolled: 156,
    modules: [
      { id: '1', title: 'Frontend Fundamentals', duration: '3 weeks', completed: true },
      { id: '2', title: 'Backend Development', duration: '4 weeks', completed: false },
      { id: '3', title: 'Database Design', duration: '2 weeks' },
      { id: '4', title: 'Cloud Deployment', duration: '3 weeks' }
    ],
    creator: 'Tech Academy'
  },
  {
    id: '2',
    title: 'Product Management Essentials',
    description: 'Learn core product management skills and methodologies',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
    duration: '8 weeks',
    level: 'beginner',
    enrolled: 89,
    modules: [
      { id: '1', title: 'Product Strategy Basics', duration: '2 weeks', completed: true },
      { id: '2', title: 'User Research Methods', duration: '2 weeks' },
      { id: '3', title: 'Agile Product Management', duration: '2 weeks' },
      { id: '4', title: 'Product Analytics', duration: '2 weeks' }
    ],
    creator: 'PM Institute'
  }
];

// Mock Skill Sharing Sessions
export const mockSkillSessions: SkillShare[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    instructor: 'Alex Thompson',
    type: 'workshop',
    date: '2024-02-15',
    duration: '3 hours',
    skills: ['React', 'TypeScript', 'Performance Optimization'],
    capacity: 30,
    enrolled: 25,
    level: 'advanced',
    description: 'Deep dive into advanced React patterns and performance optimization techniques.'
  },
  {
    id: '2',
    title: 'Design System Architecture',
    instructor: 'Emma Wilson',
    type: 'course',
    date: '2024-02-20',
    duration: '4 weeks',
    skills: ['Design Systems', 'Component Architecture', 'Documentation'],
    capacity: 50,
    enrolled: 35,
    level: 'intermediate',
    description: 'Learn how to build and maintain scalable design systems.'
  }
];

// Mock Networking Events
export const mockNetworkingEvents: NetworkingEvent[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    type: 'conference',
    date: '2024-03-15',
    time: '09:00',
    location: 'Virtual',
    attendees: 450,
    maxCapacity: 500,
    description: 'Annual conference focusing on emerging tech trends and innovations.',
    speakers: ['John Smith', 'Sarah Chen', 'Mike Johnson'],
    topics: ['AI/ML', 'Cloud Computing', 'DevOps']
  },
  {
    id: '2',
    title: 'Product Leaders Meetup',
    type: 'meetup',
    date: '2024-02-28',
    time: '18:00',
    location: 'TechHub Central',
    attendees: 45,
    maxCapacity: 50,
    description: 'Monthly meetup for product leaders to share experiences and network.',
    speakers: ['Alice Brown'],
    topics: ['Product Strategy', 'Leadership']
  }
];
