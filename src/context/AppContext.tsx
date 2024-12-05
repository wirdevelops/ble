'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Notification, Bookmark, SearchHistory, AnalyticsEvent } from '@/types';

interface AppState {
  user: User | null;
  notifications: Notification[];
  bookmarks: Bookmark[];
  searchHistory: SearchHistory[];
  analytics: AnalyticsEvent[];
  isSearchOpen: boolean;
  searchQuery: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'TOGGLE_BOOKMARK'; payload: Bookmark }
  | { type: 'ADD_SEARCH_HISTORY'; payload: SearchHistory }
  | { type: 'LOG_ANALYTICS'; payload: AnalyticsEvent }
  | { type: 'SET_SEARCH_OPEN'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: AppState = {
  user: null,
  notifications: [],
  bookmarks: [],
  searchHistory: [],
  analytics: [],
  isSearchOpen: false,
  searchQuery: '',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'TOGGLE_BOOKMARK':
      const exists = state.bookmarks.some((b) => b.itemId === action.payload.itemId);
      return {
        ...state,
        bookmarks: exists
          ? state.bookmarks.filter((b) => b.itemId !== action.payload.itemId)
          : [...state.bookmarks, action.payload],
      };
    case 'ADD_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory.slice(0, 9)],
      };
    case 'LOG_ANALYTICS':
      return {
        ...state,
        analytics: [action.payload, ...state.analytics],
      };
    case 'SET_SEARCH_OPEN':
      return { ...state, isSearchOpen: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        Object.keys(parsed).forEach((key) => {
          dispatch({ type: `SET_${key.toUpperCase()}` as any, payload: parsed[key] });
        });
      } catch (error) {
        console.error('Error loading persisted state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      bookmarks: state.bookmarks,
      searchHistory: state.searchHistory,
    };
    localStorage.setItem('appState', JSON.stringify(stateToSave));
  }, [state.user, state.bookmarks, state.searchHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

// Custom hooks for specific features
export const useSearch = () => {
  const { state, dispatch } = useApp();
  
  const openSearch = () => dispatch({ type: 'SET_SEARCH_OPEN', payload: true });
  const closeSearch = () => dispatch({ type: 'SET_SEARCH_OPEN', payload: false });
  const setQuery = (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  
  return {
    isOpen: state.isSearchOpen,
    query: state.searchQuery,
    openSearch,
    closeSearch,
    setQuery,
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useApp();
  
  const addNotification = (notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };
  
  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };
  
  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter((n) => !n.read).length,
    addNotification,
    markAsRead,
  };
};

export const useBookmarks = () => {
  const { state, dispatch } = useApp();
  
  const toggleBookmark = (bookmark: Bookmark) => {
    dispatch({ type: 'TOGGLE_BOOKMARK', payload: bookmark });
  };
  
  const isBookmarked = (itemId: string) => {
    return state.bookmarks.some((b) => b.itemId === itemId);
  };
  
  return {
    bookmarks: state.bookmarks,
    toggleBookmark,
    isBookmarked,
  };
};

export const useAnalytics = () => {
  const { dispatch } = useApp();
  
  const logEvent = (eventType: string, eventData: Record<string, any>) => {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      userId: 'anonymous', // Replace with actual user ID when available
      eventType,
      eventData,
      createdAt: new Date(),
    };
    dispatch({ type: 'LOG_ANALYTICS', payload: event });
  };
  
  return { logEvent };
};
