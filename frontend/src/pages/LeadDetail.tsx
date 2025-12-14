import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { leadsApi, tasksApi, notesApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Task, Note } from '../types'

export function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [editStatus, setEditStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [noteText, setNoteText] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [tasksLoading, setTasksLoading] = useState(false)

  const leadId = parseInt(id || '0')

  const { data: leadData, loading, refetch } = useFetch(
    () => leadsApi.get(leadId),
    [leadId]
  )

  // Handle both { data: lead } and direct lead object responses
  const lead = (leadData as any)?.data || leadData

  // Fetch notes and tasks separately
  useEffect(() => {
    if (lead?.id) {
      fetchNotes()
      fetchTasks()
    }
  }, [lead?.id])

  const fetchNotes = async () => {
    try {
      setNotesLoading(true)
      const response = await notesApi.list(leadId)
      const notesList = Array.isArray(response) ? response : (response as any)?.data || []
      setNotes(notesList)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setNotes([])
    } finally {
      setNotesLoading(false)
    }
  }

  const fetchTasks = async () => {
    try {
      setTasksLoading(true)
      const response = await tasksApi.list(leadId)
      const tasksList = Array.isArray(response) ? response : (response as any)?.data || []
      setTasks(tasksList)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setTasksLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!lead) return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
      <p style={{ fontSize: '16px' }}>Lead not found</p>
    </div>
  )

  const handleStatusUpdate = async () => {
    try {
      await leadsApi.update(lead.id, { status: newStatus })
      setEditStatus(false)
      refetch()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (noteText.trim()) {
      try {
        await notesApi.create(lead.id, { body: noteText })
        setNoteText('')
        await fetchNotes()
      } catch (error) {
        console.error('Error adding note:', error)
      }
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (taskTitle.trim()) {
      try {
        await tasksApi.create(lead.id, { title: taskTitle, due_date: '', status: 'open' })
        setTaskTitle('')
        await fetchTasks()
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/leads')}
          style={{ color: '#2563eb', textDecoration: 'none', marginBottom: '24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          ← Back to Leads
        </button>

        {/* Lead Header */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>{lead.title}</h1>
              <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>{lead.company}</p>
            </div>
            <button
              onClick={() => navigate('/leads')}
              style={{ fontSize: '24px', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', padding: '8px', fontWeight: 'bold' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
            >
              ✕
            </button>
          </div>

          {/* Lead Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Contact Name</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>{lead.contact_name}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Email</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#2563eb', margin: 0 }}>{lead.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Phone</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>{lead.phone}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Source</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0, textTransform: 'capitalize' }}>{lead.source?.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Status Section */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Status:</span>
              {editStatus ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                  >
                    <option value="new_lead">New</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditStatus(false)}
                    style={{ backgroundColor: '#e5e7eb', color: '#111827', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1d5db')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#111827', textTransform: 'capitalize' }}>{lead.status?.replace('_', ' ')}</span>
                  <button
                    onClick={() => {
                      setEditStatus(true)
                      setNewStatus(lead.status)
                    }}
                    style={{ color: '#2563eb', fontSize: '13px', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notes and Tasks Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Notes Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Notes</h2>
            <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
              {notes && notes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notes.map((note: Note) => (
                    <div key={note.id} style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #2563eb' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>{note.user.name}</p>
                      <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>{note.body}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#6b7280' }}>No notes yet</p>
              )}
            </div>
            <form onSubmit={handleAddNote}>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '12px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}
              />
              <button
                type="submit"
                style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                Add Note
              </button>
            </form>
          </div>

          {/* Tasks Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Tasks</h2>
            <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
              {tasks && tasks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.map((task: Task) => (
                    <div key={task.id} style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{task.title}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                        <span>{task.user.name}</span>
                        <span style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#6b7280' }}>No tasks yet</p>
              )}
            </div>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Add a task..."
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '12px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              <button
                type="submit"
                style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
