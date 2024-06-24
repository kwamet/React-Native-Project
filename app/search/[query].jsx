import { View, Text, SafeAreaView, FlatList, RefreshControl, Alert } from 'react-native'
import React from 'react'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { useEffect } from 'react'
import { searchPosts } from '../../lib/appwrite'
import { useAppwrite } from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

export default function Search() {
  const { data: posts, refetch } = useAppwrite(()=> searchPosts(query));
  const { query } = useLocalSearchParams();
  
  useEffect(() => {
    refetch()
  }, [query])
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={( item ) => item.$id}
        renderItem={({ item })=>(
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={()=>(
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query}/>
            </View>
          </View>

        )}
        ListEmptyComponent={()=>(
           <EmptyState
            title="No Videos Found for this search query."
            subtitle="There are no videos to display at the moment."
           />
        )}
      />
    </SafeAreaView>
  )
}