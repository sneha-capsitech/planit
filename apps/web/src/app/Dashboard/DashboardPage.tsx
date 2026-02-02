import React from 'react';
import { api, clearToken } from '../../lib/auth/api';
import '../../styles/dashboard.css';
import { NavLink } from 'react-router-dom';
import { FiMoon } from 'react-icons/fi';

type Priority = 'low' | 'medium' | 'high';

type Note = {
  _id: string;
  title: string;
  body: string;
  priority: Priority;
  dueAt: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Dashboard() {
  const [q, setQ] = React.useState('');
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [creating, setCreating] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newBody, setNewBody] = React.useState('');
  const [newPriority, setNewPriority] = React.useState<Priority>('medium');
  const [newDueAt, setNewDueAt] = React.useState('');

  async function load() {
    setLoading(true);
    try {
      const out = await api<{ notes: Note[] }>(`/api/notes${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setNotes(out.notes);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const now = new Date();
  const total = notes.length;
  const completed = notes.filter((n) => n.completed).length;
  const dueToday = notes.filter((n) => n.dueAt && !n.completed && sameDay(new Date(n.dueAt), now)).length;
  const overdue = notes.filter((n) => n.dueAt && !n.completed && new Date(n.dueAt) < now && !sameDay(new Date(n.dueAt), now)).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const recentNotes = notes.slice(0, 5);
  const upcoming = notes
    .filter((n) => n.dueAt && !n.completed)
    .sort((a, b) => (a.dueAt! < b.dueAt! ? -1 : 1))
    .slice(0, 3);

  async function createNote() {
    if (!newTitle.trim()) return;

    const out = await api<{ note: Note }>(`/api/notes`, {
      method: 'POST',
      body: JSON.stringify({
        title: newTitle.trim(),
        body: newBody.trim(),
        priority: newPriority,
        dueAt: newDueAt ? new Date(newDueAt).toISOString() : null,
      }),
    });

    setNotes((p) => [out.note, ...p]);
    setCreating(false);
    setNewTitle('');
    setNewBody('');
    setNewPriority('medium');
    setNewDueAt('');
  }

  return (
    <div className="dash">
      {/* Sidebar */}
      <aside className="side">
        <div className="brand">
          <div className="brandName">PlanIt</div>
          <div className="brandSub">Your calm workspace</div>
        </div>

      <nav className="nav">
  <NavLink
    to="/dashboard"
    className={({ isActive }) => (isActive ? 'navItem navItemActive' : 'navItem')}
  >
    Overview
  </NavLink>

  <NavLink
    to="/notes-board"
    className={({ isActive }) => (isActive ? 'navItem navItemActive' : 'navItem')}
  >
    Notes Board
  </NavLink>

  <NavLink to="/calendar" className="navItem">
    Calendar
  </NavLink>

  <NavLink to="/focus" className="navItem">
    Focus Mode
  </NavLink>

  <NavLink to="/settings" className="navItem">
    Settings
  </NavLink>
</nav>


        <div className="tip">
          <div className="tipTitle">💡 Pro Tip</div>
          <div className="tipText">Use Focus Mode to see only today&apos;s tasks</div>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="searchWrap">
            <span className="searchIcon">🔍</span>
            <input className="search" placeholder="Search notes..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="topActions">
          <button className="nb-icon-btn" title="Theme" aria-label="Theme">
            <FiMoon size={18} />
          </button>

            <button className="addBtn" onClick={() => setCreating(true)}>
              ＋ Add Note
            </button>

            <button
              className="iconBtn"
              aria-label="Logout"
              title="Logout"
              onClick={() => {
                clearToken();
                window.location.href = '/';
              }}
            >
              👤
            </button>
          </div>
        </header>

        <div className="content">
          <div className="h1">Welcome back! 👋</div>
          <div className="hSub">Here&apos;s what&apos;s happening with your tasks</div>

          {/* Stats */}
          <div className="stats">
            <div className="statCard">
              <div className="statIcon">📄</div>
              <div className="statValue">{loading ? '—' : total}</div>
              <div className="statLabel">Total Notes</div>
            </div>

            <div className="statCard">
              <div className="statIcon">✅</div>
              <div className="statValue">{loading ? '—' : completed}</div>
              <div className="statLabel">Completed</div>
            </div>

            <div className="statCard">
              <div className="statIcon">🕒</div>
              <div className="statValue">{loading ? '—' : dueToday}</div>
              <div className="statLabel">Due Today</div>
            </div>

            <div className="statCard">
              <div className="statIcon">⛔</div>
              <div className="statValue">{loading ? '—' : overdue}</div>
              <div className="statLabel">Overdue</div>
            </div>
          </div>

          {/* Progress */}
          <div className="progressCard">
            <div className="progressTop">
              <div>
                <div className="progressTitle">Overall Progress</div>
                <div className="progressSub">Keep up the great work!</div>
              </div>

              <div className="progressRight">
                <div className="progressPct">{progress}%</div>
                <div className="progressLbl">Complete</div>
              </div>
            </div>

            <div className="bar">
              <div className="barFill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Lists */}
          <div className="lists">
            {/* Recent Notes */}
            <div className="listCol">
              <div className="listHead">
                <div className="listTitle">Recent Notes</div>
                <div className="countPill">{Math.min(total, 5)}</div>
              </div>

              {!loading && recentNotes.length === 0 ? (
                <div className="empty">No notes yet.</div>
              ) : (
                recentNotes.map((n) => (
                  <div className="row" key={n._id}>
                    <div className="rowMain">
                      <div className="rowTitle">{n.title}</div>
                      <div className="rowDesc">{n.body}</div>
                    </div>
                    <span className={`pill ${n.priority === 'high' ? 'pillHigh' : n.priority === 'medium' ? 'pillMed' : 'pillLow'}`}>
                      {n.priority}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Upcoming Tasks */}
            <div className="listCol">
              <div className="listHead">
                <div className="listTitle">Upcoming Tasks</div>
                <div className="countPill">{upcoming.length}</div>
              </div>

              {!loading && upcoming.length === 0 ? (
                <div className="empty">No upcoming tasks.</div>
              ) : (
                upcoming.map((n) => (
                  <div className="row" key={n._id}>
                    <div className="rowMain">
                      <div className="rowTitle">{n.title}</div>
                      <div className="rowDesc">📅 {formatDate(n.dueAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Tip */}
          <div className="quickTip">
            <div className="quickTipTitle">💡 Quick Tip</div>
            <div className="quickTipText">
              Use keyboard shortcuts to speed up your workflow. Press <span className="kbd">Ctrl</span> + <span className="kbd">N</span> to create a new note.
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {creating ? (
        <div className="modalOverlay" onMouseDown={() => setCreating(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalTitle">Add Note</div>

            <input className="modalInput" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <textarea className="modalTextarea" placeholder="Description" value={newBody} onChange={(e) => setNewBody(e.target.value)} />

            <div className="modalRow">
              <select className="modalSelect" value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)}>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>

              <input className="modalInput" type="date" value={newDueAt} onChange={(e) => setNewDueAt(e.target.value)} />
            </div>

            <div className="modalActions">
              <button className="btnGhost" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button className="btnPrimary" onClick={createNote}>
                Create
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
