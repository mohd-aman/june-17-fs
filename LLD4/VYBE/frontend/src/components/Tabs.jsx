const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-4 mb-8">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          active === tab.key
            ? "bg-violet-600 text-white"
            : "bg-zinc-800 text-zinc-400 hover:text-white"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;