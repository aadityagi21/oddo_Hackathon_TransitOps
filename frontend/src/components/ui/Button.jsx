export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary:
      'inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    danger:
      'inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700',
  };

  return (
    <button type="button" className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
