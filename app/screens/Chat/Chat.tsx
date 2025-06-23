import { View, Text } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'

const Chat = ({ route }: { route: any }) => {
    return (
        <View>
            <Text>Chat with {route.params.name}</Text>
        </View>
    )
}

export default Chat