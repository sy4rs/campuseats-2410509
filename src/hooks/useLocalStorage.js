
import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue, enabled = true) {
  const [stored, setStored] = useState(() => {
    try {
      const saved = enabled ? localStorage.getItem(key) : null

      return {
        key,
        value: saved !== null ? JSON.parse(saved) : initialValue,
      }
    } catch {
      return { key, value: initialValue }
    }
  })

  // Load the correct data whenever the storage key changes.
  useEffect(() => {
    try {
      const saved = enabled ? localStorage.getItem(key) : null

      setStored({
        key,
        value: saved !== null ? JSON.parse(saved) : initialValue,
      })
    } catch {
      setStored({ key, value: initialValue })
    }
  }, [key, enabled])

  // Save data only when it belongs to the current storage key.
  useEffect(() => {
    if (!enabled || stored.key !== key) return

    try {
      localStorage.setItem(key, JSON.stringify(stored.value))
    } catch (err) {
      console.error('Unable to save localStorage:', err)
    }
  }, [key, enabled, stored])

  // Avoid displaying the previous account's data during key changes.
  const value = stored.key === key ? stored.value : initialValue

  // Supports both normal values and functional state updates.
  function setValue(update) {
    setStored((previous) => {
      const current =
        previous.key === key ? previous.value : initialValue

      const nextValue =
        typeof update === 'function' ? update(current) : update

      return { key, value: nextValue }
    })
  }

  return [value, setValue]
}
