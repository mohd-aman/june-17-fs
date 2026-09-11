function Loader({ fullScreen = false }) {
  const containerClass = fullScreen
    ? "flex justify-center items-center h-screen bg-gray-950"
    : "flex justify-center items-center h-64";
  return (
    <div className={containerClass}>
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
export default Loader;