import { useState } from 'react'
import { REPORT_CATEGORIES } from '../../services/reportService.js'

export default function ReportSongModal({ onClose, onSubmit }) {
  const [category, setCategory] = useState(null)
  const [details, setDetails] = useState('')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-[640px] rounded-[16px] border border-[#474747] bg-app-card px-[28px] pb-[24px] pt-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-[6px]">
          <h2 className="text-[24px] font-semibold leading-[36px] text-app-text">Report this song</h2>
          <p className="text-[13px] leading-[20px] text-[#adadad]">
            Tell the moderation team what is wrong with this song entry.
          </p>
        </div>

        <p className="mt-[14px] text-[14px] font-semibold leading-[21px] text-[#ebebeb]">
          Why are you reporting this song?
        </p>
        <div className="mt-[14px] flex flex-wrap gap-[8px]">
          {REPORT_CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`rounded-[8px] border px-[12px] py-[10px] text-left text-[11px] leading-[20px] ${
                category === item.value
                  ? 'border-app-accent bg-app-accent/10 text-app-accent'
                  : 'border-[#4f4f4f] bg-[#303030] text-[#e0e0e0]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-[14px] text-[14px] font-semibold leading-[21px] text-[#ebebeb]">
          Additional details
        </p>
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Describe the issue and include any useful context..."
          className="mt-[14px] h-[116px] w-full resize-none rounded-[8px] border border-[#474747] bg-[#1a1a1a] p-[13px] text-[12px] leading-[20px] text-app-text outline-none placeholder:text-[#878787]"
        />

        <div className="mt-[8px] flex justify-end gap-[12px] pt-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] bg-[#333333] px-[18px] py-[11px] text-[12px] font-semibold leading-[20px] text-[#f0f0f0]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!category}
            onClick={() => onSubmit({ category, details })}
            className="rounded-[8px] bg-[#1cb854] px-[18px] py-[11px] text-[12px] font-semibold leading-[20px] text-[#0a140d] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit report
          </button>
        </div>
      </div>
    </div>
  )
}
