import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  thumbnail: string | null
  url: string
  year: number
  month: number
  categories: string[]
}

const PLACEHOLDER_COLORS = ['#F2EDE8', '#E8EDF2', '#EDE8F2', '#E8F2ED', '#F2F2E8', '#F2E8E8', '#E8F2F2', '#EEE8F2']

function getPlaceholderColor(id: string): string {
  const idx = parseInt(id, 10) % PLACEHOLDER_COLORS.length
  return PLACEHOLDER_COLORS[idx]
}

export function ProjectCard({ project }: { project: Project }) {
  const { id, title, thumbnail, url, year, month, categories, description } = project
  const dateStr = `${year}.${String(month).padStart(2, '0')}`

  return (
    <a href={url} target='_blank' rel='noopener noreferrer' className='group block'>
      <div
        className='relative w-full h-auto aspect-landscape overflow-hidden mb-3'
        style={{ backgroundColor: getPlaceholderColor(id) }}>
        {thumbnail === 'sdm' ? (
          <div className='w-full h-auto aspect-video relative overflow-hidden bg-gray-50 rounded-md'>
            <iframe
              src='https://player.vimeo.com/video/1151368571?background=1&amp;autoplay=1&amp;muted=1&amp;loop=1&amp;playsinline=1'
              title='Samsung Design Membership 2025 Online Exhibition video'
              frameBorder='0'
              allow='autoplay; fullscreen; picture-in-picture'
              className='absolute left-1/2 top-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none'
              style={{ aspectRatio: '16 / 9' }}></iframe>
          </div>
        ) : thumbnail === 'miraen' ? (
          <div className='w-full h-auto aspect-video relative overflow-hidden bg-gray-50 rounded-md'>
            <iframe
              src='https://player.vimeo.com/video/1151529949?background=1&amp;autoplay=1&amp;muted=1&amp;loop=1&amp;playsinline=1'
              title='XR Science Museum video'
              frameBorder='0'
              allow='autoplay; fullscreen; picture-in-picture'
              className='absolute left-1/2 top-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none'
              style={{ aspectRatio: '16 / 9' }}></iframe>
          </div>
        ) : (
          <img
            src={`/img/${thumbnail}`}
            alt={title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        )}
        {/* <div className='w-full h-full flex items-center justify-center'>
          <span className='text-5xl font-light text-black/10 select-none'>{title[0]}</span>
        </div> */}
      </div>

      <div>
        <div className='flex items-center justify-between mb-1.5'>
          <span className='text-xs text-gray tabular-nums'>{dateStr}</span>
          <span className='text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
              <path
                d='M2 10L10 2M10 2H4M10 2V8'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </span>
        </div>
        <h2 className='text-sm font-medium leading-snug mb-2 line-clamp-2 group-hover:opacity-60 transition-opacity duration-200'>
          {title}
        </h2>
        <p className='text-xs text-neutral-500 break-keep leading-relaxed mb-2 line-clamp-3'>{project.description}</p>
        <div className='flex flex-wrap gap-1'>
          {categories.map((cat) => (
            <span
              key={cat}
              className='text-[10px] tracking-wide uppercase text-gray border border-black/10 px-2 py-0.5'>
              {cat}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
