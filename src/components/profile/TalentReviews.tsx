'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaStar, FaThumbsUp } from 'react-icons/fa';

interface Review {
  id: string;
  user: {
    name: string;
    image: string;
  };
  rating: number;
  date: string;
  comment: string;
  likes: number;
  userHasLiked?: boolean;
}

interface TalentReviewsProps {
  reviews: Review[];
}

export default function TalentReviews({ reviews }: TalentReviewsProps) {
  const [likedReviews, setLikedReviews] = useState<string[]>([]);

  const toggleLike = (reviewId: string) => {
    setLikedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface p-6 rounded-xl border border-border"
        >
          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={review.user.image}
                alt={review.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-text">{review.user.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-500'
                              : 'text-text/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-text/60">{review.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleLike(review.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                    likedReviews.includes(review.id)
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface hover:bg-surface/80 text-text/60'
                  }`}
                >
                  <FaThumbsUp className="w-4 h-4" />
                  <span className="text-sm">
                    {review.likes +
                      (likedReviews.includes(review.id) ? 1 : 0)}
                  </span>
                </button>
              </div>
              <p className="mt-4 text-text/80 leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="text-center mt-8">
        <button className="px-6 py-2 bg-surface border border-border rounded-full text-text hover:bg-surface/80 transition-colors">
          Load More Reviews
        </button>
      </div>
    </div>
  );
}
