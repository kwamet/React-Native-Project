import { View, Text, SafeAreaView, FlatList, RefreshControl, Alert } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { images } from '../../constants'
import Search from '../search/[query]'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { useState, useEffect } from 'react'
import { getAllPosts } from '../../lib/appwrite'
import { useAppwrite } from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { getTrendingPosts } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

export default function Home() {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: trendingPosts} = useAppwrite(getTrendingPosts);
  const [refreshing, setRefreshing] = useState(false)
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false)
  }
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={( item ) => item.$id}
        renderItem={({ item })=>(
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={()=>(
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  className="w-9 h-10"
                  resizeMode='contain'
                  source={images.logoSmall}
                />
              </View>
            </View>
            <SearchInput/>
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">Trending Videos</Text>
              <Trending 
                posts={trendingPosts ?? []} 
              />
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(
           <EmptyState
            title="No Videos Found"
            subtitle="There are no videos to display at the moment."
           />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} 
      />
    </SafeAreaView>
  )
}