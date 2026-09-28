import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const STYLES = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', Icon: CheckCircle2 },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', Icon: AlertTriangle },
  info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', Icon: Info },
};

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (msg, type = 'success', timeout = 3500) => {
      counter += 1;
      const id = counter;
      setToasts((prev) => [...prev, { id, msg, type }]);
      if (timeout) setTimeout(() => dismiss(id), timeout);
    },
    [dismiss]
  );

  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error', 5000),
    info: (m) => push(m, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => {
            const s = STYLES[t.type];
            const Icon = s.Icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 px-4 py-3 border rounded-xl shadow-md ${s.bg} ${s.border} ${s.text}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm font-medium">{t.msg}</div>
                <button onClick={() => dismiss(t.id)} className="text-current opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}
