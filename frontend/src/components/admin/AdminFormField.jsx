/**
 * Field generico: label + input/textarea/select + ayuda.
 * Render dependiendo del prop `as`.
 */
export default function AdminFormField({
  label,
  as = 'input',
  error,
  hint,
  required,
  children,
  ...props
}) {
  const baseClasses =
    'w-full px-3 py-2.5 rounded-lg border bg-white outline-none transition focus:ring-2 focus:ring-botanic-500/20 ' +
    (error
      ? 'border-red-300 focus:border-red-500'
      : 'border-slate-200 focus:border-botanic-500');

  let field;
  if (as === 'textarea') {
    field = <textarea className={baseClasses + ' min-h-[100px] resize-y'} {...props} />;
  } else if (as === 'select') {
    field = (
      <select className={baseClasses} {...props}>
        {children}
      </select>
    );
  } else {
    field = <input className={baseClasses} {...props} />;
  }

  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {field}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  );
}
