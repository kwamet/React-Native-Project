import { View, Text } from 'react-native'
import React from 'react'

export default function InfoBox({ title, subtitle, containerStyles, titleStyles}) {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>{title}</Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">{subtitle}</Text>
    </View>
  )
}