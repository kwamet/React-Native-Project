import { View, Text, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1
  }
}

const zoomOut = {
  0: {
    scale: 1
  },
  1: {
    scale: 0.9
  }
}

const TrendingItem = ({activeItem, item}) => {
  const [play, setPlay] = useState(false)
  console.log(activeItem.$id,item.$id)
  return(
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source = {{uri: item.video}}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
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
          className="relative justify-center items-center"
        >
          <ImageBackground
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            source={{uri: item.thumbnail}}
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

export default function Trending({ posts }) {
  const [activeItem, setActiveItem] = useState(posts[1])

  const viewableItemsChanged = ({ viewableItems }) => {
    if(viewableItems.length > 0){
      setActiveItem(viewableItems[0].key)
    }
  }
  return (
    <FlatList
        data={posts}
        keyExtractor={( item ) => item.$id}
        renderItem={({ item })=> (
        <TrendingItem activeItem={activeItem} item={item}/>
     )}
     onViewableItemsChanged={viewableItemsChanged}
     viewabilityConfig={{
        itemVisiblePercentThreshold: 70
     }}
     contentOffset={{x: 230}}
     horizontal
    />
  )
}