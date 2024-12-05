import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaUser, FaStore } from 'react-icons/fa';
import type { EventParticipation, ParticipationType } from '@/types/events';

interface ParticipationFormProps {
  participation: {
    [key in ParticipationType]?: EventParticipation;
  };
}

export default function ParticipationForm({ participation }: ParticipationFormProps) {
  const [selectedType, setSelectedType] = useState<ParticipationType | null>(null);

  const getIcon = (type: ParticipationType) => {
    switch (type) {
      case 'volunteer':
        return <FaUser />;
      case 'vendor':
        return <FaStore />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text">Get Involved</h2>

      <div className="grid gap-4">
        {Object.entries(participation).map(([type, details], index) => {
          const spotsLeft = details.maxSpots - details.currentSpots;
          const isSelected = selectedType === type;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedType(isSelected ? null : type as ParticipationType)}
                className="w-full text-left p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-primary">
                    {getIcon(type as ParticipationType)}
                  </div>
                  <h3 className="text-lg font-medium text-text capitalize">
                    {type}
                  </h3>
                  <div className="ml-auto text-sm text-text/60">
                    {spotsLeft} spots left
                  </div>
                </div>

                <p className="text-text/80 mb-4">
                  Join us as a {type} and be part of this amazing event!
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="text-sm text-text/60">
                    Application deadline: {new Date(details.deadline).toLocaleDateString()}
                  </div>
                </div>
              </button>

              {isSelected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border"
                >
                  <div className="p-6 space-y-6">
                    {/* Requirements */}
                    <div>
                      <h4 className="font-medium text-text mb-3">Requirements</h4>
                      <ul className="grid gap-2">
                        {details.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-text/80">
                            <FaCheck className="mt-1 text-success flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    {details.benefits && (
                      <div>
                        <h4 className="font-medium text-text mb-3">Benefits</h4>
                        <ul className="grid gap-2">
                          {details.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-text/80">
                              <FaCheck className="mt-1 text-success flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Responsibilities */}
                    {details.responsibilities && (
                      <div>
                        <h4 className="font-medium text-text mb-3">Responsibilities</h4>
                        <ul className="grid gap-2">
                          {details.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-text/80">
                              <FaCheck className="mt-1 text-success flex-shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
