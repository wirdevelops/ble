'use client';

import { motion } from 'framer-motion';
import { FaUserPlus, FaBriefcase, FaHandshake } from 'react-icons/fa';

const actions = [
  {
    id: 1,
    title: 'Join as Talent',
    description: 'Showcase your skills and connect with opportunities',
    icon: FaUserPlus,
    color: 'bg-blue-500',
    link: '/register/talent',
  },
  {
    id: 2,
    title: 'Hire Talent',
    description: 'Find the perfect talent for your next project',
    icon: FaBriefcase,
    color: 'bg-purple-500',
    link: '/hire',
  },
  {
    id: 3,
    title: 'Become a Partner',
    description: 'Support local talents and grow with us',
    icon: FaHandshake,
    color: 'bg-green-500',
    link: '/partner',
  },
];

export default function CallToAction() {
  return (
    <section className="py-12 bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4">Get Involved</h2>
          <p className="text-text/60 max-w-2xl mx-auto">
            Join our growing community and be part of Bamenda's creative revolution
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl transform group-hover:scale-105 transition-transform" />
              <div className="relative p-6 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text">{action.title}</h3>
                <p className="text-text/60">{action.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 px-6 py-2 bg-primary text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-text/80 mb-6">Already have an account?</p>
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-background transition-all">
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
