// Wrapper konten aplikasi. `wide` memakai padding yang lebih rapat, dipakai
// halaman Song Detail yang panelnya lebih lebar daripada halaman lain.
export default function PageShell({ children, wide = false }) {
  return <div className={wide ? 'pl-[24px] pr-[30px]' : 'pl-[34px] pr-[60px]'}>{children}</div>
}
