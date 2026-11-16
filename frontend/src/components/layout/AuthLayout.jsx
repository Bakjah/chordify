// Layout 2 kolom untuk Login/Register: panel brand hijau gelap (610px) + area form.
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-auth-bg font-sans text-white">
      <aside className="relative hidden w-[42.36%] max-w-[610px] shrink-0 bg-auth-panel lg:block">
        <div className="px-[70px] pt-[70px]">
          <p className="text-[38px] font-bold leading-[1.45]">CHORDIFY</p>
          <p className="mt-[2px] text-xl text-auth-mint">Your Personal Guitar Chord Library.</p>
        </div>
        <h2 className="absolute left-[70px] top-[330px] text-[42px] font-bold leading-[1.45]">
          Discover songs.
          <br />
          Learn chords.
          <br />
          Play your way.
        </h2>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 xl:justify-start xl:pl-[110px]">
        <div className="w-full max-w-[500px]">{children}</div>
      </main>
    </div>
  )
}
