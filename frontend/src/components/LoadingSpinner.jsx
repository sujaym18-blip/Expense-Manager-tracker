const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg">
      <div className="flex flex-col items-center gap-4 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin"></div>
        <p className="text-gray-300 font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
