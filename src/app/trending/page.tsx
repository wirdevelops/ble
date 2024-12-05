'use client';

import { motion } from 'framer-motion';
import { FiTrendingUp, FiClock, FiMusic, FiMonitor, FiFeather, FiTool } from 'react-icons/fi';

export default function TrendingPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/60 backdrop-blur-lg border-b border-border z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-text">Trending Now</h1>
          </div>
          
          {/* Time Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
            {['Today', 'This Week', 'This Month'].map((period) => (
              <button
                key={period}
                className="px-4 py-1.5 rounded-full bg-surface border border-border hover:border-primary transition-colors text-sm whitespace-nowrap"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Trending Categories */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text mb-4">Trending Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {trendingCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-surface p-4 rounded-xl border border-border hover:border-primary transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <category.icon className="w-6 h-6 text-primary" />
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    +{category.growth}%
                  </span>
                </div>
                <h3 className="font-medium text-text group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-text/60">{category.posts} new posts</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Content */}
        <section className="space-y-6">
          {trendingContent.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-4 rounded-xl border border-border hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-text/60 mb-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-text/60">
                      <FiClock className="w-4 h-4" />
                      {item.time}
                    </span>
                    <span className="text-primary">
                      +{item.engagement} engagements
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}

const trendingCategories = [
  { name: 'Live Music', icon: FiMusic, growth: 45, posts: 128 },
  { name: 'Tech Events', icon: FiMonitor, growth: 32, posts: 85 },
  { name: 'Art Shows', icon: FiFeather, growth: 28, posts: 64 },
  { name: 'Workshops', icon: FiTool, growth: 25, posts: 92 },
];
