// One card in a dashboard list. Pass isActive to show an approval badge, and buttons as children.
const ListRow = ({ title, subtitle, isActive, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
    <div>
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-zinc-500 text-sm">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3">
      {isActive !== undefined && (
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            isActive
              ? "bg-emerald-900/50 text-emerald-400"
              : "bg-amber-900/50 text-amber-400"
          }`}
        >
          {isActive ? "Approved" : "Pending"}
        </span>
      )}
      {children}
    </div>
  </div>
);

export default ListRow;