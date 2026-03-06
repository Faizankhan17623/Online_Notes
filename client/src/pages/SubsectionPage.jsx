import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBookmarks, addBookmark, updateBookmark, deleteBookmark } from '../store/bookmarkSlice';
import { fetchSections } from '../store/sectionSlice';
import { fetchSubsections } from '../store/subsectionSlice';

function BookmarkCard({ bookmark, color }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    tags: bookmark.tags.join(', '),
  });

  useEffect(() => {
    if (!editing) {
      setForm({ title: bookmark.title, url: bookmark.url, description: bookmark.description, tags: bookmark.tags.join(', ') });
    }
  }, [bookmark, editing]);

  const handleSave = () => {
    dispatch(updateBookmark({ id: bookmark._id, ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }));
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{
        background: '#1e293b', border: `1px solid ${color}`,
        borderRadius: '10px', padding: '1rem',
        display: 'flex', flexDirection: 'column', gap: '0.625rem',
      }}>
        <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" />
        <input className="input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" />
        <textarea className="input" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" style={{ resize: 'none' }} />
        <input className="input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} style={{ flex: 1, padding: '0.5rem', background: color, border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
          <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#1e293b', border: '1px solid #334155',
      borderRadius: '10px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Color accent bar */}
      <div style={{ height: '3px', background: color, flexShrink: 0 }} />

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {/* Title + actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h3 style={{
            color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem',
            lineHeight: 1.4, flex: 1,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {bookmark.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
            <button
              onClick={() => setEditing(true)}
              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
            >✏️</button>
            <button
              onClick={() => { if (window.confirm('Delete?')) dispatch(deleteBookmark(bookmark._id)); }}
              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
            >🗑️</button>
          </div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p style={{
            color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {bookmark.tags.slice(0, 4).map(tag => (
              <span key={tag} className="tag-pill">#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, textAlign: 'center', background: color, color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '0.45rem', borderRadius: '6px', textDecoration: 'none' }}
          >
            Visit ↗
          </a>
          <span style={{ color: '#475569', fontSize: '0.75rem', flexShrink: 0 }}>
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '', tags: '' });

  const section = sections.find(s => s._id === sectionId);
  const subsection = subsections.find(s => s._id === subsectionId);
  const color = section?.color || '#6366f1';

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchBookmarks({ subsectionId, search: debouncedSearch }));
  }, [token, subsectionId, debouncedSearch, dispatch, navigate]);

  useEffect(() => {
    dispatch(fetchSections());
    dispatch(fetchSubsections(sectionId));
  }, [sectionId, dispatch]);

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
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0f172a', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#64748b', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}>Vault</button>
          <span>›</span>
          <button onClick={() => navigate(`/section/${sectionId}`)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}>
            {section?.name || 'Section'}
          </button>
          <span>›</span>
          <span style={{ color: '#e2e8f0' }}>{subsection?.name || 'Subsection'}</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button
              onClick={() => navigate(`/section/${sectionId}`)}
              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}
            >←</button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
                {subsection?.name || 'Subsection'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {bookmarks.length} link{bookmarks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{ padding: '0.5rem 1.125rem', background: color, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 12px ${color}50` }}
          >
            + Add Link
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>Add New Link</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <input className="input" placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required autoFocus />
              <input className="input" type="url" placeholder="URL * (https://...)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} required />
              <textarea className="input" rows={2} placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'none' }} />
              <input className="input" placeholder="Tags: ml, tutorial (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.6rem', background: color, border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>Save Link</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none', fontSize: '1rem' }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, description or tag..."
            className="input"
            style={{ paddingLeft: '2.375rem' }}
          />
        </div>

        {/* Bookmarks */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #334155', borderTopColor: color, animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : bookmarks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.125rem' }}>
              {search ? 'No results' : 'No links yet'}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {search ? 'Try a different search' : 'Add your first link above'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {bookmarks.map(b => <BookmarkCard key={b._id} bookmark={b} color={color} />)}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        className="mobile-fab"
        onClick={() => setShowForm(true)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: '52px', height: '52px', borderRadius: '14px',
          background: color, border: 'none', color: '#fff',
          fontSize: '1.5rem', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 50, boxShadow: `0 8px 24px ${color}60`,
          fontFamily: 'inherit',
        }}
      >+</button>
    </div>
  );
}
