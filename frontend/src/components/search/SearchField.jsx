// Kotak pencarian yang dipakai bersama oleh top bar, beranda, dan library lagu
// supaya satu gaya input berlaku di seluruh aplikasi.
export default function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder,
  className = '',
  inputClassName = '',
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className={`flex items-center ${className}`}
    >
      <span className="shrink-0 text-app-muted">⌕</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`ml-[10px] w-full bg-transparent text-app-text outline-none placeholder:text-app-muted ${inputClassName}`}
      />
    </form>
  )
}
