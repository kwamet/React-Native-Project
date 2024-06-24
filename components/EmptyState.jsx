import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'


export default function EmptyState({title, subtitle}) {
  return (
    <View className="justify-center items-center px-4">
        <Image source={images.empty} className="w-[230px] h-[215px]" resizeMode='contain'  />
        <Text className="font-pmedium text-xl text-center text-white mt-2">{title}</Text>
        <Text className="text-center text-sm font-pmedium text-gray-100 mt-2">{subtitle}</Text>
        <CustomButton
            title={"Create Video"}
            handlePress={()=> router.push('/create')}
            containerStyles="w-full my-5"
        />
    </View>
  )
}