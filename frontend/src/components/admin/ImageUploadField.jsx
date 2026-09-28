import { useRef, useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../context/ToastContext.jsx';

/**
 * Field para subir una imagen desde el PC.
 * - Click o drag & drop sobre el area selecciona archivo.
 * - Sube al backend (/api/uploads/imagen) y devuelve la URL absoluta.
 * - Llama onChange(url) con la URL final (o '' si se quita).
 *
 * Props:
 *  - value: URL actual (string, opcional)
 *  - onChange(url): callback con la nueva URL
 *  - label, hint, error, required
 */
export default function ImageUploadField({
  value,
  onChange,
  label = 'Imagen',
  hint = 'Formatos: JPG, PNG, WEBP, GIF. Maximo 5 MB.',
  error,
  required,
}) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se aceptan archivos de imagen.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen supera el tamanio maximo (5 MB).');
      return;
    }
    setUploading(true);
    try {
      const data = await uploadService.imagen(file);
      onChange(data.url);
      toast.success('Imagen subida');
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo subir la imagen.';
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const limpiar = () => onChange('');

  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>

      {value ? (
        <div className="relative w-full rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
          <img src={value} alt="Vista previa" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={limpiar}
            className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/95 border border-slate-200 text-slate-700 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <X className="w-3.5 h-3.5" /> Quitar
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/95 border border-slate-200 text-slate-700 text-xs hover:bg-botanic-50 hover:text-botanic-700"
          >
            <Upload className="w-3.5 h-3.5" /> Cambiar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center px-6 py-10 transition cursor-pointer ${
            dragOver
              ? 'border-botanic-500 bg-botanic-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-slate-200 bg-slate-50 hover:border-botanic-400 hover:bg-botanic-50/40'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-botanic-600 animate-spin mb-2" />
              <span className="text-sm font-medium text-botanic-700">Subiendo imagen...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Haz clic o arrastra una imagen aqui
              </span>
              <span className="text-xs text-slate-500 mt-1">{hint}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}
