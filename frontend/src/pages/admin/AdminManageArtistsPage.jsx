import { useCallback, useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { getErrorMessage } from '../../services/api.js'
import { adminService } from '../../services/adminService.js'

const COLUMNS = [
  { key: 'name', label: 'ARTIST' },
  { key: 'songCount', label: 'SONGS' },
  { key: 'artwork', label: 'ARTWORK' },
  { key: 'bio', label: 'BIO' },
]

const EMPTY_FORM = { name: '', artwork: '', bio: '' }

const FIELD_CLASS =
  'h-[42px] w-full rounded-[8px] bg-app-elevated px-[14px] text-[11px] leading-[20px] text-app-text outline-none placeholder:text-app-muted'

function truncate(value, limit = 28) {
  if (!value) return '-'
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value
}

export default function AdminManageArtistsPage() {
  const [artists, setArtists] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await adminService.listArtists()
      setArtists(data || [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Daftar artis tidak dapat dimuat.'))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        artwork: form.artwork.trim(),
        bio: form.bio.trim(),
      }
      if (editingId === null) {
        await adminService.createArtist(payload)
      } else {
        await adminService.updateArtist(editingId, payload)
      }
      resetForm()
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Artis tidak dapat disimpan.'))
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (artist) => {
    setEditingId(artist.id)
    setForm({
      name: artist.name || '',
      artwork: artist.artwork || '',
      bio: artist.bio || '',
    })
    setError('')
  }

  const remove = async (artist) => {
    if (!window.confirm(`Hapus artis "${artist.name}"?`)) return
    try {
      await adminService.deleteArtist(artist.id)
      if (editingId === artist.id) resetForm()
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Artis tidak dapat dihapus.'))
    }
  }

  const rows = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    songCount: artist.songCount,
    artwork: artist.artwork || '-',
    bio: truncate(artist.bio),
  }))

  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Artists
        </h1>

        <form
          onSubmit={submit}
          className="mt-[20px] w-[1110px] rounded-[12px] bg-app-card p-[24px]"
        >
          <p className="font-mono text-[10px] font-bold leading-[20px] text-app-accent">
            {editingId === null ? 'ADD ARTIST' : 'EDIT ARTIST'}
          </p>
          <div className="mt-[16px] flex gap-[20px]">
            <div className="w-[280px]">
              <label className="text-[11px] leading-[20px] text-app-muted" htmlFor="artist-name">
                Artist name
              </label>
              <input
                id="artist-name"
                className={`${FIELD_CLASS} mt-[6px]`}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="e.g. NOAH"
                required
              />
            </div>
            <div className="w-[160px]">
              <label className="text-[11px] leading-[20px] text-app-muted" htmlFor="artist-artwork">
                Artwork color
              </label>
              <input
                id="artist-artwork"
                className={`${FIELD_CLASS} mt-[6px]`}
                value={form.artwork}
                onChange={(event) => setForm({ ...form, artwork: event.target.value })}
                placeholder="#315a52"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] leading-[20px] text-app-muted" htmlFor="artist-bio">
                Bio
              </label>
              <input
                id="artist-bio"
                className={`${FIELD_CLASS} mt-[6px]`}
                value={form.bio}
                onChange={(event) => setForm({ ...form, bio: event.target.value })}
                placeholder="Short description"
              />
            </div>
          </div>

          <div className="mt-[20px] flex items-center gap-[12px]">
            <button
              type="submit"
              disabled={saving}
              className="h-[40px] w-[150px] rounded-[8px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId === null ? 'Add Artist' : 'Save Changes'}
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
          searchPlaceholder="⌕  Search manage artists..."
          renderActions={(row) => (
            <>
              <button
                type="button"
                onClick={() => startEdit(artists.find((artist) => artist.id === row.id))}
                className="font-mono text-[9px] text-app-accent"
              >
                EDIT
              </button>
              <button
                type="button"
                onClick={() => remove(artists.find((artist) => artist.id === row.id))}
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
