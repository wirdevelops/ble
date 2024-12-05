'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BiCalendarEvent, BiBriefcase, BiFootball } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// Create Supabase client
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Activity = Database['public']['Tables']['activities']['Row'];

export default function LiveActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        console.log('Fetching activities...');
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        console.log('Fetched activities:', data);
        setActivities(data || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'match':
        return <BiFootball className="w-5 h-5" />;
      case 'event':
        return <BiCalendarEvent className="w-5 h-5" />;
      case 'job':
        return <BiBriefcase className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const content = () => {
    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface/50 p-4 rounded-lg h-32" />
          ))}
        </div>
      );
    }

    if (!activities.length) {
      return (
        <div className="p-4 bg-surface border border-border rounded-lg">
          <p className="text-text/60">No activities found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <Link key={activity.id} href={`/activities/${activity.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-surface p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getActivityIcon(activity.type)}
                  <span className="text-sm font-medium text-text/60">
                    {activity.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-sm font-medium text-red-500">
                    {activity.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-text mb-2">
                {activity.title}
              </h3>
              
              {activity.type === 'match' && (
                <div className="text-center text-text">
                  <div className="text-2xl font-bold mb-1">{activity.score}</div>
                  <div className="text-sm text-text/60">{activity.teams}</div>
                  <div className="text-sm font-medium text-primary mt-2">
                    {activity.time}
                  </div>
                </div>
              )}
              
              {activity.type === 'event' && (
                <div className="text-text/80">
                  <div>{activity.location}</div>
                  <div className="text-primary mt-1">{activity.participants}</div>
                </div>
              )}
              
              {activity.type === 'job' && (
                <div className="text-text/80">
                  <div>{activity.company}</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-red-500">{activity.deadline}</span>
                    <span className="text-primary">{activity.applications}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <section className="py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-text">Live Now</h2>
          <span className="relative flex h-3 w-3 ml-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        </div>
        <Link href="/activities" className="text-primary hover:opacity-80">
          View All Activities
        </Link>
      </div>
      {content()}
    </section>
  );
}
