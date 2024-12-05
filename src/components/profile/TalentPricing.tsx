'use client';

import { motion } from 'framer-motion';
import { FaCheck, FaClock, FaCalendarAlt, FaMicrophone } from 'react-icons/fa';

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface TalentPricingProps {
  packages: Package[];
  onSelectPackage: (packageId: string) => void;
}

export default function TalentPricing({
  packages,
  onSelectPackage,
}: TalentPricingProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative bg-surface border rounded-xl p-6 ${
            pkg.popular ? 'border-primary' : 'border-border'
          }`}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-primary text-background text-sm rounded-full">
                Most Popular
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-text mb-2">{pkg.name}</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold text-text">
                ${pkg.price}
              </span>
              <span className="text-text/60">/{pkg.duration}</span>
            </div>
            <p className="mt-2 text-sm text-text/60">{pkg.description}</p>
          </div>

          <div className="space-y-3 mb-6">
            {pkg.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaCheck className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-text/80">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPackage(pkg.id)}
            className={`w-full py-2 rounded-full transition-colors ${
              pkg.popular
                ? 'bg-primary text-background hover:opacity-90'
                : 'bg-surface border border-border text-text hover:bg-surface/80'
            }`}
          >
            Select Package
          </button>
        </motion.div>
      ))}
    </div>
  );
}
