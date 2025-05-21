import React, { useState } from 'react'
import AuthForm from '../components/AuthForm'
import { api } from '../api/api'
import { AxiosError } from 'axios'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/AppNavigator'
import { useAuthValidation } from '../hooks/useAuthValidation'

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>

export default function RegisterScreen({ navigation }: Props) {
  const [error, setError] = useState('')
  const validate = useAuthValidation()

  const handleRegister = async (email: string, password: string) => {
    const errorMsg = validate(email, password)
    if (errorMsg) {
      setError(errorMsg)
      return
    }
    try {
      await api.post('/register', { email, password })
      navigation.navigate('Login')
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message || 'Ошибка регистрации')
      } else {
        setError('Ошибка регистрации')
      }
    }
  }

  return (
    <AuthForm
      onSubmit={handleRegister}
      buttonText="Зарегистрироваться"
      error={error}
      setError={setError}
      bottomButtonText="Войти"
      onBottomButtonPress={() => navigation.navigate('Login')}
    />
  )
}
