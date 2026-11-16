import Button from '../../components/ui/Button.jsx'
import HeroVisual from '../../components/landing/HeroVisual.jsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

// Figma: Desktop / 00 Welcome Landing (node 64:2)
export default function WelcomeLandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-chord-bg text-chord-text">
      <header className="border-b border-chord-border">
        <div className="mx-auto flex h-24 max-w-[1440px] items-start justify-between px-6 pt-8 md:px-12">
          <div>
            <p className="text-2xl font-bold leading-[1.2]">CHORDIFY</p>
            <span className="mt-[7px] block h-[3px] w-8 rounded-sm bg-chord-green" />
          </div>
          <p className="hidden pt-2 text-[10px] font-semibold tracking-wide text-chord-muted md:block xl:mr-[300px]">
            PLAY • CREATE • CONNECT
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 items-start justify-between gap-8 px-6 pb-16 pt-16 md:px-12 lg:pl-[88px] lg:pr-0 lg:pt-[122px]">
        <section className="max-w-[650px]">
          <p className="text-xs font-bold tracking-wide text-chord-green">YOUR MUSIC. YOUR COMMUNITY.</p>

          <h1 className="mt-[26px] text-[40px] font-bold leading-[1.2] sm:text-[52px] lg:text-[64px]">
            Find your sound.
            <br />
            Play it your way.
          </h1>

          <p className="mt-6 max-w-[590px] text-lg leading-[1.25] text-chord-muted">
            Discover songs, explore chords, and share your music with a community that plays together.
          </p>

          <div className="mt-[66px] flex flex-wrap items-center gap-4">
            <Button to={ROUTES.SONGS} variant="primary" className="w-[176px] !px-0">
              Try Now&nbsp;&nbsp;→
            </Button>
            <Button to={ROUTES.LOGIN} variant="secondary" className="w-[132px] !px-0 text-[15px]">
              Sign in
            </Button>
          </div>

          <p className="mt-8 text-sm text-chord-muted">
            New to Chordify?&nbsp;&nbsp;
            <Link to={ROUTES.REGISTER} className="font-semibold text-chord-green hover:underline">
              Sign up
            </Link>
          </p>

          <p className="mt-[30px] text-xs text-chord-muted">
            No account needed. Jump straight into discovery as a guest.
          </p>
        </section>

        <HeroVisual />
      </main>

      <footer className="mx-auto w-full max-w-[1440px] px-6 pb-12 md:px-12 lg:pl-[88px]">
        <p className="whitespace-pre text-[10px] text-chord-muted">
          © 2026 CHORDIFY{'     •     '}MADE FOR THE LOVE OF MUSIC
        </p>
      </footer>
    </div>
  )
}
