import { useCallback } from 'react'

export function useAuthValidation() {
  return useCallback((email: string, password: string): string | null => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Некорректный email'
    }
    if (password.length < 6) {
      return 'Пароль должен содержать не менее 6 символов'
    }
    return null
  }, [])
}
