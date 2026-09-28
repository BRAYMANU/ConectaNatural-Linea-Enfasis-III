import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';

const initialForm = {
  id: null,
  tituloArticulo: '',
  autores: '',
  revista: '',
  anioPublicacion: '',
  doi: '',
  url: '',
};

/**
 * /admin/contenidos/:contenidoId/fuentes
 * Gestiona las fuentes cientificas de un contenido educativo especifico.
 */
export default function AdminFuentesPage() {
  const { contenidoId } = useParams();
  const cId = Number(contenidoId);
  const toast = useToast();

  const [fuentes, setFuentes] = useState([]);
  const [contenido, setContenido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [target, setTarget] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [fs, cont] = await Promise.all([
        adminService.fuentes.listarPorContenido(cId),
        adminService.contenidos.obtener(cId).catch(() => null),
      ]);
      setFuentes(fs);
      setContenido(cont);
    } catch (e) {
      toast.error('Error al cargar fuentes');
    } finally {
      setLoading(false);
    }
  }, [cId, toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const backTo = contenido?.productoId
    ? `/admin/productos/${contenido.productoId}/contenidos`
    : contenido?.categoriaId
    ? `/admin/categorias/${contenido.categoriaId}/contenidos`
    : '/admin';

  const abrirCrear = () => {
    setForm(initialForm);
    setErrors({});
    setOpenForm(true);
  };

  const abrirEditar = (row) => {
    setForm({
      id: row.id,
      tituloArticulo: row.tituloArticulo || '',
      autores: row.autores || '',
      revista: row.revista || '',
      anioPublicacion: row.anioPublicacion || '',
      doi: row.doi || '',
      url: row.url || '',
    });
    setErrors({});
    setOpenForm(true);
  };

  const validar = () => {
    const errs = {};
    if (!form.tituloArticulo.trim()) errs.tituloArticulo = 'Titulo obligatorio';
    if (form.anioPublicacion && (Number(form.anioPublicacion) < 1800 || Number(form.anioPublicacion) > 2100)) {
      errs.anioPublicacion = 'Anio invalido';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setSubmitting(true);
    try {
      const payload = {
        tituloArticulo: form.tituloArticulo.trim(),
        autores: form.autores.trim() || null,
        revista: form.revista.trim() || null,
        anioPublicacion: form.anioPublicacion ? Number(form.anioPublicacion) : null,
        doi: form.doi.trim() || null,
        url: form.url.trim() || null,
        contenidoId: cId,
      };
      if (form.id) {
        await adminService.fuentes.actualizar(form.id, payload);
        toast.success('Fuente actualizada');
      } else {
        await adminService.fuentes.crear(payload);
        toast.success('Fuente agregada');
      }
      setOpenForm(false);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar la fuente';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const pedirEliminar = (row) => {
    setTarget(row);
    setOpenConfirm(true);
  };

  const confirmarEliminar = async () => {
    if (!target) return;
    setSubmitting(true);
    try {
      await adminService.fuentes.eliminar(target.id);
      toast.success('Fuente eliminada');
      setOpenConfirm(false);
      setTarget(null);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo eliminar';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'tituloArticulo',
      label: 'Articulo',
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-800">{r.tituloArticulo}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {[r.autores, r.revista, r.anioPublicacion].filter(Boolean).join(' - ')}
          </div>
        </div>
      ),
    },
    {
      key: 'doi',
      label: 'DOI',
      render: (r) => <span className="text-xs text-slate-500">{r.doi || '-'}</span>,
    },
    {
      key: 'url',
      label: 'Enlace',
      render: (r) =>
        r.url ? (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-botanic-700 hover:underline inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" /> Abrir
          </a>
        ) : (
          <span className="text-xs text-slate-400">-</span>
        ),
    },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Fuentes cientificas"
        subtitle={contenido ? `Evidencia de: ${contenido.titulo}` : 'Articulos cientificos asociados al contenido.'}
        backTo={backTo}
        actions={
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-botanic-600 text-white text-sm font-medium hover:bg-botanic-700 transition"
          >
            <Plus className="w-4 h-4" /> Nueva fuente
          </button>
        }
      />

      {contenido && (
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-botanic-50 border border-botanic-100 text-botanic-800 text-sm">
          <BookOpen className="w-4 h-4" />
          Contenido: <strong>{contenido.titulo}</strong>
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {loading ? (
          <p className="text-slate-400 text-sm">Cargando fuentes...</p>
        ) : (
          <AdminTable
            columns={columns}
            rows={fuentes}
            emptyMessage="Aun no hay fuentes. Agrega articulos cientificos que respalden este contenido."
            actions={(row) => (
              <>
                <button
                  onClick={() => abrirEditar(row)}
                  className="p-2 rounded-lg text-slate-500 hover:text-botanic-700 hover:bg-botanic-50"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => pedirEliminar(row)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          />
        )}
      </motion.div>

      <AdminModal
        open={openForm}
        onClose={() => !submitting && setOpenForm(false)}
        title={form.id ? 'Editar fuente cientifica' : 'Nueva fuente cientifica'}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="fuente-form"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-botanic-600 hover:bg-botanic-700 disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="fuente-form" onSubmit={handleSubmit} className="space-y-4">
          <AdminFormField
            label="Titulo del articulo"
            name="tituloArticulo"
            value={form.tituloArticulo}
            onChange={handleChange}
            error={errors.tituloArticulo}
            required
            maxLength={300}
          />
          <AdminFormField
            label="Autores"
            name="autores"
            value={form.autores}
            onChange={handleChange}
            placeholder="Smith J., Lopez M., Gomez R."
            maxLength={300}
          />
          <div className="grid grid-cols-2 gap-4">
            <AdminFormField
              label="Revista"
              name="revista"
              value={form.revista}
              onChange={handleChange}
              maxLength={200}
            />
            <AdminFormField
              label="Anio"
              type="number"
              name="anioPublicacion"
              value={form.anioPublicacion}
              onChange={handleChange}
              error={errors.anioPublicacion}
              min={1800}
              max={2100}
            />
          </div>
          <AdminFormField
            label="DOI"
            name="doi"
            value={form.doi}
            onChange={handleChange}
            placeholder="10.1234/abcd.5678"
            maxLength={100}
          />
          <AdminFormField
            label="URL"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
            maxLength={500}
          />
        </form>
      </AdminModal>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => !submitting && setOpenConfirm(false)}
        onConfirm={confirmarEliminar}
        loading={submitting}
        title="Eliminar fuente"
        message={`Estas seguro de eliminar la fuente "${target?.tituloArticulo}"?`}
      />
    </AdminLayout>
  );
}
