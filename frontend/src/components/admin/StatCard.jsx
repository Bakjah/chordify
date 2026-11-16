// Kartu statistik admin: angka besar + label kecil.
export default function StatCard({ value, label }) {
  return (
    <div className="relative h-[105px] w-[200px] rounded-[12px] bg-app-card">
      <p className="absolute left-[18px] top-[20px] text-[25px] font-bold leading-[36px] text-app-text">
        {value}
      </p>
      <p className="absolute left-[18px] top-[65px] text-[11px] leading-[20px] text-app-muted">
        {label}
      </p>
    </div>
  )
}
