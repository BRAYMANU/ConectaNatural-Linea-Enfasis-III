import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, BookOpen, ExternalLink, Leaf, Folder } from 'lucide-react';
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
  titulo: '',
  resumen: '',
  cuerpo: '',
  estado: 'BORRADOR',
};

/**
 * Pagina contextual:
 * - /admin/productos/:productoId/contenidos
 * - /admin/categorias/:categoriaId/contenidos
 * Filtra los contenidos por el contexto recibido y al guardar inyecta el id padre automaticamente.
 */
export default function AdminContenidosPage() {
  const params = useParams();
  const toast = useToast();

  const productoId = params.productoId ? Number(params.productoId) : null;
  const categoriaId = params.categoriaId ? Number(params.categoriaId) : null;

  const [contenidos, setContenidos] = useState([]);
  const [contexto, setContexto] = useState(null); // { tipo, id, nombre }
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
      const todos = await adminService.contenidos.listar();
      let filtrados;
      if (productoId) {
        filtrados = todos.filter((c) => c.productoId === productoId);
        try {
          const det = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/productos/${productoId}/detalle`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('cn_token')}` } }
          ).then((r) => r.json());
          setContexto({ tipo: 'producto', id: productoId, nombre: det.producto?.nombre || `Producto #${productoId}` });
        } catch {
          setContexto({ tipo: 'producto', id: productoId, nombre: `Producto #${productoId}` });
        }
      } else if (categoriaId) {
        filtrados = todos.filter((c) => c.categoriaId === categoriaId);
        try {
          const cat = await adminService.categorias.obtener(categoriaId);
          setContexto({ tipo: 'categoria', id: categoriaId, nombre: cat.nombre });
        } catch {
          setContexto({ tipo: 'categoria', id: categoriaId, nombre: `Categoria #${categoriaId}` });
        }
      } else {
        filtrados = todos;
        setContexto(null);
      }
      setContenidos(filtrados);
    } catch (err) {
      toast.error('Error al cargar contenidos');
    } finally {
      setLoading(false);
    }
  }, [productoId, categoriaId, toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const backTo = useMemo(() => {
    if (productoId) return '/admin/productos';
    if (categoriaId) return '/admin/categorias';
    return '/admin';
  }, [productoId, categoriaId]);

  const abrirCrear = () => {
    setForm(initialForm);
    setErrors({});
    setOpenForm(true);
  };

  const abrirEditar = (row) => {
    setForm({
      id: row.id,
      titulo: row.titulo || '',
      resumen: row.resumen || '',
      cuerpo: row.cuerpo || '',
      estado: row.estado || 'BORRADOR',
    });
    setErrors({});
    setOpenForm(true);
  };

  const validar = () => {
    const errs = {};
    if (!form.titulo.trim()) errs.titulo = 'Titulo obligatorio';
    if (!form.resumen.trim()) errs.resumen = 'Resumen obligatorio';
    if (!form.cuerpo.trim()) errs.cuerpo = 'Cuerpo obligatorio';
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
        titulo: form.titulo.trim(),
        resumen: form.resumen.trim(),
        cuerpo: form.cuerpo,
        estado: form.estado,
        productoId: productoId || null,
        categoriaId: categoriaId || null,
      };
      if (form.id) {
        await adminService.contenidos.actualizar(form.id, payload);
        toast.success('Contenido actualizado');
      } else {
        await adminService.contenidos.crear(payload);
        toast.success('Contenido creado');
      }
      setOpenForm(false);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el contenido';
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
      await adminService.contenidos.eliminar(target.id);
      toast.success('Contenido eliminado');
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

  const ContextIcon = contexto?.tipo === 'producto' ? Leaf : Folder;

  const columns = [
    {
      key: 'titulo',
      label: 'Contenido',
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-800">{r.titulo}</div>
          <div className="text-xs text-slate-500 line-clamp-2 max-w-md mt-0.5">{r.resumen}</div>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (r) => (
        <span
          className={`inline-block text-[10px] font-bold uppercase px-2 py-1 rounded-full tracking-wide ${
            r.estado === 'PUBLICADO'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {r.estado}
        </span>
      ),
    },
    {
      key: 'fuentes',
      label: 'Fuentes',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.fuentes?.length || 0} fuente{(r.fuentes?.length || 0) === 1 ? '' : 's'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Contenido educativo"
        subtitle={
          contexto
            ? `Articulos asociados a: ${contexto.nombre}`
            : 'Lista de contenidos publicados y borradores'
        }
        backTo={backTo}
        actions={
          contexto && (
            <button
              onClick={abrirCrear}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-botanic-600 text-white text-sm font-medium hover:bg-botanic-700 transition"
            >
              <Plus className="w-4 h-4" /> Nuevo contenido
            </button>
          )
        }
      />

      {contexto && (
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-botanic-50 border border-botanic-100 text-botanic-800 text-sm">
          <ContextIcon className="w-4 h-4" />
          {contexto.tipo === 'producto' ? 'Producto' : 'Categoria'}: <strong>{contexto.nombre}</strong>
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {loading ? (
          <p className="text-slate-400 text-sm">Cargando contenidos...</p>
        ) : (
          <AdminTable
            columns={columns}
            rows={contenidos}
            emptyMessage={
              contexto
                ? 'Aun no hay contenido para este item. Crea el primero con "Nuevo contenido".'
                : 'No hay contenidos.'
            }
            actions={(row) => (
              <>
                <Link
                  to={`/admin/contenidos/${row.id}/fuentes`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-botanic-700 hover:bg-botanic-50"
                  title="Gestionar fuentes cientificas"
                >
                  <ExternalLink className="w-4 h-4" /> Fuentes
                </Link>
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
        title={form.id ? 'Editar contenido' : 'Nuevo contenido'}
        size="xl"
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
              form="contenido-form"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-botanic-600 hover:bg-botanic-700 disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="contenido-form" onSubmit={handleSubmit} className="space-y-4">
          {contexto && (
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
              <BookOpen className="w-3.5 h-3.5 inline mr-1" />
              Asociado a {contexto.tipo}: <strong>{contexto.nombre}</strong>
            </div>
          )}
          <AdminFormField
            label="Titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            error={errors.titulo}
            required
            placeholder="Beneficios de la manzanilla en la digestion"
            maxLength={250}
          />
          <AdminFormField
            label="Resumen"
            as="textarea"
            name="resumen"
            value={form.resumen}
            onChange={handleChange}
            error={errors.resumen}
            required
            placeholder="Una sintesis breve del articulo (1-2 parrafos)"
            maxLength={1500}
          />
          <AdminFormField
            label="Cuerpo del articulo"
            as="textarea"
            name="cuerpo"
            value={form.cuerpo}
            onChange={handleChange}
            error={errors.cuerpo}
            required
            placeholder="Texto completo. Usa saltos de linea para parrafos."
            style={{ minHeight: 240 }}
          />
          <AdminFormField
            label="Estado"
            as="select"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            hint="Solo PUBLICADO se muestra a los usuarios."
          >
            <option value="BORRADOR">Borrador</option>
            <option value="PUBLICADO">Publicado</option>
          </AdminFormField>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => !submitting && setOpenConfirm(false)}
        onConfirm={confirmarEliminar}
        loading={submitting}
        title="Eliminar contenido"
        message={`Estas seguro de eliminar "${target?.titulo}"? Tambien se eliminaran sus fuentes cientificas.`}
      />
    </AdminLayout>
  );
}
