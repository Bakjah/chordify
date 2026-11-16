import { useCallback, useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { getErrorMessage } from '../../services/api.js'
import { adminService } from '../../services/adminService.js'

const COLUMNS = [
  { key: 'name', label: 'GENRE' },
  { key: 'songCount', label: 'SONGS' },
]

const FIELD_CLASS =
  'h-[42px] w-full rounded-[8px] bg-app-elevated px-[14px] text-[11px] leading-[20px] text-app-text outline-none placeholder:text-app-muted'

export default function AdminManageGenresPage() {
  const [genres, setGenres] = useState([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await adminService.listGenres()
      setGenres(data || [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Daftar genre tidak dapat dimuat.'))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const resetForm = () => {
    setName('')
    setEditingId(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { name: name.trim() }
      if (editingId === null) {
        await adminService.createGenre(payload)
      } else {
        await adminService.updateGenre(editingId, payload)
      }
      resetForm()
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Genre tidak dapat disimpan.'))
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (genre) => {
    setEditingId(genre.id)
    setName(genre.name || '')
    setError('')
  }

  const remove = async (genre) => {
    if (!window.confirm(`Hapus genre "${genre.name}"?`)) return
    try {
      await adminService.deleteGenre(genre.id)
      if (editingId === genre.id) resetForm()
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Genre tidak dapat dihapus.'))
    }
  }

  const rows = genres.map((genre) => ({
    id: genre.id,
    name: genre.name,
    songCount: genre.songCount,
  }))

  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Genres
        </h1>

        <form
          onSubmit={submit}
          className="mt-[20px] w-[1110px] rounded-[12px] bg-app-card p-[24px]"
        >
          <p className="font-mono text-[10px] font-bold leading-[20px] text-app-accent">
            {editingId === null ? 'ADD GENRE' : 'EDIT GENRE'}
          </p>
          <div className="mt-[16px] flex gap-[20px]">
            <div className="w-[280px]">
              <label className="text-[11px] leading-[20px] text-app-muted" htmlFor="genre-name">
                Genre name
              </label>
              <input
                id="genre-name"
                className={`${FIELD_CLASS} mt-[6px]`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Pop Rock"
                required
              />
            </div>
          </div>

          <div className="mt-[20px] flex items-center gap-[12px]">
            <button
              type="submit"
              disabled={saving}
              className="h-[40px] w-[150px] rounded-[8px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId === null ? 'Add Genre' : 'Save Changes'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="h-[40px] w-[110px] rounded-[8px] bg-app-elevated text-[12px] font-medium leading-[20px] text-app-text"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="mt-[12px] text-[12px] leading-[20px] text-[#ef4444]">{error}</p>}

        <AdminTable
          columns={COLUMNS}
          rows={rows}
          searchPlaceholder="⌕  Search manage genres..."
          renderActions={(row) => (
            <>
              <button
                type="button"
                onClick={() => startEdit(genres.find((genre) => genre.id === row.id))}
                className="font-mono text-[9px] text-app-accent"
              >
                EDIT
              </button>
              <button
                type="button"
                onClick={() => remove(genres.find((genre) => genre.id === row.id))}
                className="font-mono text-[9px] text-[#ef4444]"
              >
                DELETE
              </button>
            </>
          )}
        />
      </div>
    </PageShell>
  )
}
