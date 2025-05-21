import React, { useState } from 'react'
import AuthForm from '../components/AuthForm'
import { api } from '../api/api'
import { useAuth } from '../context/AuthContext'

import { AxiosError } from 'axios'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/AppNavigator'
import { useAuthValidation } from '../hooks/useAuthValidation'

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

export default function LoginScreen({ navigation }: Props) {
  const [error, setError] = useState('')
  const { setToken } = useAuth()
  const validate = useAuthValidation()

  const handleLogin = async (email: string, password: string) => {
    const errorMsg = validate(email, password)
    if (errorMsg) {
      setError(errorMsg)
      return
    }
    try {
      const res = await api.post('/login', { email, password })
      setToken(res.data.token)
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message || 'Ошибка авторизации')
      } else {
        setError('Ошибка авторизации')
      }
    }
  }

  return (
    <AuthForm
      onSubmit={handleLogin}
      buttonText="Войти"
      error={error}
      setError={setError}
      bottomButtonText="Зарегистрироваться"
      onBottomButtonPress={() => navigation.navigate('Register')}
    />
  )
}
