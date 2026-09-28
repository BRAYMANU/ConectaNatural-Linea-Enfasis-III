import { motion, AnimatePresence } from 'framer-motion';

/**
 * Tabla generica.
 * columns: [{ key, label, render?, className? }]
 * rows: array de items con un campo `id`
 * actions: funcion (row) => ReactNode (botones a la derecha)
 */
export default function AdminTable({ columns, rows, actions, emptyMessage = 'Sin registros.' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 font-semibold uppercase text-xs tracking-wide ${c.className || ''}`}>
                  {c.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-semibold uppercase text-xs tracking-wide">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="hover:bg-slate-50/60"
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 text-slate-700 ${c.className || ''}`}>
                        {c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">{actions(row)}</div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
