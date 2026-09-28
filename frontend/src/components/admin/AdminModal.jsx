import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Modal generico para formularios admin.
 * Cierra con Escape o click en backdrop.
 */
export default function AdminModal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const widthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`bg-white w-full ${widthClass} rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-botanic-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">{children}</div>
            {footer && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl flex justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
