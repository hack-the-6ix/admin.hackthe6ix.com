export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
      <div className="flex flex-col items-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid border-opacity-50"></div>
        <p className="mt-4 text-2xl font-semibold text-slate-800 dark:text-white">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
