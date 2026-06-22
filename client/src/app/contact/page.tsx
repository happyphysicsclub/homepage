import classNames from 'classnames'

export const metadata = {
  title: 'Contact',
  description: 'Contact happyphysicsclub — reach us via email or Instagram for project inquiries.',
  alternates: { canonical: 'https://happyphysics.club/contact' },
  openGraph: {
    title: 'Contact - happyphysicsclub',
    description: 'Contact happyphysicsclub — reach us via email or Instagram for project inquiries.',
    url: 'https://happyphysics.club/contact',
  },
}

const LINKS = [
  {
    label: 'Instagram',
    items: [
      {
        value: '@happyphysics.club',
        href: 'https://www.instagram.com/happyphysics.club',
      },
    ],
  },
  {
    label: 'Email',
    items: [
      {
        value: 'happyphysicsclub@gmail.com',
        href: 'mailto:happyphysicsclub@gmail.com',
      },
      {
        value: 'ohsejiin@gmail.com',
        href: 'mailto:ohsejiin@gmail.com',
      },
      {
        value: 'yewon11351@gmail.com',
        href: 'mailto:yewon11351@gmail.com',
      },
    ],
  },
]

export default function ContactPage() {
  return (
    <section className='px-4 md:px-6 py-10 md:py-14 h-fit min-h-[calc(100dvh-3rem)]'>
      <header className='border-b pt-8 border-black/0 pb-4 mb-4 md:mb-6'></header>

      <div className='max-w-lg'>
        <p className='text-2xl md:text-4xl font-light leading-snug tracking-tight mb-12'>
          For inquiries, please contact us via email or Instagram.
        </p>

        <div className='flex flex-col'>
          {LINKS.map(({ label, items }) => (
            <div key={label} className='py-2 md:py-4'>
              {items.map(({ value, href }, i) => (
                <a
                  key={value}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={classNames(
                    'group flex items-center py-2 md:py-4 hover:opacity-50 transition-opacity duration-200',
                    'justify-between',
                  )}>
                  <span className='text-xs tracking-[0.2em] uppercase text-gray'>{i === 0 ? label : ''}</span>
                  <span className={classNames('text-sm ', i === 0 ? 'text-black' : ' text-neutral-500')}>{value}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
