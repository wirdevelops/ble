import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaCheck } from 'react-icons/fa';
import type { EventTicket } from '@/types/events';

interface TicketSelectionProps {
  tickets: EventTicket[];
}

export default function TicketSelection({ tickets }: TicketSelectionProps) {
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    if (quantity > ticket.maxPerPerson) {
      quantity = ticket.maxPerPerson;
    }
    if (quantity < 0) {
      quantity = 0;
    }

    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
  };

  const totalAmount = tickets.reduce((sum, ticket) => {
    return sum + (ticket.price * (selectedTickets[ticket.id] || 0));
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text">Select Tickets</h2>
        <div className="text-sm text-text/60">
          All prices in FCFA
        </div>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket, index) => {
          const available = ticket.available - ticket.sold;
          const quantity = selectedTickets[ticket.id] || 0;

          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaTicketAlt className="text-primary" />
                    <h3 className="text-lg font-medium text-text">{ticket.name}</h3>
                  </div>
                  <p className="text-text/80 mb-4">{ticket.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-text/60">Benefits:</div>
                    <ul className="grid gap-2">
                      {ticket.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-text/80">
                          <FaCheck className="mt-1 text-success flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-text/60">
                    <div>{available} tickets remaining</div>
                    <div>Max {ticket.maxPerPerson} per person</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="text-2xl font-semibold text-text">
                    {ticket.price.toLocaleString()} FCFA
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(ticket.id, quantity - 1)}
                      disabled={quantity === 0}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center
                        disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border/10"
                    >
                      -
                    </button>
                    <div className="w-12 text-center font-medium">{quantity}</div>
                    <button
                      onClick={() => handleQuantityChange(ticket.id, quantity + 1)}
                      disabled={quantity >= ticket.maxPerPerson || quantity >= available}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center
                        disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-surface border border-border rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-medium text-text">Order Summary</div>
            <div className="text-2xl font-semibold text-text">
              {totalAmount.toLocaleString()} FCFA
            </div>
          </div>

          <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Proceed to Checkout
          </button>
        </motion.div>
      )}
    </div>
  );
}
