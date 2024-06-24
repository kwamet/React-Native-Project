import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { useState } from 'react'
import { Video, ResizeMode } from 'expo-av'

export default function VideoCard({ video: { title, thumbnail, video, users: { username, avatar }} }) {
    const [play, setPlay] = useState(false)


    return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                    <Image
                        className="w-full h-full rounded-lg"
                        source={{uri: avatar}}
                        resizeMode='cover'
                    />
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
                    <Text className="text-gray-100 font-pregular text-xs" numberOfLines={1}>{username}</Text>
                </View>
            </View>
            <View className="pt-2">
                <Image className="w-5 h-5" source={icons.menu} resizeMode='contain'/>
            </View>
        </View>
        {play ? (
            <Video
            source = {{uri: video}}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status)=>{
              if(status.didJustFinish) setPlay(false)
            }}
          />
        ) : (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={()=>setPlay(true)}
                className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            >
                <Image
                    className="w-full h-full rounded-xl mt-3"
                    source={{uri: thumbnail}}
                    resizeMode='cover'
                />
                <Image
                    className="w-12 h-12 absolute"
                    source={icons.play}
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
    </View>
  )
}