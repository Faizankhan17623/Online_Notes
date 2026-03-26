import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSections, addSection, deleteSection } from '../store/sectionSlice';
import { fetchDirectLinks, addDirectLink, updateBookmark, deleteBookmark } from '../store/bookmarkSlice';

const COLORS = ['#6366f1','#7c3aed','#db2777','#e11d48','#ea580c','#ca8a04','#059669','#0891b2','#0d9488'];

function SectionCard({ section, onNavigate, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1e293b',
        border: `1px solid ${hovered ? section.color : '#334155'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div style={{ height: '4px', background: section.color }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: section.color + '22', border: `1px solid ${section.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: section.color, fontSize: '1.1rem', flexShrink: 0,
          }}>
            {section.name[0].toUpperCase()}
          </div>
          {hovered && (
            <button
              onClick={onDelete}
              style={{
                width: '28px', height: '28px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px',
                cursor: 'pointer', fontSize: '0.8rem',
              }}
            >🗑️</button>
          )}
        </div>
        <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem', marginBottom: '0.375rem' }}>
          {section.name}
        </h3>
        {section.description && (
          <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem',
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {section.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #334155' }}>
          <span style={{ color: section.color, fontSize: '0.8rem', fontWeight: 500 }}>
            {section.subsectionCount} subsection{section.subsectionCount !== 1 ? 's' : ''}
          </span>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>·</span>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
            {section.bookmarkCount} link{section.bookmarkCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({ link }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: link.title, url: link.url,
    description: link.description, tags: link.tags.join(', '),
  });

  useEffect(() => {
    if (!editing) setForm({ title: link.title, url: link.url, description: link.description, tags: link.tags.join(', ') });
  }, [link, editing]);

  const handleSave = () => {
    dispatch(updateBookmark({ id: link._id, ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }));
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ background: '#1e293b', border: '1px solid #6366f1', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" />
        <input className="input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" />
        <textarea className="input" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" style={{ resize: 'none' }} />
        <input className="input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} style={{ flex: 1, padding: '0.5rem', background: '#6366f1', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
          <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '3px', background: '#6366f1', flexShrink: 0 }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {link.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
            <button onClick={() => setEditing(true)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>✏️</button>
            <button onClick={() => { if (window.confirm('Delete this link?')) dispatch(deleteBookmark(link._id)); }} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
          </div>
        </div>
        {link.description && (
          <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {link.description}
          </p>
        )}
        {link.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {link.tags.slice(0, 4).map(tag => <span key={tag} className="tag-pill">#{tag}</span>)}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
          <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', background: '#6366f1', color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '0.45rem', borderRadius: '6px', textDecoration: 'none' }}>
            Visit ↗
          </a>
          <span style={{ color: '#475569', fontSize: '0.75rem', flexShrink: 0 }}>
            {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sections, loading } = useSelector((s) => s.sections);
  const { directLinks, directLoading } = useSelector((s) => s.bookmarks);
  const { token } = useSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState('sections');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1' });
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkForm, setLinkForm] = useState({ title: '', url: '', description: '', tags: '' });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchSections());
  }, [token]);

  useEffect(() => {
    if (activeTab === 'links') dispatch(fetchDirectLinks());
  }, [activeTab]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await dispatch(addSection(form));
    setForm({ name: '', description: '', color: '#6366f1' });
    setShowForm(false);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!linkForm.title.trim() || !linkForm.url.trim()) return;
    await dispatch(addDirectLink({
      ...linkForm,
      tags: linkForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    }));
    setLinkForm({ title: '', url: '', description: '', tags: '' });
    setShowLinkForm(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this section and all its content?')) dispatch(deleteSection(id));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setShowLinkForm(false);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0f172a', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>My Vault</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {activeTab === 'sections'
                ? `${sections.length} section${sections.length !== 1 ? 's' : ''}`
                : `${directLinks.length} quick link${directLinks.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => activeTab === 'sections' ? setShowForm(true) : setShowLinkForm(true)}
            style={{
              padding: '0.5rem 1.125rem',
              background: '#6366f1',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
            }}
          >
            {activeTab === 'sections' ? '+ New Section' : '+ Add Link'}
          </button>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex', background: '#1e293b', border: '1px solid #334155',
          borderRadius: '10px', padding: '4px', marginBottom: '1.75rem', width: 'fit-content',
        }}>
          <button
            onClick={() => switchTab('sections')}
            style={{
              padding: '0.4rem 1.125rem',
              background: activeTab === 'sections' ? '#6366f1' : 'transparent',
              border: 'none', borderRadius: '7px',
              color: activeTab === 'sections' ? '#fff' : '#64748b',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            📁 Sections
          </button>
          <button
            onClick={() => switchTab('links')}
            style={{
              padding: '0.4rem 1.125rem',
              background: activeTab === 'links' ? '#6366f1' : 'transparent',
              border: 'none', borderRadius: '7px',
              color: activeTab === 'links' ? '#fff' : '#64748b',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            🔗 Quick Links
          </button>
        </div>

        {/* ── SECTIONS TAB ── */}
        {activeTab === 'sections' && (
          <>
            {showForm && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
                <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
                  Create New Section
                </h3>
                <form onSubmit={handleCreate}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <input className="input" placeholder="Section name (e.g. Machine Learning)" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required autoFocus />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <input className="input" placeholder="Description (optional)" value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.625rem' }}>Pick a color</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {COLORS.map(c => (
                        <button
                          key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                          style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: c, border: 'none', cursor: 'pointer',
                            outline: form.color === c ? `3px solid ${c}` : '3px solid transparent',
                            outlineOffset: '2px',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" style={{
                      flex: 1, padding: '0.6rem', background: form.color, border: 'none',
                      borderRadius: '6px', color: '#fff', fontSize: '0.875rem',
                      fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      Create Section
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={{
                      flex: 1, padding: '0.6rem', background: '#0f172a',
                      border: '1px solid #334155', borderRadius: '6px',
                      color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #334155', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.125rem' }}>No sections yet</p>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Create your first section to start organising links
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {sections.map(section => (
                  <SectionCard
                    key={section._id}
                    section={section}
                    onNavigate={() => navigate(`/section/${section._id}`)}
                    onDelete={(e) => handleDelete(e, section._id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── QUICK LINKS TAB ── */}
        {activeTab === 'links' && (
          <>
            {showLinkForm && (
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>Add Quick Link</h3>
                <form onSubmit={handleAddLink} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <input className="input" placeholder="Title *" value={linkForm.title}
                    onChange={e => setLinkForm({ ...linkForm, title: e.target.value })} required autoFocus />
                  <input className="input" type="url" placeholder="URL * (https://...)" value={linkForm.url}
                    onChange={e => setLinkForm({ ...linkForm, url: e.target.value })} required />
                  <textarea className="input" rows={2} placeholder="Description (optional)" value={linkForm.description}
                    onChange={e => setLinkForm({ ...linkForm, description: e.target.value })} style={{ resize: 'none' }} />
                  <input className="input" placeholder="Tags: ml, tutorial (comma separated)" value={linkForm.tags}
                    onChange={e => setLinkForm({ ...linkForm, tags: e.target.value })} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button type="submit" style={{ flex: 1, padding: '0.6rem', background: '#6366f1', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Save Link
                    </button>
                    <button type="button" onClick={() => setShowLinkForm(false)} style={{ flex: 1, padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {directLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #334155', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : directLinks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.125rem' }}>No quick links yet</p>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Save a link directly without creating a section
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {directLinks.map(link => <QuickLinkCard key={link._id} link={link} />)}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
