import { Link } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import { CONTRIBUTIONS, CONTRIBUTION_STATS } from '../../constants/mockLibrary.js'
import { ROUTES } from '../../constants/routes.js'

export default function MyContributionsPage() {
  return (
    <PageShell>
      <div className="relative mt-[28px] pb-16">
        <h1 className="text-[34px] font-bold leading-[46px] text-app-text">My Contributions</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Manage the songs you've shared with the community.
        </p>

        <Link
          to={ROUTES.ADD_SONG}
          className="absolute right-0 top-[29px] flex h-[46px] w-[220px] items-center justify-center rounded-[10px] bg-app-accent text-[13px] font-bold text-app-bg"
        >
          +&nbsp; Add New Song
        </Link>

        <div className="mt-[35px] flex gap-[20px]">
          {CONTRIBUTION_STATS.map((stat) => (
            <div
              key={stat.label}
              className="relative h-[95px] w-[210px] rounded-[12px] bg-app-card"
            >
              <p className="absolute left-[20px] top-[15px] text-[28px] font-bold leading-[41px] text-app-text">
                {stat.value}
              </p>
              <p className="absolute left-[20px] top-[55px] text-[11px] leading-[20px] text-app-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-[45px] text-[20px] font-bold leading-[29px] text-app-text">
          Your submitted songs
        </h2>

        <div className="mt-[16px] flex flex-col gap-[19px]">
          {CONTRIBUTIONS.map((item) => (
            <div
              key={item.id}
              className="relative h-[86px] w-[1110px] rounded-[10px] bg-app-card"
            >
              <p className="absolute left-[22px] top-[17px] text-[15px] font-semibold leading-[22px] text-app-text">
                {item.title}
              </p>
              <p className="absolute left-[22px] top-[45px] text-[11px] leading-[20px] text-app-muted">
                {item.added}
              </p>

              <div className="absolute left-[630px] top-[25px] h-[30px] w-[100px] rounded-[15px] bg-[#183c29]">
                <p className="font-mono text-[9px] font-bold leading-[20px] text-app-accent">
                  <span className="ml-[16px]">{item.status}</span>
                </p>
              </div>

              <div className="absolute right-[30px] top-[35px] flex gap-[26px] text-[11px] font-medium leading-[20px] text-app-muted">
                <Link to={ROUTES.EDIT_SONG(item.id)} className="hover:text-app-text">
                  Edit
                </Link>
                <button type="button" className="hover:text-app-text">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
