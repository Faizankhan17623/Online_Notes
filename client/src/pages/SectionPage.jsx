import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSubsections, addSubsection, deleteSubsection } from '../store/subsectionSlice';
import { fetchSections } from '../store/sectionSlice';

function SubsectionCard({ sub, color, onNavigate, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1e293b',
        border: `1px solid ${hovered ? color : '#334155'}`,
        borderRadius: '10px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '8px',
          background: color + '22', border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
        }}>📁</div>
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

      <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
        {sub.name}
      </h3>
      <p style={{ color: color, fontSize: '0.8rem', fontWeight: 500 }}>
        {sub.bookmarkCount} link{sub.bookmarkCount !== 1 ? 's' : ''}
      </p>
      <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
        {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  );
}

export default function SectionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const { subsections, loading } = useSelector((s) => s.subsections);
  const { sections } = useSelector((s) => s.sections);
  const { token } = useSelector((s) => s.auth);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const section = sections.find(s => s._id === sectionId);
  const color = section?.color || '#6366f1';

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchSubsections(sectionId));
    dispatch(fetchSections());
  }, [token, sectionId, dispatch, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await dispatch(addSubsection({ name, sectionId }));
    setName('');
    setShowForm(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this subsection and all its bookmarks?')) dispatch(deleteSubsection(id));
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0f172a', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}>
            Vault
          </button>
          <span>›</span>
          <span style={{ color: '#e2e8f0' }}>{section?.name || 'Section'}</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: '#1e293b',
                border: '1px solid #334155', borderRadius: '8px',
                color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0,
              }}
            >←</button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
                {section?.name || 'Section'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {subsections.length} subsection{subsections.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.5rem 1.125rem', background: color, border: 'none',
              borderRadius: '8px', color: '#fff', fontSize: '0.875rem',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: `0 4px 12px ${color}50`,
            }}
          >
            + New Subsection
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              New Subsection
            </h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="input"
                placeholder="e.g. Week 1 — Neural Networks..."
                value={name}
                onChange={e => setName(e.target.value)}
                required autoFocus
                style={{ flex: 1 }}
              />
              <button type="submit" style={{
                padding: '0.6rem 1rem', background: color, border: 'none',
                borderRadius: '6px', color: '#fff', fontWeight: 600,
                fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>Add</button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                padding: '0.6rem 1rem', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '6px',
                color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>Cancel</button>
            </form>
          </div>
        )}

        {/* Subsections */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '3px solid #334155', borderTopColor: color,
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        ) : subsections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
            <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.125rem' }}>No subsections yet</p>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Add a subsection to organise your links
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {subsections.map(sub => (
              <SubsectionCard
                key={sub._id}
                sub={sub}
                color={color}
                onNavigate={() => navigate(`/section/${sectionId}/sub/${sub._id}`)}
                onDelete={(e) => handleDelete(e, sub._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
