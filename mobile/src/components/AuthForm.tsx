import React, { useState } from 'react'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import Loader from './Loader'
import PrimaryButton from './PrimaryButton'

interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  buttonText: string
  error: string
  setError: (msg: string) => void
  bottomButtonText: string
  onBottomButtonPress: () => void
}

export default function AuthForm({
  onSubmit,
  buttonText,
  error,
  setError,
  bottomButtonText,
  onBottomButtonPress,
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError('')
      await onSubmit(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        editable={!isLoading}
      />
      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        editable={!isLoading}
      />
      <View style={styles.errorContainer}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <PrimaryButton
        title={buttonText}
        onPress={handleSubmit}
        disabled={isLoading}
        loading={isLoading}
      />
      <PrimaryButton
        title={bottomButtonText}
        onPress={onBottomButtonPress}
        disabled={isLoading}
        style={{ backgroundColor: '#4f4678', borderWidth: 1, borderColor: '#4f4678' }}
      />
      {isLoading && <Loader />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  errorContainer: {
    height: 50,
  },
  error: {
    color: 'red',
    marginVertical: 8,
    textAlign: 'center',
  },
})
