import React from 'react';
import { api, clearToken } from '../../lib/auth/api';
import {
  FiSearch,
  FiPlus,
  FiGrid,
  FiList,
  FiFilter,
  FiChevronDown,
  FiX,
  FiMoon,
} from 'react-icons/fi';
import { BsPinAngle, BsPencil, BsTrash } from 'react-icons/bs';
import { motion } from 'framer-motion';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import '../../styles/notesboard.css';

type Priority = 'low' | 'medium' | 'high';
type NoteColor = 'yellow' | 'purple' | 'mint' | 'blue' | 'peach';

type Note = {
  _id: string;
  title: string;
  body: string;
  priority: Priority;
  dueAt: string | null;
  completed: boolean;
  color: NoteColor;
  tags: string[];
  pinned: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
};

const COLOR_OPTIONS: { key: NoteColor; css: string }[] = [
  { key: 'yellow', css: 'nb-color-yellow' },
  { key: 'purple', css: 'nb-color-purple' },
  { key: 'mint', css: 'nb-color-mint' },
  { key: 'blue', css: 'nb-color-blue' },
  { key: 'peach', css: 'nb-color-peach' },
];

const TEMPLATE_PRESETS = [
  { label: 'Meeting', title: 'Team Meeting', tags: ['work', 'meeting'], priority: 'high' as Priority, color: 'blue' as NoteColor },
  { label: 'Groceries', title: 'Buy groceries', tags: ['shopping'], priority: 'medium' as Priority, color: 'mint' as NoteColor },
  { label: 'Workout', title: 'Gym session', tags: ['health'], priority: 'medium' as Priority, color: 'purple' as NoteColor },
  { label: 'Study', title: 'Read chapter 5', tags: ['study'], priority: 'low' as Priority, color: 'yellow' as NoteColor },
];

function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** ✅ Sortable Note Card (Trello-like) */
function SortableNoteCard({
  n,
  onPin,
  onEdit,
  onDelete,
}: {
  n: Note;
  onPin: (n: Note) => void;
  onEdit: (n: Note) => void;
  onDelete: (n: Note) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: n._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`nb-note ${COLOR_OPTIONS.find((x) => x.key === n.color)?.css ?? 'nb-color-yellow'} ${isDragging ? 'nb-note-dragging' : ''}`}
    >
      {/* drag handle is top area */}
      <div className="nb-note-top" {...attributes} {...listeners}>
        <div className="nb-note-title">
          <span className={n.completed ? 'nb-strike' : ''}>{n.title}</span>
          <div className="nb-note-sub">{n.body}</div>
        </div>

        <div className="nb-check" title="Dragg">
          <span>⋮⋮</span>
        </div>
      </div>

      <div className="nb-divider" />

      <div className="nb-tags">
        {(n.tags ?? []).slice(0, 3).map((t) => (
          <span key={t} className="nb-tag">
            #{t}
          </span>
        ))}
      </div>

      <div className="nb-note-footer">
        <span className={`nb-priority nb-priority-${n.priority}`}>{n.priority}</span>

        {n.dueAt ? <span className="nb-date">📅 {formatDate(n.dueAt)}</span> : <span />}

        {/* hover actions */}
        <div className="nb-actions">
          <button className="nb-act" title="Pin" onClick={() => onPin(n)}>
            <BsPinAngle />
          </button>
          <button className="nb-act" title="Edit" onClick={() => onEdit(n)}>
            <BsPencil />
          </button>
          <button className="nb-act nb-danger" title="Delete" onClick={() => onDelete(n)}>
            <BsTrash />
          </button>
        </div>
      </div>

      {n.pinned ? <div className="nb-pin-dot">📌</div> : null}
    </motion.div>
  );
}

export default function NotesBoardPage() {
  const [q, setQ] = React.useState('');
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Note | null>(null);

  // form state
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [color, setColor] = React.useState<NoteColor>('yellow');
  const [priority, setPriority] = React.useState<Priority>('medium');
  const [dueAt, setDueAt] = React.useState<string>('');
  const [tagInput, setTagInput] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  // DnD sensors (prevents accidental drag on click)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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

  function openNew() {
    setEditing(null);
    setTitle('');
    setBody('');
    setColor('yellow');
    setPriority('medium');
    setDueAt('');
    setTags([]);
    setTagInput('');
    setModalOpen(true);
  }

  function openEdit(n: Note) {
    setEditing(n);
    setTitle(n.title ?? '');
    setBody(n.body ?? '');
    setColor(n.color ?? 'yellow');
    setPriority(n.priority ?? 'medium');
    setDueAt(n.dueAt ? new Date(n.dueAt).toISOString().slice(0, 10) : '');
    setTags(n.tags ?? []);
    setTagInput('');
    setModalOpen(true);
  }

  function applyTemplate(label: string) {
    const t = TEMPLATE_PRESETS.find((x) => x.label === label);
    if (!t) return;
    setTitle(t.title);
    setTags(t.tags);
    setPriority(t.priority);
    setColor(t.color);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (!t) return;
    if (tags.includes(t)) return setTagInput('');
    setTags((p) => [...p, t]);
    setTagInput('');
  }

  async function saveNote() {
    if (!title.trim()) return;

    if (!editing) {
      const out = await api<{ note: Note }>(`/api/notes`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          color,
          priority,
          dueAt: dueAt ? new Date(dueAt).toISOString() : null,
          tags,
          pinned: false,
          // order will be set in backend
        }),
      });

      setNotes((p) => [out.note, ...p]);
      setModalOpen(false);
      return;
    }

    const out = await api<{ note: Note }>(`/api/notes/${editing._id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        color,
        priority,
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        tags,
      }),
    });

    setNotes((p) => p.map((x) => (x._id === editing._id ? out.note : x)));
    setModalOpen(false);
  }

  async function togglePin(n: Note) {
    const out = await api<{ note: Note }>(`/api/notes/${n._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ pinned: !n.pinned }),
    });
    setNotes((p) => p.map((x) => (x._id === n._id ? out.note : x)));
  }

  async function deleteNote(n: Note) {
    await api<{ ok: boolean }>(`/api/notes/${n._id}`, { method: 'DELETE' });
    setNotes((p) => p.filter((x) => x._id !== n._id));
  }

  // ✅ Persist order (debounced)
  const persistTimer = React.useRef<number | null>(null);
  const persistOrder = (next: Note[]) => {
    if (persistTimer.current) window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(async () => {
      try {
        await api<{ ok: boolean }>(`/api/notes/reorder`, {
          method: 'PATCH',
          body: JSON.stringify({ orderIds: next.map((x) => x._id) }),
        });
      } catch {
        // optional toast
      }
    }, 250);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setNotes((prev) => {
      const oldIndex = prev.findIndex((x) => x._id === String(active.id));
      const newIndex = prev.findIndex((x) => x._id === String(over.id));
      if (oldIndex < 0 || newIndex < 0) return prev;

      const next = arrayMove(prev, oldIndex, newIndex);
      persistOrder(next);
      return next;
    });
  };

  const count = notes.length;

  return (
    <div className="nb-root">
      {/* Topbar */}
      <header className="nb-topbar">
        <div className="nb-top-search">
          <FiSearch />
          <input placeholder="Search notes..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="nb-top-actions">
          <button className="nb-icon-btn" title="Theme" aria-label="Theme">
            <FiMoon size={18} />
          </button>

          <button className="nb-primary-btn" onClick={openNew}>
            <FiPlus /> Add Note
          </button>

          <button
            className="nb-icon-btn"
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

      {/* Title */}
      <div className="nb-container">
        <div className="nb-title">
          <h1>Notes Board</h1>
          <p>Your thoughts, organized your way</p>
        </div>

        {/* Toolbar */}
        <div className="nb-toolbar">
          <div className="nb-pill">{count} notes</div>
          <button className="nb-icon-pill" type="button">
            <FiFilter /> <span>All Notes</span> <FiChevronDown />
          </button>

          <button className="nb-icon-pill" type="button">
            <span>No grouping</span> <FiChevronDown />
          </button>

          <div className="nb-spacer" />

          <div className="nb-view-toggle">
            <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} title="Grid">
              <FiGrid />
            </button>
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} title="List">
              <FiList />
            </button>
          </div>
        </div>

        {/* Notes */}
        {loading ? (
          <div className="nb-empty">Loading…</div>
        ) : notes.length === 0 ? (
          <div className="nb-empty">No notes yet.</div>
        ) : view === 'list' ? (
          // list mode without drag (simple)
          <div className="nb-list">
            {notes.map((n) => (
              <div key={n._id} className={`nb-note ${COLOR_OPTIONS.find((x) => x.key === n.color)?.css ?? 'nb-color-yellow'}`}>
                <div className="nb-note-top">
                  <div className="nb-note-title">
                    <span className={n.completed ? 'nb-strike' : ''}>{n.title}</span>
                    <div className="nb-note-sub">{n.body}</div>
                  </div>
                  <div className="nb-check">
                    <span>✓</span>
                  </div>
                </div>

                <div className="nb-divider" />
                <div className="nb-tags">
                  {(n.tags ?? []).slice(0, 3).map((t) => (
                    <span key={t} className="nb-tag">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="nb-note-footer">
                  <span className={`nb-priority nb-priority-${n.priority}`}>{n.priority}</span>
                  {n.dueAt ? <span className="nb-date">📅 {formatDate(n.dueAt)}</span> : <span />}
                  <div className="nb-actions" style={{ opacity: 1, transform: 'none' }}>
                    <button className="nb-act" title="Pin" onClick={() => togglePin(n)}><BsPinAngle /></button>
                    <button className="nb-act" title="Edit" onClick={() => openEdit(n)}><BsPencil /></button>
                    <button className="nb-act nb-danger" title="Delete" onClick={() => deleteNote(n)}><BsTrash /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ✅ grid mode with Trello-like drag reorder
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={notes.map((n) => n._id)} strategy={rectSortingStrategy}>
              <motion.div layout className="nb-grid">
                {notes.map((n) => (
                  <SortableNoteCard key={n._id} n={n} onPin={togglePin} onEdit={openEdit} onDelete={deleteNote} />
                ))}
              </motion.div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Floating + */}
      <button className="nb-fab" onClick={openNew} title="New Note">
        <FiPlus />
      </button>

      {/* Modal */}
      {modalOpen ? (
        <div className="nb-modal-overlay" onMouseDown={() => setModalOpen(false)}>
          <div className="nb-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="nb-modal-head">
              <div className="nb-modal-title">{editing ? 'Edit Note' : 'New Note'}</div>
              <button className="nb-close" onClick={() => setModalOpen(false)} title="Close">
                <FiX />
              </button>
            </div>

            <div className="nb-modal-body">
              <div className="nb-templates">
                <div className="nb-label">Quick templates:</div>
                <div className="nb-template-row">
                  {TEMPLATE_PRESETS.map((t) => (
                    <button key={t.label} className="nb-chip" onClick={() => applyTemplate(t.label)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="nb-form">
                <div className="nb-field">
                  <label>Title *</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter note title..." />
                </div>

                <div className="nb-field">
                  <label>Description</label>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add more details..." />
                </div>

                <div className="nb-field">
                  <label>Color</label>
                  <div className="nb-colors">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.key}
                        className={`nb-color-dot ${c.css} ${color === c.key ? 'active' : ''}`}
                        onClick={() => setColor(c.key)}
                        title={c.key}
                      />
                    ))}
                  </div>
                </div>

                <div className="nb-row2">
                  <div className="nb-field">
                    <label>Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div className="nb-field">
                    <label>Due Date</label>
                    <input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
                  </div>
                </div>

                <div className="nb-rowTags">
                  <div className="nb-field" style={{ flex: 1 }}>
                    <label>Tags</label>
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag..." />
                  </div>
                  <button className="nb-addTag" onClick={addTag}>
                    Add
                  </button>
                </div>

                {tags.length ? (
                  <div className="nb-taglist">
                    {tags.map((t) => (
                      <span key={t} className="nb-tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="nb-modal-footer">
              <button className="nb-btnGhost" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="nb-btnPrimary" onClick={saveNote}>
                {editing ? 'Save' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
