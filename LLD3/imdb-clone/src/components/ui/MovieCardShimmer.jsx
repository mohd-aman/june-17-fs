export default function Shimmer({height='h-[350px]'}) {
  return (
    <div className="rounded-xl hover:scale-105 animate-pulse  duration-400 bg-gray-300 cursor-pointer shadow-lg">
      <div className={`w-full ${height}`}></div>
    </div>
  );
}
