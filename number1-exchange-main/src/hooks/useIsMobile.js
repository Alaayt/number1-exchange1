import { useState, useEffect } from 'react'
export function useIsMobile() {
  const [v, setV] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
  useEffect(() => {
    const fn = () => setV(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return v
}
