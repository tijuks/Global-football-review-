import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORT_LINKS = [
  { name: 'GitHub Sponsors', url: 'https://github.com/sponsors/tijuks' },
  { name: 'Patreon', url: 'https://www.patreon.com/tijuks' },
  { name: 'Open Collective', url: 'https://opencollective.com/tijuks' },
  { name: 'Ko-fi', url: 'https://ko-fi.com/tijuks' },
  { name: 'Liberapay', url: 'https://liberapay.com/tijuks' },
  { name: 'IssueHunt', url: 'https://issuehunt.io/r/tijuks' },
  { name: 'Polar', url: 'https://polar.sh/tijuks' },
  { name: 'Tidelift', url: 'https://tidelift.com/subscription/pkg/npm-tijuks' },
];

const CUSTOM_DONATION_LINK = "https://global.info-systems.com/donate/tijuks";

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-chocolate-dark border border-chocolate rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">Support the Project</h2>
            <p className="text-gray-400 text-sm mb-6">Your support helps keep the Global Football Review Hub updated and running. Thank you!</p>
            
            <div className="space-y-3">
              {SUPPORT_LINKS.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-chocolate hover:bg-pitch-green hover:text-white text-gray-300 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  {link.name}
                </a>
              ))}
              <a
                href={CUSTOM_DONATION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-pitch-green hover:bg-pitch-green-light text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all mt-4"
              >
                Custom Donation
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full text-gray-500 hover:text-white text-xs font-medium transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
