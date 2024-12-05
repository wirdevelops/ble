import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaUsers, FaMusic, FaFutbol, FaStore, FaStar } from 'react-icons/fa';
import type { Event } from '@/types/events';

interface EventVisualizationProps {
  event: Event;
}

export default function EventVisualization({ event }: EventVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  // Interactive particle system for event visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      type: string;

      constructor(type: string) {
        this.type = type;
        this.size = Math.random() * 3 + 2;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        
        // Color based on type
        switch(type) {
          case 'music': this.color = '#FF6B6B'; break;
          case 'sports': this.color = '#4ECDC4'; break;
          case 'social': this.color = '#45B7D1'; break;
          default: this.color = '#FFE66D';
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Create particles based on event activities
    const particles: Particle[] = [];
    const totalParticles = 100;
    
    for (let i = 0; i < totalParticles; i++) {
      const types = ['music', 'sports', 'social'];
      particles.push(new Particle(types[Math.floor(Math.random() * types.length)]));
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Connect nearby particles
      particles.forEach(a => {
        particles.forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative h-[300px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-background">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'transparent' }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-text mb-4"
            >
              Event Pulse
            </motion.div>
            <div className="flex gap-8 justify-center">
              {[
                { icon: FaUsers, label: 'Expected', value: '2000+' },
                { icon: FaMusic, label: 'Artists', value: '15+' },
                { icon: FaFutbol, label: 'Activities', value: event.activities.length },
                { icon: FaStore, label: 'Vendors', value: '20+' },
                { icon: FaStar, label: 'Rating', value: '4.8/5' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-xl font-semibold text-text">{stat.value}</div>
                  <div className="text-sm text-text/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Momentum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-text mb-4">Community Buzz</h3>
          <div className="space-y-4">
            {[
              { type: 'ticket', message: 'Last 50 Regular tickets remaining!' },
              { type: 'social', message: '156 people talking about this event' },
              { type: 'update', message: 'New artist announcement coming soon!' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-text/80">{item.message}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-text mb-4">Event Countdown</h3>
          <div className="grid grid-cols-4 gap-4">
            {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit, index) => (
              <motion.div
                key={unit}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-primary mb-1">
                  {unit === 'Days' ? '15' : unit === 'Hours' ? '07' : unit === 'Minutes' ? '22' : '45'}
                </div>
                <div className="text-sm text-text/60">{unit}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
