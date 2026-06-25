import { useState, useCallback, useRef } from 'react'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((q: string) => {
    setQuery(q)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
  }, [])

  const submitSearch = useCallback((q: string) => {
    setRecentSearches((prev) => {
      const updated = [q, ...prev.filter((s) => s !== q)].slice(0, 10)
      return updated
    })
  }, [])

  const clearRecent = useCallback(() => {
    setRecentSearches([])
  }, [])

  return {
    query,
    setQuery: search,
    submitSearch,
    recentSearches,
    clearRecent,
  }
}
