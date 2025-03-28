'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/lib/api';

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitContactForm({ name, email, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Message sent successfully!</p>
          <p>Thank you for your message. I&apos;ll get back to you as soon as possible.</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => setSuccess(false)}
          >
            Send another message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
              placeholder="Your email"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
              placeholder="Your message"
              required
            />
          </div>
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  );
}