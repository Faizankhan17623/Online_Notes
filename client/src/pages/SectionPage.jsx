import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSubsections, addSubsection, deleteSubsection } from '../store/subsectionSlice';
import { fetchSections } from '../store/sectionSlice';

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

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchSubsections(sectionId));
    if (sections.length === 0) dispatch(fetchSections());
  }, [token, sectionId]);

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

  const color = section?.color || '#4f46e5';

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#070d1a' }}>
      <div className="bg-orb w-80 h-80" style={{ background: color + '18', top: '-60px', right: '-60px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Breadcrumb + header */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Vault</button>
          <span>›</span>
          <span className="text-white font-medium">{section?.name || 'Section'}</span>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>←</button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{section?.name || 'Section'}</h1>
              <p className="text-slate-500 text-sm">{subsections.length} subsection{subsections.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: color, boxShadow: `0 4px 16px ${color}50` }}>
            + New Subsection
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="glass-card p-5 mb-6">
            <h3 className="text-white font-semibold mb-3">New Subsection</h3>
            <form onSubmit={handleCreate} className="flex gap-2">
              <input className="input flex-1" placeholder="e.g. Week 1 — Neural Networks, 2024-03-01..."
                value={name} onChange={e => setName(e.target.value)} required autoFocus />
              <button type="submit"
                className="px-4 py-2 text-white text-sm font-semibold rounded-xl transition-opacity hover:opacity-90 shrink-0"
                style={{ background: color }}>Add</button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-400 text-sm rounded-xl transition-colors hover:text-white shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            </form>
          </div>
        )}

        {/* Subsections list */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-9 h-9 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: color }} />
          </div>
        ) : subsections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: color + '15', border: `1px solid ${color}30` }}>📂</div>
            <div>
              <p className="text-white font-semibold text-lg">No subsections yet</p>
              <p className="text-slate-500 text-sm mt-1">Add a subsection like a topic or date</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subsections.map(sub => (
              <div key={sub._id} onClick={() => navigate(`/section/${sectionId}/sub/${sub._id}`)}
                className="cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 group"
                style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(148,163,184,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color + '50'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'}>

                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: color + '20', border: `1px solid ${color}35` }}>
                    <span className="text-base">📁</span>
                  </div>
                  <button onClick={(e) => handleDelete(e, sub._id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-red-400"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>🗑️</button>
                </div>

                <h3 className="text-white font-semibold text-sm mb-1 leading-snug">{sub.name}</h3>
                <p className="text-xs mt-2" style={{ color: color }}>
                  {sub.bookmarkCount} link{sub.bookmarkCount !== 1 ? 's' : ''}
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
