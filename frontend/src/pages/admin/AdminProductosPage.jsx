import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, BookOpen, Leaf } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import ImageUploadField from '../../components/admin/ImageUploadField.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';

const initialForm = { id: null, nombre: '', descripcion: '', imagenUrl: '', categoriaId: '' };

export default function AdminProductosPage() {
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
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
      const [prods, cats] = await Promise.all([
        adminService.productos.listar(),
        adminService.categorias.listarRaices(),
      ]);
      setProductos(prods);
      // Aplanar: incluir raices y subcategorias para el select
      const flat = [];
      cats.forEach((c) => {
        flat.push({ id: c.id, nombre: c.nombre });
        (c.subcategorias || []).forEach((s) => flat.push({ id: s.id, nombre: `${c.nombre} > ${s.nombre}` }));
      });
      setCategorias(flat);
    } catch (e) {
      toast.error('Error al cargar productos');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const categoriaIndex = useMemo(() => {
    const map = {};
    categorias.forEach((c) => (map[c.id] = c.nombre));
    return map;
  }, [categorias]);

  const abrirCrear = () => {
    setForm(initialForm);
    setErrors({});
    setOpenForm(true);
  };

  const abrirEditar = (row) => {
    setForm({
      id: row.id,
      nombre: row.nombre || '',
      descripcion: row.descripcion || '',
      imagenUrl: row.imagenUrl || '',
      categoriaId: row.categoriaId || '',
    });
    setErrors({});
    setOpenForm(true);
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!form.categoriaId) errs.categoriaId = 'Selecciona una categoria';
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
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        imagenUrl: form.imagenUrl.trim() || null,
        categoriaId: Number(form.categoriaId),
      };
      if (form.id) {
        await adminService.productos.actualizar(form.id, payload);
        toast.success('Producto actualizado');
      } else {
        await adminService.productos.crear(payload);
        toast.success('Producto creado');
      }
      setOpenForm(false);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el producto';
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
      await adminService.productos.eliminar(target.id);
      toast.success('Producto eliminado');
      setOpenConfirm(false);
      setTarget(null);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo eliminar el producto';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Producto',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-botanic-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {r.imagenUrl ? (
              <img src={r.imagenUrl} alt={r.nombre} className="w-full h-full object-cover" />
            ) : (
              <Leaf className="w-5 h-5 text-botanic-600" />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{r.nombre}</div>
            <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{r.descripcion}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'categoria',
      label: 'Categoria',
      render: (r) => (
        <span className="inline-block text-xs font-medium text-botanic-700 bg-botanic-50 px-2 py-1 rounded-full">
          {r.categoriaNombre || categoriaIndex[r.categoriaId] || '-'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Productos"
        subtitle="Crea, edita y elimina productos naturales asociados a categorias."
        actions={
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-botanic-600 text-white text-sm font-medium hover:bg-botanic-700 transition"
          >
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        }
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {loading ? (
          <div className="text-slate-400 text-sm">Cargando productos...</div>
        ) : (
          <AdminTable
            columns={columns}
            rows={productos}
            emptyMessage="Aun no hay productos. Crea el primero con el boton 'Nuevo producto'."
            actions={(row) => (
              <>
                <Link
                  to={`/admin/productos/${row.id}/contenidos`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-botanic-700 hover:bg-botanic-50"
                  title="Gestionar contenido educativo"
                >
                  <BookOpen className="w-4 h-4" /> Contenido
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

      {/* Modal crear/editar */}
      <AdminModal
        open={openForm}
        onClose={() => !submitting && setOpenForm(false)}
        title={form.id ? 'Editar producto' : 'Nuevo producto'}
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
              form="producto-form"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-botanic-600 hover:bg-botanic-700 disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="producto-form" onSubmit={handleSubmit} className="space-y-4">
          <AdminFormField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
            placeholder="Manzanilla, Jengibre, etc."
            maxLength={180}
          />
          <AdminFormField
            label="Categoria"
            as="select"
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            error={errors.categoriaId}
            required
          >
            <option value="">Selecciona una categoria...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </AdminFormField>
          <AdminFormField
            label="Descripcion"
            as="textarea"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Resumen breve del producto"
            maxLength={1000}
          />
          <ImageUploadField
            label="Imagen del producto"
            value={form.imagenUrl}
            onChange={(url) => setForm((prev) => ({ ...prev, imagenUrl: url }))}
            hint="Sube una foto desde tu PC. Formatos: JPG, PNG, WEBP, GIF. Maximo 5 MB."
          />
        </form>
      </AdminModal>

      {/* Confirmacion de borrado */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => !submitting && setOpenConfirm(false)}
        onConfirm={confirmarEliminar}
        loading={submitting}
        title="Eliminar producto"
        message={`Estas seguro que deseas eliminar "${target?.nombre}"? Esta accion no se puede deshacer.`}
      />
    </AdminLayout>
  );
}
