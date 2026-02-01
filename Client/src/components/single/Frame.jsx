
const Frame = ({ src, loading = false }) => {
  return (
    <div className="w-full h-[320px] md:h-[420px] bg-zinc-900 border border-zinc-700 rounded-md overflow-hidden flex items-center justify-center">
      {loading ? (
        <span className="text-gray-400">Loading frame...</span>
      ) : src ? (
        <img
          src={src}
          alt="Movie frame"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-500">Frame will appear here</span>
      )}
    </div>
  );
};

export default Frame;


