/* scroll_depth 25/50/75/100, uma vez cada (PRD §18). No-op em prospect (track.ts). */
import { useEffect } from 'react'
import { trackScrollDepth } from '@/track'

export function useScrollDepth() {
  useEffect(() => {
    const marks: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100]
    const fired = new Set<number>()
    let raf = 0
    const check = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = ((window.scrollY + window.innerHeight * 0.1) / max) * 100
      for (const m of marks) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m)
          trackScrollDepth(m)
        }
      }
      if (fired.size === marks.length) window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
}
