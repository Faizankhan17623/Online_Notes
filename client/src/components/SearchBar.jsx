export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, description or tag..."
        className="input"
        style={{ paddingLeft: '2.5rem', paddingRight: value ? '2.5rem' : '1rem' }}
      />
      {value && (
        <button onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white w-5 h-5 flex items-center justify-center rounded-full text-xs transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          ✕
        </button>
      )}
    </div>
  );
}
