import { View, Text, Image } from 'react-native'
import React from 'react'

const Chats = () => {
    return (
        <View>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
        </View>
    )
}

const UserCard = () => {
    return (
        <View className='flex-row justify-between m-2'>
            <Image source={require('../../assets/favicon.png')}></Image>
            <Text>Bob the Builder</Text>
        </View>
    );
}

export default Chats