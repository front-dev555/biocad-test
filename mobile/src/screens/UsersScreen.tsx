import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { api } from '../api/api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import PrimaryButton from '../components/PrimaryButton'

interface User {
  id: number
  email: string
  createdAt: string
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { token, setToken } = useAuth()

  const loadUsers = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const res = await api.get<User[]>('/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data)
      setError('')
    } catch {
      setError('Ошибка загрузки пользователей')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [token])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await api.post('/logout', { refreshToken: token })
      setToken(null)
    } catch (error) {
      console.error('Logout error:', error)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <PrimaryButton
        title="Выйти"
        onPress={handleLogout}
        disabled={isLoading}
        loading={isLoading}
      />
      <PrimaryButton
        title="Обновить"
        onPress={loadUsers}
        disabled={isLoading}
        loading={isLoading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.user}>
            <Text>{item.email}</Text>
          </View>
        )}
      />
      {isLoading && <Loader />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  user: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  error: { color: 'red', marginTop: 8 },
})
