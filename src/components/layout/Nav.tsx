import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { ByteWeaveLogo } from '@/assets/logo/ByteWeaveLogo'
import { ButtonNavLink } from '@/components/primitives/Button'
import { Close, Menu } from '@/components/primitives/Icon'
import { CONTACT, nav } from '@/content/site'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Route change closes the sheet — otherwise it stays open over the new page.
  useEffect(() => setOpen(false), [pathname])

  // Lock the page, trap focus, and close on Escape while the sheet is open.
  useEffect(() => {
    if (!open) return
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusables = sheetRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    sheetRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
    return () => {
      body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'block py-2 text-[0.9375rem] transition-colors duration-200',
      isActive ? 'text-ink font-medium' : 'text-ink-secondary hover:text-ink',
    ].join(' ')

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color,backdrop-filter]',
        'duration-[240ms] ease-[var(--ease-out)]',
        scrolled
          ? 'h-16 border-b border-line bg-bg/72 backdrop-blur-xl'
          : 'h-22 border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-full max-w-page items-center justify-between gap-6 px-[var(--gutter)]">
        <NavLink to="/" className="-my-1 shrink-0 py-1" aria-label="ByteWeave Studio — home">
          <ByteWeaveLogo className="h-11 w-auto" />
        </NavLink>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink to={item.href} end={item.href === '/'} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 lg:block">
          <ButtonNavLink to={CONTACT} className="py-2.5">
            Start a project
          </ButtonNavLink>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="text-ink -mr-2.5 p-2.5 lg:hidden"
        >
          <Menu className="size-6" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        ref={sheetRef}
        hidden={!open}
        className="bg-bg fixed inset-0 z-50 flex flex-col lg:hidden"
      >
        <div className="flex h-22 shrink-0 items-center justify-between px-[var(--gutter)]">
          <ByteWeaveLogo className="h-10 w-auto" />
          <button type="button" onClick={() => setOpen(false)} className="text-ink -mr-2.5 p-2.5">
            <Close className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Primary mobile" className="flex-1 overflow-y-auto px-[var(--gutter)] pt-4">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className="border-line border-b transition-[opacity,transform] duration-500 ease-[var(--ease-out)]"
                style={{
                  transitionDelay: open ? `${80 + i * 40}ms` : '0ms',
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateY(8px)',
                }}
              >
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-h2 block py-4 font-medium ${isActive ? 'text-accent' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-[var(--gutter)] pt-6 pb-10">
          <ButtonNavLink to={CONTACT} className="w-full justify-center">
            Start a project
          </ButtonNavLink>
        </div>
      </div>
    </header>
  )
}
