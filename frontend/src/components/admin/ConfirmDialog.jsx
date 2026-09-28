import { AlertTriangle } from 'lucide-react';
import AdminModal from './AdminModal.jsx';

/**
 * Dialogo de confirmacion para acciones destructivas (eliminar).
 */
export default function ConfirmDialog({
  open,
  title = 'Confirmar accion',
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  loading = false,
  danger = true,
}) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-botanic-600 hover:bg-botanic-700'
            }`}
          >
            {loading ? 'Procesando...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
      </div>
    </AdminModal>
  );
}
