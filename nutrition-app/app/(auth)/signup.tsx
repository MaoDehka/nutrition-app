import * as React from 'react'
import { Text, TextInput, Button, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Check if email and password are provided
    if (!emailAddress || !password) {
      alert("Please provide both email and password.")
      return
    }

    // Start sign-up process using email and password
    try {
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
      })

      // If sign-up is successful, set the session to active and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')  // Redirect to home page or any other page
      } else {
        console.error("Sign-up failed:", signUpAttempt)
      }
    } catch (err) {
      // Log any errors from the sign-up attempt
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View>
      <Text>Sign up</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Continue" onPress={onSignUpPress} />
    </View>
  )
}
