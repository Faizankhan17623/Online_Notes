import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSections, addSection, deleteSection } from '../store/sectionSlice';

const COLORS = ['#4f46e5','#7c3aed','#db2777','#e11d48','#ea580c','#ca8a04','#059669','#0891b2','#0d9488'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sections, loading } = useSelector((s) => s.sections);
  const { token } = useSelector((s) => s.auth);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#4f46e5' });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchSections());
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await dispatch(addSection(form));
    setForm({ name: '', description: '', color: '#4f46e5' });
    setShowForm(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this section and all its content?')) dispatch(deleteSection(id));
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#070d1a' }}>
      <div className="bg-orb w-96 h-96" style={{ background: 'rgba(79,70,229,0.12)', top: '-80px', right: '-80px' }} />
      <div className="bg-orb w-72 h-72" style={{ background: 'rgba(124,58,237,0.08)', bottom: '0', left: '-40px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">My Vault</h1>
            <p className="text-slate-500 text-sm mt-0.5">{sections.length} section{sections.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
            + New Section
          </button>
        </div>

        {/* Create section form */}
        {showForm && (
          <div className="glass-card p-5 mb-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <h3 className="text-white font-semibold mb-4">Create New Section</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input className="input" placeholder="Section name (e.g. Machine Learning)" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required autoFocus />
              <input className="input" placeholder="Description (optional)" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
              <div>
                <p className="text-slate-500 text-xs mb-2">Pick a color</p>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                      style={{ background: c, outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <button type="submit"
                  className="flex-1 text-white text-sm font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                  Create Section
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 text-slate-400 text-sm py-2.5 rounded-xl transition-colors hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sections grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-9 h-9 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>📚</div>
            <div>
              <p className="text-white font-semibold text-lg">No sections yet</p>
              <p className="text-slate-500 text-sm mt-1">Create a section to start organising your links</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map(section => (
              <div key={section._id} onClick={() => navigate(`/section/${section._id}`)}
                className="cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group"
                style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(148,163,184,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = section.color + '60'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'}>

                {/* Top color bar */}
                <div style={{ height: '4px', background: section.color }} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                      style={{ background: section.color + '25', border: `1px solid ${section.color}40` }}>
                      {section.name[0].toUpperCase()}
                    </div>
                    <button onClick={(e) => handleDelete(e, section._id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-red-400"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>🗑️</button>
                  </div>

                  <h3 className="text-white font-semibold text-base mb-1 leading-tight">{section.name}</h3>
                  {section.description && (
                    <p className="text-slate-500 text-xs mb-3 line-clamp-2">{section.description}</p>
                  )}

                  <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xs" style={{ color: section.color }}>
                      {section.subsectionCount} subsection{section.subsectionCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{section.bookmarkCount} link{section.bookmarkCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
