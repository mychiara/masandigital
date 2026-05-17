'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { db } from '../../lib/db';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dynamic Contact States
  const [contactEmail, setContactEmail] = useState('editorial@masandigital.com');
  const [contactPhone, setContactPhone] = useState('+62 812-3456-7890');
  const [contactAddress, setContactAddress] = useState('Surabaya, East Java, Indonesia');
  const [contactHours, setContactHours] = useState('Office Hours: Monday - Friday, 9:00 AM - 5:00 PM (GMT+7)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContactDetails() {
      try {
        const settings = await db.getSettings();
        if (settings.contact_email) setContactEmail(settings.contact_email);
        if (settings.contact_phone) setContactPhone(settings.contact_phone);
        if (settings.contact_address) setContactAddress(settings.contact_address);
        if (settings.contact_hours) setContactHours(settings.contact_hours);
      } catch (err) {
        console.error('Failed to load contact settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContactDetails();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate sending message
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="pt-40 pb-16 flex-grow">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side: Contact Info Card */}
            <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary-fixed px-3 py-1 rounded-full">
                  Get In Touch
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Contact Us</h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Have inquiries, advertising propositions, guest posting requests, or technical concerns? Drop us a message, and our editorial team will reply within 24 hours.
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4 py-6 border-y border-outline-variant/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50">Email Address</p>
                      <p className="text-xs font-bold text-on-surface">{contactEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50">Phone Helpline</p>
                      <p className="text-xs font-bold text-on-surface">{contactPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50">Primary Hub</p>
                      <p className="text-xs font-bold text-on-surface">{contactAddress}</p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-on-surface-variant/70 italic">
                {contactHours}
              </p>
            </div>

            {/* Right side: Contact Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle className="w-4 h-4 text-green-600 animate-bounce" />
                    Thank you! Your message has been sent successfully.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Andy Masan"
                      className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="andy@masandigital.com"
                      className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Subject Topic</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="AdSense Monetization Partnership Proposal"
                    className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Message Body</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry details..."
                    className="w-full bg-background border border-outline-variant/30 focus:border-primary rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none transition-all leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 rounded-full text-xs transition-opacity shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Inquiries Message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
