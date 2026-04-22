
import React, { useState } from 'react';
import { MessageSquare, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ContactPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Feedback',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'Feedback', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Feedback error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        <div className="p-8 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-pitch-green flex items-center justify-center text-white shadow-lg shadow-pitch-green-dark/20 text-2xl">
              ✉️
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Contact & Feedback</h2>
          </div>
          <p className="text-gray-400 text-sm">Have a suggestion or found a bug? We'd love to hear from you.</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-pitch-green/20 rounded-full flex items-center justify-center mx-auto text-pitch-green-light">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Received!</h3>
                  <p className="text-gray-400 text-sm">Thank you for your feedback. Our team will review it shortly.</p>
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-pitch-green-light text-xs font-black uppercase tracking-widest hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-chocolate/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-chocolate/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-chocolate/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green transition-all"
                  >
                    <option value="Feedback">General Feedback</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-chocolate/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-pitch-green transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                    <AlertCircle size={14} />
                    <span>Something went wrong. Please try again later.</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-pitch-green hover:bg-pitch-green-light disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pitch-green-dark/20 transition-all flex items-center justify-center gap-3"
                >
                  {status === 'submitting' ? (
                    <span className="animate-spin">⚽</span>
                  ) : (
                    <span>🚀</span>
                  )}
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 bg-black/20 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="text-pitch-green-light"><MessageSquare size={18} /></div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">24/7 Support</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-pitch-green-light"><Shield size={18} /></div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure Data</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-pitch-green-light"><CheckCircle2 size={18} /></div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Hub</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-pitch-green-light">📧</div>
            <a href="mailto:gmach037@gmail.com" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors">gmach037@gmail.com</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPanel;
