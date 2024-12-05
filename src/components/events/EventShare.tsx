import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaFacebook, FaTwitter, FaLink, FaQrcode } from 'react-icons/fa';
import QRCode from 'qrcode.react';
import type { Event } from '@/types/events';

interface EventShareProps {
  event: Event;
}

export default function EventShare({ event }: EventShareProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const eventUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out ${event.title} at ${eventUrl}`)}`,
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me at ${event.title}!`)}&url=${encodeURIComponent(eventUrl)}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-surface border border-border rounded-xl p-6 w-full max-w-md"
      >
        <div className="text-xl font-semibold text-text mb-6">Share Event</div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {shareLinks.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${platform.color}20` }}
              >
                <platform.icon className="w-6 h-6" style={{ color: platform.color }} />
              </motion.div>
              <div className="text-xs text-text/60">{platform.name}</div>
            </a>
          ))}
          <button
            onClick={() => setShowQR(true)}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <FaQrcode className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="text-xs text-text/60">QR Code</div>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={eventUrl}
            readOnly
            className="w-full px-4 py-3 pr-24 bg-background rounded-lg text-sm text-text/80"
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 
              text-primary rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <FaLink className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center"
              >
                <div className="text-xl font-semibold text-text mb-6">Event QR Code</div>
                <div className="p-4 bg-white rounded-xl">
                  <QRCode
                    value={eventUrl}
                    size={200}
                    level="H"
                    includeMargin
                    renderAs="svg"
                  />
                </div>
                <p className="mt-4 text-sm text-text/60">
                  Scan to view event details
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-6 px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
