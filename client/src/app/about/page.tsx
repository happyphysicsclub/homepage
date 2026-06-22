import { Logo } from '@/components'
import { MemberCard, type Member } from './MemberCard'

const MEMBERS: Member[] = [
  {
    name: 'SEJIN OH',
    role: 'Designer & Developer',
    email: 'ohsejiin@gmail.com',
    website: 'https://www.ohsejin.com',
    websiteShort: 'ohsejin.com',
  },
  {
    name: 'YEWON JANG',
    role: 'Designer & Developer',
    email: 'yewon11351@gmail.com',
    website: 'https://www.yewoncalli.com',
    websiteShort: 'yewoncalli.com',
  },
]

export const metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <section className='px-4 md:px-8 py-10 md:py-14 h-fit min-h-[calc(100dvh-3rem)]'>
      <header className='border-b pt-8 border-black/10 pb-4 mb-10 md:mb-16'></header>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-4xl'>
        <div>
          {/* <p className='text-3xl md:text-4xl font-light leading-snug tracking-tight'>happyphysicsclub</p> */}
          <Logo className='w-1/3 md:w-1/2 h-auto aspect-square animate-spinslow' />
        </div>

        <div className='flex flex-col gap-6 text-sm leading-relaxed text-black/70 md:pt-2'>
          <p>
            happyphysicsclub is a design studio specializing in web design and development. We create digital
            experiences tailored to the character of each brand and project, designing interfaces with a strong sense of
            visual refinement and usability, and bringing them to life through interactive, fully functional web
            experiences.
          </p>
          <p>
            해피피직스클럽은 웹 디자인과 개발을 중심으로 디지털 경험을 만드는 디자인 스튜디오입니다. 브랜드와 프로젝트의
            성격에 맞는 웹사이트를 기획하고, 시각적 완성도와 사용성을 고려한 인터페이스를 설계하며, 인터랙션과 개발을
            통해 실제로 작동하는 웹 경험으로 구현합니다.
          </p>

          <div className='pt-4 border-t border-black/10'>
            <p className='text-xs tracking-[0.2em] uppercase text-gray mb-6'>MEMBERS</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              {MEMBERS.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
