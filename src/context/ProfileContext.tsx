'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Activity, Achievement, UserStats } from '@/types';

interface ProfileState {
  user: User | null;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
}

type ProfileAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_STATS'; payload: Partial<UserStats> }
  | { type: 'SET_STATUS'; payload: User['status'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ProfileState = {
  user: null,
  activities: [],
  isLoading: false,
  error: null,
};

const ProfileContext = createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [action.payload, ...state.activities],
      };
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              achievements: [...state.user.achievements, action.payload],
            }
          : null,
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              stats: { ...state.user.stats, ...action.payload },
            }
          : null,
      };
    case 'SET_STATUS':
      return {
        ...state,
        user: state.user ? { ...state.user, status: action.payload } : null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // TODO: Replace with actual API call
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'talent',
          status: 'online',
          bio: 'Professional photographer and digital artist',
          location: 'Bamenda, Cameroon',
          skills: ['Photography', 'Digital Art', 'Event Planning'],
          achievements: [],
          stats: {
            totalBookings: 0,
            completedBookings: 0,
            totalEvents: 0,
            hostedEvents: 0,
            attendedEvents: 0,
            totalConnections: 0,
            totalEndorsements: 0,
            averageRating: 0,
            reviewCount: 0,
            viewCount: 0,
            messageResponseRate: 0,
            bookingResponseRate: 0,
          },
          availability: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dispatch({ type: 'SET_USER', payload: mockUser });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to load user profile',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUserData();
  }, []);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
}

// Custom hooks for profile features
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const useProfileStatus = () => {
  const { state, dispatch } = useProfile();
  
  const setStatus = (status: User['status']) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  };
  
  return {
    status: state.user?.status || 'offline',
    setStatus,
  };
};

export const useProfileStats = () => {
  const { state, dispatch } = useProfile();
  
  const updateStats = (stats: Partial<UserStats>) => {
    dispatch({ type: 'UPDATE_STATS', payload: stats });
  };
  
  return {
    stats: state.user?.stats,
    updateStats,
  };
};

export const useProfileActivities = () => {
  const { state, dispatch } = useProfile();
  
  const addActivity = (activity: Activity) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  };
  
  return {
    activities: state.activities,
    addActivity,
  };
};

export const useProfileAchievements = () => {
  const { state, dispatch } = useProfile();
  
  const addAchievement = (achievement: Achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };
  
  return {
    achievements: state.user?.achievements || [],
    addAchievement,
  };
};
