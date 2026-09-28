import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, BookOpen, Folder, ChevronRight } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';

const initialForm = { id: null, nombre: '', descripcion: '', slug: '', categoriaPadreId: '' };

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes / diacriticos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function AdminCategoriasPage() {
  const toast = useToast();
  const [arbol, setArbol] = useState([]);
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
      const raices = await adminService.categorias.listarRaices();
      setArbol(raices);
    } catch (e) {
      toast.error('Error al cargar categorias');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirCrear = (padreId = null) => {
    setForm({ ...initialForm, categoriaPadreId: padreId || '' });
    setErrors({});
    setOpenForm(true);
  };

  const abrirEditar = (cat) => {
    setForm({
      id: cat.id,
      nombre: cat.nombre || '',
      descripcion: cat.descripcion || '',
      slug: cat.slug || '',
      categoriaPadreId: cat.categoriaPadreId || '',
    });
    setErrors({});
    setOpenForm(true);
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!form.slug.trim()) errs.slug = 'El slug es obligatorio';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'nombre' && !prev.id) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setSubmitting(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        slug: form.slug.trim(),
        categoriaPadreId: form.categoriaPadreId ? Number(form.categoriaPadreId) : null,
      };
      if (form.id) {
        await adminService.categorias.actualizar(form.id, payload);
        toast.success('Categoria actualizada');
      } else {
        await adminService.categorias.crear(payload);
        toast.success('Categoria creada');
      }
      setOpenForm(false);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar la categoria';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const pedirEliminar = (cat) => {
    setTarget(cat);
    setOpenConfirm(true);
  };

  const confirmarEliminar = async () => {
    if (!target) return;
    setSubmitting(true);
    try {
      await adminService.categorias.eliminar(target.id);
      toast.success('Categoria eliminada');
      setOpenConfirm(false);
      setTarget(null);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo eliminar la categoria';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderAcciones = (cat, esRaiz = false) => (
    <div className="flex items-center gap-1">
      <Link
        to={`/admin/categorias/${cat.id}/contenidos`}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-botanic-700 hover:bg-botanic-50"
        title="Gestionar contenido educativo"
      >
        <BookOpen className="w-4 h-4" /> Contenido
      </Link>
      {esRaiz && (
        <button
          onClick={() => abrirCrear(cat.id)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-50"
          title="Agregar subcategoria"
        >
          <Plus className="w-4 h-4" /> Subcategoria
        </button>
      )}
      <button
        onClick={() => abrirEditar(cat)}
        className="p-2 rounded-lg text-slate-500 hover:text-botanic-700 hover:bg-botanic-50"
        title="Editar"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => pedirEliminar(cat)}
        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Categorias"
        subtitle="Las 4 categorias principales y sus subcategorias."
        actions={
          <button
            onClick={() => abrirCrear()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-botanic-600 text-white text-sm font-medium hover:bg-botanic-700 transition"
          >
            <Plus className="w-4 h-4" /> Nueva categoria
          </button>
        }
      />

      {loading ? (
        <p className="text-slate-400 text-sm">Cargando categorias...</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {arbol.map((raiz) => (
            <div key={raiz.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-botanic-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-botanic-100 text-botanic-700 flex items-center justify-center">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-botanic-900">{raiz.nombre}</h3>
                    <p className="text-xs text-slate-500">/{raiz.slug}</p>
                  </div>
                </div>
                {renderAcciones(raiz, true)}
              </div>
              <div className="divide-y divide-slate-100">
                {(raiz.subcategorias || []).length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-400 text-center">
                    Sin subcategorias.{' '}
                    <button
                      onClick={() => abrirCrear(raiz.id)}
                      className="text-botanic-700 hover:underline font-medium"
                    >
                      Crear la primera
                    </button>
                  </div>
                ) : (
                  raiz.subcategorias.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between px-5 py-3 pl-12 hover:bg-slate-50/60"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-slate-800 truncate">{sub.nombre}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{sub.descripcion}</div>
                        </div>
                      </div>
                      {renderAcciones(sub, false)}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Modal crear/editar */}
      <AdminModal
        open={openForm}
        onClose={() => !submitting && setOpenForm(false)}
        title={form.id ? 'Editar categoria' : form.categoriaPadreId ? 'Nueva subcategoria' : 'Nueva categoria'}
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
              form="categoria-form"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-botanic-600 hover:bg-botanic-700 disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="categoria-form" onSubmit={handleSubmit} className="space-y-4">
          <AdminFormField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
            placeholder="Habitos saludables, Meditacion basica..."
            maxLength={150}
          />
          <AdminFormField
            label="Slug (URL amigable)"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            error={errors.slug}
            required
            placeholder="habitos-saludables"
            hint="Se autogenera del nombre. Usa minusculas, sin espacios ni acentos."
            maxLength={160}
          />
          <AdminFormField
            label="Categoria padre"
            as="select"
            name="categoriaPadreId"
            value={form.categoriaPadreId}
            onChange={handleChange}
            hint="Deja vacio si esta es una categoria principal."
          >
            <option value="">Sin padre (categoria principal)</option>
            {arbol
              .filter((c) => c.id !== form.id)
              .map((c) => (
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
            placeholder="Breve descripcion visible al usuario"
            maxLength={500}
          />
        </form>
      </AdminModal>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => !submitting && setOpenConfirm(false)}
        onConfirm={confirmarEliminar}
        loading={submitting}
        title="Eliminar categoria"
        message={`Estas seguro de eliminar "${target?.nombre}"? Si tiene subcategorias, productos o contenidos asociados la operacion fallara.`}
      />
    </AdminLayout>
  );
}
