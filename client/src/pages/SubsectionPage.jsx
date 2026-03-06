import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBookmarks, addBookmark, updateBookmark, deleteBookmark } from '../store/bookmarkSlice';
import { fetchSections } from '../store/sectionSlice';
import { fetchSubsections } from '../store/subsectionSlice';
import SearchBar from '../components/SearchBar';

function BookmarkCard({ bookmark, color }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: bookmark.title, url: bookmark.url,
    description: bookmark.description, tags: bookmark.tags.join(', '),
  });

  const handleSave = () => {
    dispatch(updateBookmark({ id: bookmark._id, ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }));
    setEditing(false);
  };

  if (editing) return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl"
      style={{ background: 'rgba(15,23,42,0.9)', border: `1px solid ${color}50` }}>
      <input className="input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
        value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" />
      <input className="input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
        value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" />
      <textarea className="input" rows={2} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', resize: 'none' }}
        value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
      <input className="input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
        value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" />
      <div className="flex gap-2">
        <button onClick={handleSave} className="flex-1 text-white text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: color }}>Save</button>
        <button onClick={() => setEditing(false)} className="flex-1 text-slate-400 text-xs py-2 rounded-lg transition-colors hover:text-white"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(148,163,184,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'}>
      <div style={{ height: '3px', background: color, flexShrink: 0 }} />
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-sm leading-snug flex-1"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {bookmark.title}
          </h3>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => setEditing(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-500 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>✏️</button>
            <button onClick={() => { if (window.confirm('Delete?')) dispatch(deleteBookmark(bookmark._id)); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-500 hover:text-red-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>🗑️</button>
          </div>
        </div>

        {bookmark.description && (
          <p className="text-slate-500 text-xs leading-relaxed"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {bookmark.description}
          </p>
        )}

        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {bookmark.tags.slice(0, 4).map(tag => (
              <span key={tag} className="tag-pill">#{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-white text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-85"
            style={{ background: color }}>
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

export default function SubsectionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sectionId, subsectionId } = useParams();
  const { bookmarks, loading } = useSelector((s) => s.bookmarks);
  const { sections } = useSelector((s) => s.sections);
  const { subsections } = useSelector((s) => s.subsections);
  const { token } = useSelector((s) => s.auth);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '', tags: '' });

  const section = sections.find(s => s._id === sectionId);
  const subsection = subsections.find(s => s._id === subsectionId);
  const color = section?.color || '#4f46e5';

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchBookmarks({ subsectionId, search }));
    if (sections.length === 0) dispatch(fetchSections());
    if (subsections.length === 0) dispatch(fetchSubsections(sectionId));
  }, [token, subsectionId, search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await dispatch(addBookmark({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      sectionId, subsectionId,
    }));
    setForm({ title: '', url: '', description: '', tags: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#070d1a' }}>
      <div className="bg-orb w-80 h-80" style={{ background: color + '15', top: '-60px', right: '-60px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-5 flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Vault</button>
          <span>›</span>
          <button onClick={() => navigate(`/section/${sectionId}`)} className="hover:text-white transition-colors">{section?.name}</button>
          <span>›</span>
          <span className="text-white">{subsection?.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/section/${sectionId}`)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>←</button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{subsection?.name || 'Subsection'}</h1>
              <p className="text-slate-500 text-sm">{bookmarks.length} link{bookmarks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: color, boxShadow: `0 4px 16px ${color}50` }}>
            + Add Link
          </button>
        </div>

        {/* Add bookmark form */}
        {showForm && (
          <div className="glass-card p-5 mb-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <h3 className="text-white font-semibold mb-4">Add New Link</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input className="input" placeholder="Title *" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required autoFocus />
              <input className="input" type="url" placeholder="URL * (https://...)" value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })} required />
              <textarea className="input" rows={2} placeholder="Description (optional)"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'none' }} />
              <input className="input" placeholder="Tags: ml, tutorial, paper (comma separated)"
                value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              <div className="flex gap-2 mt-1">
                <button type="submit"
                  className="flex-1 text-white text-sm font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: color }}>Save Link</button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 text-slate-400 text-sm py-2.5 rounded-xl transition-colors hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Bookmarks */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-9 h-9 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: color }} />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: color + '15', border: `1px solid ${color}30` }}>🔗</div>
            <div>
              <p className="text-white font-semibold text-lg">{search ? 'No results' : 'No links yet'}</p>
              <p className="text-slate-500 text-sm mt-1">{search ? 'Try a different search' : 'Add your first link above'}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarks.map(b => <BookmarkCard key={b._id} bookmark={b} color={color} />)}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button onClick={() => setShowForm(true)}
        className="sm:hidden fixed bottom-5 right-5 w-14 h-14 rounded-2xl text-white text-2xl flex items-center justify-center z-50 active:scale-95"
        style={{ background: color, boxShadow: `0 8px 24px ${color}60` }}>+</button>
    </div>
  );
}
