import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ToggleRight, ToggleLeft, Shield } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext';

const initialForm = { nombre: '', email: '', password: '' };

export default function AdminAdministradoresPage() {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [target, setTarget] = useState(null);
  const [verTodos, setVerTodos] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const todos = await adminService.usuarios.listar();
      setUsuarios(todos);
    } catch (e) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filtrados = verTodos ? usuarios : usuarios.filter((u) => u.rol === 'ADMIN');

  const abrirCrear = () => {
    setForm(initialForm);
    setErrors({});
    setOpenForm(true);
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim() || form.nombre.length < 2) errs.nombre = 'Minimo 2 caracteres';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Email invalido';
    if (!form.password || form.password.length < 6) errs.password = 'Minimo 6 caracteres';
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
      await adminService.usuarios.crear({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
        rol: 'ADMIN',
      });
      toast.success('Administrador creado');
      setOpenForm(false);
      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear el administrador';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEstado = async (u) => {
    if (u.id === currentUser?.userId) {
      toast.error('No puedes desactivar tu propia cuenta.');
      return;
    }
    try {
      await adminService.usuarios.cambiarEstado(u.id, !u.activo);
      toast.success(u.activo ? 'Usuario desactivado' : 'Usuario activado');
      cargar();
    } catch (err) {
      toast.error('No se pudo cambiar el estado');
    }
  };

  const pedirEliminar = (u) => {
    if (u.id === currentUser?.userId) {
      toast.error('No puedes eliminar tu propia cuenta.');
      return;
    }
    setTarget(u);
    setOpenConfirm(true);
  };

  const confirmarEliminar = async () => {
    if (!target) return;
    setSubmitting(true);
    try {
      await adminService.usuarios.eliminar(target.id);
      toast.success('Usuario eliminado');
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
      key: 'nombre',
      label: 'Nombre',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
              u.rol === 'ADMIN' ? 'bg-botanic-100 text-botanic-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {u.nombre?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{u.nombre}</div>
            <div className="text-xs text-slate-500">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'rol',
      label: 'Rol',
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 rounded-full ${
            u.rol === 'ADMIN' ? 'bg-botanic-100 text-botanic-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {u.rol === 'ADMIN' && <Shield className="w-3 h-3" />}
          {u.rol}
        </span>
      ),
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (u) =>
        u.activo ? (
          <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Activo
          </span>
        ) : (
          <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-500">
            Inactivo
          </span>
        ),
    },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Administradores"
        subtitle={
          verTodos
            ? 'Todos los usuarios del sistema (USER + ADMIN).'
            : 'Usuarios con permisos de administracion.'
        }
        actions={
          <>
            <button
              onClick={() => setVerTodos((v) => !v)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              {verTodos ? 'Solo admins' : 'Ver todos'}
            </button>
            <button
              onClick={abrirCrear}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-botanic-600 text-white text-sm font-medium hover:bg-botanic-700 transition"
            >
              <Plus className="w-4 h-4" /> Registrar nuevo administrador
            </button>
          </>
        }
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {loading ? (
          <p className="text-slate-400 text-sm">Cargando usuarios...</p>
        ) : (
          <AdminTable
            columns={columns}
            rows={filtrados}
            emptyMessage="Sin usuarios para mostrar."
            actions={(row) => (
              <>
                <button
                  onClick={() => toggleEstado(row)}
                  className={`p-2 rounded-lg ${
                    row.activo
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={row.activo ? 'Desactivar' : 'Activar'}
                  disabled={row.id === currentUser?.userId}
                >
                  {row.activo ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => pedirEliminar(row)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Eliminar"
                  disabled={row.id === currentUser?.userId}
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
        title="Registrar nuevo administrador"
        size="md"
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
              form="admin-form"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-botanic-600 hover:bg-botanic-700 disabled:opacity-60"
            >
              {submitting ? 'Creando...' : 'Crear administrador'}
            </button>
          </>
        }
      >
        <form id="admin-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            El nuevo usuario tendra rol ADMIN con acceso completo al sistema. Comparte la
            contrasena por canal seguro.
          </div>
          <AdminFormField
            label="Nombre completo"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
            placeholder="Juan Lopez"
            maxLength={120}
          />
          <AdminFormField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="admin2@conectanatural.com"
            maxLength={180}
            autoComplete="off"
          />
          <AdminFormField
            label="Contrasena"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Minimo 6 caracteres"
            autoComplete="new-password"
          />
        </form>
      </AdminModal>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => !submitting && setOpenConfirm(false)}
        onConfirm={confirmarEliminar}
        loading={submitting}
        title="Eliminar usuario"
        message={`Estas seguro de eliminar a "${target?.nombre}" (${target?.email})? Esta accion no se puede deshacer.`}
      />
    </AdminLayout>
  );
}
