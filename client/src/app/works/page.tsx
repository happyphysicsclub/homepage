import data from '@/data/projects.json'
import { ProjectCard } from './ProjectCard'

export const metadata = {
  title: 'Works',
  description: 'Projects by happyphysicsclub — interactive websites, 3D experiences, and digital design.',
  alternates: { canonical: 'https://happyphysics.club/works' },
  openGraph: {
    title: 'Works - happyphysicsclub',
    description: 'Projects by happyphysicsclub — interactive websites, 3D experiences, and digital design.',
    url: 'https://happyphysics.club/works',
  },
}

export default function WorksPage() {
  const projects = [...data.projects].sort((a, b) => b.year - a.year || b.month - a.month)

  return (
    <section className='px-4 md:px-6 py-10 md:py-14 h-fit min-h-[calc(100dvh-3rem)]'>
      <header className='border-b pt-8 border-black/0 pb-4 mb-4 md:mb-6'></header>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14'>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
