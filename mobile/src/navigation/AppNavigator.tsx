import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import UsersScreen from '../screens/UsersScreen'
import { useAuth } from '../context/AuthContext'

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Users: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  const { token } = useAuth()
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined}>
        {token ? (
          <Stack.Screen name="Users" component={UsersScreen} />
        ) : (
          [
            <Stack.Screen key="Login" name="Login" component={LoginScreen} />,
            <Stack.Screen key="Register" name="Register" component={RegisterScreen} />,
          ]
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
