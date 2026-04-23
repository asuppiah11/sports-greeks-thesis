import { useEffect, useState } from 'react'

export function useScrollSpy(ids: string[], offset = 80): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '')

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>()

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 },
      )
      observer.observe(el)
      observers.set(id, observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [ids, offset])

  return activeId
}
