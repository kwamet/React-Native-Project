import { View, Text, ScrollView, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser, getCurrentUser} from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

export default function SignUp() {
  const {setUser, setIsLoggedIn} = useGlobalContext();
  const [form, setForm] = useState(
    {
      username: '',
      email: '',
      password: ''
    }
  )

  const [isSubmiting, setIsSubmiting] = useState(false)

  const submit = async () => {
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error', 'Please fill all fields');
    }

    setIsSubmiting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsLoggedIn(true);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmiting(false);
    }
  
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-1">
          <Image source={images.logo} resizeMode='contain' className="w-[115px] h-35" />
          <Text className="text-2xl font-semibold text-white mt-4 font-psemibold">Sign up to Aora</Text>
          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({...form, username: e})}
            otherStyles="mt-10"
          />
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
           <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmiting}
          />
          <View className="justify-center pt-5 flex-row gap-2"> 
            <Text className="text-lg text-gray-100">
              Already have an account?
            </Text>
            <Link href={'/sign-in'} className='text-lg font-psemibold text-secondary '>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

