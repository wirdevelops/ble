'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { IconType } from 'react-icons';
import { 
  BiSearch, BiFilter, BiMap, BiGridAlt, BiListUl, BiTrendingUp,
  BiCalendarEvent, BiGroup, BiStore, BiMicrophone, BiBookmark, 
  BiShareAlt, BiMessageSquare, BiChevronDown, BiX 
} from 'react-icons/bi';
import { 
  FiAward, FiStar, FiMapPin, FiLink, FiTwitter, 
  FiFacebook, FiMail, FiX, FiTrendingUp, FiFilter,
  FiEye, FiChevronDown
} from 'react-icons/fi';

interface Category {
  id: string;
  label: string;
  icon: IconType;
  color: string;
  stats: {
    count: number;
    trend: string;
  };
  trending?: boolean;
}

interface Opportunity {
  id: number;
  type: 'job' | 'collaboration' | 'project';
  title: string;
  company?: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  tags: string[];
  postedDate: string;
  deadline?: string;
  isBookmarked?: boolean;
}

interface CategoryCardProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

interface Tutorial {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  categoryColor: string;
  description: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  views: number;
  isBookmarked: boolean;
}

// Category Card Component
const CategoryCard: React.FC<CategoryCardProps> = ({ category, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative p-4 rounded-xl overflow-hidden ${
      isActive ? 'ring-2 ring-primary' : 'border border-border'
    }`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
    <div className="relative space-y-2">
      <div className="flex items-center justify-between">
        <category.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
        {category.trending && (
          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full flex items-center space-x-1">
            <FiTrendingUp className="w-3 h-3" />
            <span>Trending</span>
          </span>
        )}
      </div>
      <div>
        <h3 className="font-medium">{category.label}</h3>
        <div className="text-sm text-text/60 space-y-0.5">
          <p>{category.stats.count} listings</p>
          <p className="text-primary">+{category.stats.trend}% this week</p>
        </div>
      </div>
    </div>
  </motion.button>
);

const TutorialCard = ({ tutorial }: { tutorial: Tutorial }) => {
  const [isBookmarked, setIsBookmarked] = useState(tutorial.isBookmarked);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl overflow-hidden border border-border group"
    >
      <div className="relative aspect-video">
        <Image
          src={tutorial.thumbnail}
          alt={tutorial.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
          {tutorial.duration}
        </div>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <BiBookmark className={`w-4 h-4 ${isBookmarked ? 'text-primary fill-current' : 'text-white'}`} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2 flex-1">
            {tutorial.title}
          </h3>
          <span className={`px-2 py-1 text-xs bg-gradient-to-br ${tutorial.categoryColor} rounded-lg whitespace-nowrap`}>
            {tutorial.category}
          </span>
        </div>

        <p className="text-sm text-text/60 line-clamp-2">
          {tutorial.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Image
              src={tutorial.author.avatar}
              alt={tutorial.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{tutorial.author.name}</p>
              <p className="text-xs text-text/60">{tutorial.author.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-text/60">
            <div className="flex items-center space-x-1">
              <FiEye className="w-4 h-4" />
              <span>{formatViews(tutorial.views)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Discover = () => {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  // Categories data
  const categories: Category[] = [
    {
      id: 'all',
      label: 'All',
      icon: BiGridAlt,
      color: 'from-primary/20 to-primary/5',
      stats: { count: 245, trend: '+12' }
    },
    {
      id: 'talents',
      label: 'Talents',
      icon: FiAward,
      color: 'from-blue-500/20 to-blue-500/5',
      stats: { count: 86, trend: '+8' },
      trending: true
    },
    {
      id: 'events',
      label: 'Events',
      icon: BiCalendarEvent,
      color: 'from-purple-500/20 to-purple-500/5',
      stats: { count: 54, trend: '+15' },
      trending: true
    },
    {
      id: 'venues',
      label: 'Venues',
      icon: BiStore,
      color: 'from-orange-500/20 to-orange-500/5',
      stats: { count: 32, trend: '+5' }
    },
    {
      id: 'studios',
      label: 'Studios',
      icon: BiMicrophone,
      color: 'from-red-500/20 to-red-500/5',
      stats: { count: 28, trend: '+3' }
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: BiGroup,
      color: 'from-green-500/20 to-green-500/5',
      stats: { count: 45, trend: '+18' },
      trending: true
    }
  ];

  const sampleData = [
    {
      id: 1,
      type: 'talent',
      title: 'John Doe',
      subtitle: 'Digital Artist',
      image: '/images/talents/artist1.jpg',
      rating: 4.8,
      reviews: 124,
      location: 'Commercial Avenue',
      tags: ['Digital Art', '3D Design', 'Animation'],
      price: '$50/hr',
      featured: true,
      isBookmarked: false
    },
    {
      id: 2,
      type: 'event',
      title: 'Bamenda Tech Meetup',
      subtitle: 'Technology Conference',
      image: '/images/events/tech-meetup.jpg',
      date: '2024-02-15',
      time: '14:00',
      location: 'Silicon Mountain Hub',
      attendees: 45,
      price: 'Free',
      featured: true,
      isBookmarked: false
    },
    {
      id: 3,
      type: 'venue',
      title: 'Ayaba Hotel',
      subtitle: 'Event Venue & Restaurant',
      image: '/images/venues/ayaba.jpg',
      rating: 4.5,
      reviews: 89,
      location: 'Up Station',
      amenities: ['Parking', 'WiFi', 'Catering'],
      price: '$$',
      featured: true,
      isBookmarked: false
    }
  ];

  const opportunities: Opportunity[] = [
    {
      id: 1,
      type: 'job',
      title: 'Senior Web Developer',
      company: 'TechHub Bamenda',
      companyLogo: '/images/techhub-logo.png',
      location: 'Bamenda, Commercial Avenue',
      salary: '800,000 - 1,200,000 FCFA',
      description: 'Looking for an experienced web developer to join our growing team.',
      requirements: ['5+ years React experience', 'Node.js', 'TypeScript', 'Team leadership'],
      tags: ['Full-time', 'On-site', 'Senior Level'],
      postedDate: '2024-01-15',
      deadline: '2024-02-15',
      isBookmarked: false
    },
    {
      id: 2,
      type: 'collaboration',
      title: 'Music Video Production',
      company: 'BamendaBeats Studio',
      location: 'Bamenda, Up Station',
      description: 'Seeking videographers and editors for upcoming music video projects.',
      requirements: ['Video editing skills', 'Own equipment', 'Portfolio required'],
      tags: ['Contract', 'Flexible', 'Creative'],
      postedDate: '2024-01-18',
      isBookmarked: false
    },
    {
      id: 3,
      type: 'project',
      title: 'Community Art Exhibition',
      company: 'Bamenda Arts Council',
      location: 'Bamenda Cultural Center',
      description: 'Call for artists to participate in upcoming community exhibition.',
      requirements: ['Original artwork', 'Local artist', 'Any medium'],
      tags: ['Exhibition', 'Art', 'Community'],
      postedDate: '2024-01-20',
      deadline: '2024-03-01',
      isBookmarked: false
    }
  ];

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Introduction to Digital Art',
      thumbnail: '/images/tutorials/digital-art.jpg',
      duration: '2h 30m',
      category: 'Digital Art',
      categoryColor: 'from-blue-500/20 to-blue-500/5',
      description: 'Learn the basics of digital art and how to create stunning visuals.',
      author: {
        name: 'John Doe',
        role: 'Digital Artist',
        avatar: '/images/authors/john-doe.jpg'
      },
      views: 1200,
      isBookmarked: false
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      thumbnail: '/images/tutorials/web-dev.jpg',
      duration: '4h 15m',
      category: 'Web Development',
      categoryColor: 'from-green-500/20 to-green-500/5',
      description: 'Learn the basics of web development and how to build a website from scratch.',
      author: {
        name: 'Jane Doe',
        role: 'Web Developer',
        avatar: '/images/authors/jane-doe.jpg'
      },
      views: 900,
      isBookmarked: false
    }
  ];

  const handleBookmark = (id) => {
    const updatedData = sampleData.map((item) => {
      if (item.id === id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    });
    // Update the bookmarked state here
  };

  const GridCard = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-all group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 text-xs font-medium bg-primary/90 text-white rounded-full">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleBookmark(item.id);
                }}
                className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <BiBookmark className={`w-4 h-4 ${item.isBookmarked ? 'text-primary fill-current' : 'text-white'}`} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedItem(item);
                  setShowShareModal(true);
                }}
                className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <BiShareAlt className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1">{item.title}</h3>
        <p className="text-sm text-text/60 mb-3">{item.subtitle}</p>
        <div className="flex items-center justify-between mb-3">
          {item.rating ? (
            <div className="flex items-center space-x-1">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{item.rating}</span>
              <span className="text-sm text-text/60">({item.reviews})</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <BiCalendarEvent className="w-4 h-4 text-primary" />
              <span className="text-sm">{item.date}</span>
            </div>
          )}
          <span className="text-sm font-medium">{item.price}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-text/60">
          <div className="flex items-center space-x-1">
            <FiMapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BiMessageSquare className="w-4 h-4" />
            <span>{item.reviews || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ListCard = ({ item, isBookmarked, onBookmark }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-all group"
    >
      <div className="relative w-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {item.featured && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onBookmark();
              }}
              className="p-1.5 hover:bg-surface/80 rounded-lg transition-colors"
            >
              <BiBookmark className={`w-4 h-4 ${isBookmarked ? 'text-primary' : ''}`} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setSelectedItem(item);
                setShowShareModal(true);
              }}
              className="p-1.5 hover:bg-surface/80 rounded-lg transition-colors"
            >
              <BiShareAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="font-medium text-lg mb-1">{item.title}</h3>
        <p className="text-sm text-text/60 mb-3">{item.subtitle}</p>
        
        {/* Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-0.5 text-xs bg-surface/50 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          {item.rating ? (
            <div className="flex items-center space-x-1">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{item.rating}</span>
              <span className="text-sm text-text/60">({item.reviews})</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <BiCalendarEvent className="w-4 h-4 text-primary" />
              <span className="text-sm">{item.date}</span>
              {item.time && <span className="text-sm text-text/60">at {item.time}</span>}
            </div>
          )}
          <span className="text-sm font-medium">{item.price}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-text/60">
          <div className="flex items-center space-x-1">
            <FiMapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center space-x-4">
            {item.attendees && (
              <div className="flex items-center space-x-1">
                <BiGroup className="w-4 h-4" />
                <span>{item.attendees} attending</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <BiMessageSquare className="w-4 h-4" />
              <span>{item.reviews || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const [isBookmarked, setIsBookmarked] = useState(opportunity.isBookmarked);

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'job':
          return <BiGroup className="w-5 h-5" />;
        case 'collaboration':
          return <BiMessageSquare className="w-5 h-5" />;
        case 'project':
          return <BiCalendarEvent className="w-5 h-5" />;
        default:
          return null;
      }
    };

    return (
      <div className="bg-card p-6 rounded-xl border border-border hover:border-border/80 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {opportunity.companyLogo ? (
              <Image
                src={opportunity.companyLogo}
                alt={opportunity.company || ''}
                width={48}
                height={48}
                className="rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {getTypeIcon(opportunity.type)}
              </div>
            )}
            <div>
              <h3 className="font-medium text-lg">{opportunity.title}</h3>
              {opportunity.company && (
                <p className="text-text/60">{opportunity.company}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 hover:bg-surface/80 rounded-lg transition-colors"
          >
            <BiBookmark className={`w-5 h-5 ${isBookmarked ? 'text-primary fill-current' : ''}`} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-4 text-sm text-text/60">
            <div className="flex items-center space-x-1">
              <FiMapPin className="w-4 h-4" />
              <span>{opportunity.location}</span>
            </div>
            {opportunity.salary && (
              <div className="flex items-center space-x-1">
                <FiAward className="w-4 h-4" />
                <span>{opportunity.salary}</span>
              </div>
            )}
          </div>

          <p className="text-sm">{opportunity.description}</p>

          <div className="flex flex-wrap gap-2">
            {opportunity.requirements.map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-lg"
              >
                {req}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {opportunity.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-surface text-text/60 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-text/60">
              Posted: {opportunity.postedDate}
              {opportunity.deadline && ` · Deadline: ${opportunity.deadline}`}
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ShareModal = ({ isOpen, onClose, item }) => {
    if (!isOpen) return null;

    const shareOptions = [
      { icon: FiLink, label: 'Copy Link', action: () => {
        navigator.clipboard.writeText(`https://bamenda.community/discover/${item.type}/${item.id}`);
        // Add toast notification here
      }},
      { icon: FiTwitter, label: 'Twitter', action: () => {
        window.open(`https://twitter.com/intent/tweet?text=Check out ${item.title} on Bamenda Community!&url=https://bamenda.community/discover/${item.type}/${item.id}`, '_blank');
      }},
      { icon: FiFacebook, label: 'Facebook', action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=https://bamenda.community/discover/${item.type}/${item.id}`, '_blank');
      }},
      { icon: FiMail, label: 'Email', action: () => {
        window.open(`mailto:?subject=Check out ${item.title} on Bamenda Community&body=I found this interesting ${item.type} on Bamenda Community: https://bamenda.community/discover/${item.type}/${item.id}`, '_blank');
      }}
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface rounded-xl p-6 w-full max-w-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Share</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-surface/80 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  option.action();
                  onClose();
                }}
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-surface/80 transition-colors"
              >
                <option.icon className="w-5 h-5" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const EnhancedSearchBar = ({ searchQuery, setSearchQuery, showFilters, setShowFilters }) => {
    const [recentSearches] = useState([
      'Web Developer',
      'Photography Events',
      'Music Studio',
      'Digital Marketing'
    ]);

    return (
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search talents, events, venues..."
            className="w-full px-12 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-surface/80 rounded-full transition-colors"
          >
            <FiFilter className={`w-5 h-5 ${showFilters ? 'text-primary' : ''}`} />
          </button>
        </div>
        
        {searchQuery && (
          <div className="absolute w-full mt-2 bg-surface rounded-xl border border-border shadow-lg z-50">
            <div className="p-2">
              <div className="mb-2 px-2">
                <h3 className="text-sm font-medium">Recent Searches</h3>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="w-full px-2 py-1.5 text-left text-sm hover:bg-primary/5 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <BiSearch className="w-4 h-4 text-text/60" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const LocationFilter = () => {
    const [selectedLocation, setSelectedLocation] = useState('all');
    const popularLocations = [
      { id: 'all', name: 'All Locations', count: 245 },
      { id: 'up_station', name: 'Up Station', count: 52 },
      { id: 'commercial_avenue', name: 'Commercial Avenue', count: 78 },
      { id: 'city_chemist', name: 'City Chemist', count: 34 },
      { id: 'food_market', name: 'Food Market', count: 45 },
      { id: 'hospital_roundabout', name: 'Hospital Roundabout', count: 36 }
    ];

    return (
      <div className="space-y-3">
        <h3 className="font-medium flex items-center space-x-2">
          <FiMapPin className="w-4 h-4" />
          <span>Location</span>
        </h3>
        <div className="space-y-2">
          {popularLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location.id)}
              className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                selectedLocation === location.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-surface/80'
              }`}
            >
              <span>{location.name}</span>
              <span className="text-sm text-text/60">{location.count}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SortOptions = ({ sortBy, setSortBy }) => {
    const options = [
      { value: 'recent', label: 'Most Recent', icon: BiCalendarEvent },
      { value: 'popular', label: 'Most Popular', icon: BiTrendingUp },
      { value: 'price_low', label: 'Price: Low to High', icon: FiTrendingUp },
      { value: 'price_high', label: 'Price: High to Low', icon: FiTrendingUp }
    ];

    return (
      <div className="relative group">
        <button className="px-4 py-2 bg-surface rounded-lg flex items-center space-x-2 group-hover:bg-surface/80 transition-colors">
          <span>Sort By</span>
          <BiChevronDown className="w-5 h-5" />
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-primary/5 transition-colors ${
                sortBy === option.value ? 'text-primary' : ''
              }`}
            >
              <option.icon className="w-4 h-4" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Category Section Component
  interface CategorySectionProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
  }

  const CategorySection: React.FC<CategorySectionProps> = ({ activeFilter, setActiveFilter }) => {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Categories</h2>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={activeFilter === category.id}
              onClick={() => setActiveFilter(category.id)}
            />
          ))}
        </div>
        
        {/* Trending Categories */}
        <div className="pt-6">
          <h3 className="text-lg font-medium mb-3 flex items-center space-x-2">
            <FiTrendingUp className="w-5 h-5 text-primary" />
            <span>Trending Categories</span>
          </h3>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories
              .filter(cat => cat.trending)
              .map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className="flex-shrink-0 px-4 py-2 bg-surface rounded-lg flex items-center space-x-2 hover:bg-surface/80 transition-colors"
                >
                  <category.icon className="w-5 h-5 text-primary" />
                  <span>{category.label}</span>
                  <span className="text-sm text-primary">+{category.stats.trend}%</span>
                </button>
              ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Enhanced Search Bar */}
          <EnhancedSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-surface rounded-xl p-4 space-y-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Advanced Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1.5 hover:bg-surface/80 rounded-full transition-colors"
                    >
                      <BiX className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <LocationFilter />
                    <PriceRangeFilter />
                    <AvailabilityFilter />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-surface'
                }`}
              >
                <BiGridAlt className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-surface'
                }`}
              >
                <BiListUl className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map' ? 'bg-primary text-white' : 'hover:bg-surface'
                }`}
              >
                <BiMap className="w-5 h-5" />
              </button>
            </div>
            <SortOptions sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Categories */}
        <CategorySection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Opportunities Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Latest Opportunities</h2>
            <button className="text-primary hover:text-primary/80 transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </section>

        {/* Educational Content Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-medium">Educational Content</h2>
              <p className="text-text/60">Learn from local experts and professionals</p>
            </div>
            <button className="text-primary hover:text-primary/80 transition-colors">
              Browse All Tutorials
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section>
          {/* Content Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium">
                {activeFilter === 'all' ? 'All Listings' : categories.find(c => c.id === activeFilter)?.label}
              </h2>
              <p className="text-sm text-text/60">
                {activeFilter === 'all' 
                  ? `${categories.reduce((total, cat) => total + cat.stats.count, 0)} total listings`
                  : `${categories.find(c => c.id === activeFilter)?.stats.count || 0} listings available`
                }
              </p>
            </div>
          </div>

          {/* Grid/List View */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sampleData.map((item) => (
              viewMode === 'grid' ? (
                <GridCard
                  key={item.id}
                  item={item}
                  isBookmarked={item.isBookmarked}
                  onBookmark={() => handleBookmark(item.id)}
                />
              ) : (
                <ListCard
                  key={item.id}
                  item={item}
                  isBookmarked={item.isBookmarked}
                  onBookmark={() => handleBookmark(item.id)}
                />
              )
            ))}
          </div>
        </section>

        {/* Rest of the sections */}
        {/* ... */}
      </main>

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} item={selectedItem} />
    </div>
  );
};

export default withAuth(Discover, { requireAuth: true, requireOnboarding: true });
