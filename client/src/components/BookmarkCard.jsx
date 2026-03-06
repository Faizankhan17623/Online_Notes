import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteBookmark, updateBookmark } from '../store/bookmarkSlice';

const SOURCE_CFG = {
  Instagram: { bar: 'linear-gradient(90deg,#ec4899,#f43f5e)', badge: 'rgba(236,72,153,0.12)', badgeBorder: 'rgba(236,72,153,0.25)', badgeText: '#f9a8d4', icon: '📸' },
  LinkedIn:  { bar: 'linear-gradient(90deg,#3b82f6,#06b6d4)', badge: 'rgba(59,130,246,0.12)',  badgeBorder: 'rgba(59,130,246,0.25)',  badgeText: '#93c5fd', icon: '💼' },
  Twitter:   { bar: 'linear-gradient(90deg,#38bdf8,#6366f1)', badge: 'rgba(56,189,248,0.12)',  badgeBorder: 'rgba(56,189,248,0.25)',  badgeText: '#7dd3fc', icon: '🐦' },
  Other:     { bar: 'linear-gradient(90deg,#8b5cf6,#6366f1)', badge: 'rgba(139,92,246,0.12)',  badgeBorder: 'rgba(139,92,246,0.25)',  badgeText: '#c4b5fd', icon: '🔖' },
};

export default function BookmarkCard({ bookmark }) {
  const dispatch = useDispatch();
  const cfg = SOURCE_CFG[bookmark.source] || SOURCE_CFG.Other;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    tags: bookmark.tags.join(', '),
    source: bookmark.source,
  });

  const handleDelete = () => {
    if (window.confirm('Delete this bookmark?')) dispatch(deleteBookmark(bookmark._id));
  };

  const handleSave = () => {
    dispatch(updateBookmark({
      id: bookmark._id,
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.4)' }}>
        <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Editing</p>
        <input className="input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" />
        <input className="input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" />
        <textarea className="input" rows={2}
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', resize: 'none' }}
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
        <input className="input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" />
        <select className="input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
          {['Instagram', 'LinkedIn', 'Twitter', 'Other'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex gap-2">
          <button onClick={handleSave}
            className="flex-1 text-white text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>Save</button>
          <button onClick={() => setEditing(false)}
            className="flex-1 text-slate-400 text-xs py-2 rounded-lg transition-colors hover:text-white"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'rgba(15,23,42,0.75)',
        border: '1px solid rgba(148,163,184,0.1)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'}
    >
      {/* Color accent bar */}
      <div style={{ height: '3px', background: cfg.bar, flexShrink: 0 }} />

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Top row: badge + actions */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: cfg.badge, border: `1px solid ${cfg.badgeBorder}`, color: cfg.badgeText }}>
            {cfg.icon} {bookmark.source}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setEditing(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-500 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }} title="Edit">✏️</button>
            <button onClick={handleDelete}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-500 hover:text-red-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }} title="Delete">🗑️</button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {bookmark.title}
        </h3>

        {/* Description */}
        {bookmark.description && (
          <p className="text-slate-500 text-xs leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {bookmark.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag-pill">#{tag}</span>
            ))}
            {bookmark.tags.length > 3 && <span className="tag-pill">+{bookmark.tags.length - 3}</span>}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-white text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-85"
            style={{ background: cfg.bar }}>
            Visit Link ↗
          </a>
          <span className="text-slate-600 text-xs shrink-0">
            {new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
