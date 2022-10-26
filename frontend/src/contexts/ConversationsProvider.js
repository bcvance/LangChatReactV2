import React, { useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { useUsers } from './UserProvider';

export const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider(props) {
  

    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const { activeUser } = useUsers()
    const [activeConvo, setActiveConvo] = useState(() => {
      if (Object.keys(conversations).length > 0) {
        return conversations[0].shared_id
      }
      else {
        return ''
      }
    })
    const [activeWebSocket, setActiveWebSocket] = useState('')
    const [webSocketsDict, setWebSocketsDict] = useState({})
    const [chatMessages, setChatMessages] = useLocalStorage('chatMessages', {})

    async function getConversations(userId) {
      let url = 'http://127.0.0.1:8000/api/conversations/'
      try{
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'user_id': userId}),
          headers: {'Content-Type': 'application/json'}
        })
        // list of js objects, each object being a conversation
        let data = await response.json()
        return data
      }catch(e) {
        return e
      }
    }

    function addConversation(data) {
        setConversations(prevConversations => {
          let newConversations = [...prevConversations]
          if (!('other_users' in data)) {
            data.other_users = []
          }
          newConversations = [...newConversations, {id: data.room_id, user: data.user, shared_id: data.shared_id, other_users: data.other_users}]
          newConversations.sort((a, b) => (a.last_saved > b.last_saved ? 1 : -1))
          return newConversations
        })
    }

    function saveConversationToLocalStorage(data) {
      let convosFromLocalStorage = localStorage.getItem('conversations')
      convosFromLocalStorage = [...convosFromLocalStorage, {chat_id: data.chat_id, user: data.user, shared_id: data.shared_id}]
      convosFromLocalStorage.sort((a, b) => (a.last_saved > b.last_saved ? 1 : -1))
      localStorage.setItem('conversations', convosFromLocalStorage)
    }

    function deleteConvo(index) {
      setConversations(prevConversations => {
        let newConversations = [...prevConversations]
        newConversations.splice(index, 1)
        return newConversations
      })
    }

    function deleteConvoFromLocalStorage(index) {
      let convosFromLocalStorage = JSON.parse(localStorage.getItem('conversations'))
      convosFromLocalStorage.splice(index, 1)
      localStorage.setItem('conversations', JSON.stringify(convosFromLocalStorage))

    }

    async function deleteConvoFromDatabase(chat_id) {
      let url = 'http://127.0.0.1:8000/api/delete_convo/'
      try{
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'chat_id': chat_id}),
          headers: {'Content-Type': 'application/json'}
        })
        // list of js objects, each object being a conversation
        let data = await response.json()
        return data
      }catch(e) {
        return e
      }
    }

    function addWebSocket(shared_id, user_id, username) {
      setWebSocketsDict(prevWebSockets => {
        if (!(shared_id in prevWebSockets)) {
          prevWebSockets[shared_id] = new W3CWebSocket(`ws://127.0.0.1:8000/ws/socket-server/${shared_id}/`)
          prevWebSockets[shared_id].onopen = (e) => {
            prevWebSockets[shared_id].send(JSON.stringify({
              'type': 'id_message',
              'user_id': user_id,
              'message_username': username,
              'message_user_id': user_id
            }))
          }
        }
        return prevWebSockets
      })
    }

    // add a websocket connection for each user on sign in
    function addUniqueSocket(uuid, user_id, username) {
      setWebSocketsDict(prevWebSockets => {
        if (!('uniqueSocket' in prevWebSockets)){
          prevWebSockets['uniqueSocket'] = new W3CWebSocket(`ws://127.0.0.1:8000/ws/socket-server/${uuid}/`)
          prevWebSockets['uniqueSocket'].onopen = (e) => {
            prevWebSockets['uniqueSocket'].send(JSON.stringify({
              'type': 'id_message',
              'user_id': user_id,
              'message_username': username,
              'message_user_id': user_id
            }))
          }
        }
        return prevWebSockets
      })
    }

    function saveMessageToLocalStorage(user_id, chat_id, message, shared_id) {
      let parsed = JSON.parse(localStorage.getItem('chatMessages'))
      const date = new Date()

      // update state
      if (chat_id in chatMessages) {
        setChatMessages((prevChatMessages) => {
          // create deep copy of prevChatMessages so that state change is registered and 
          // child components rerender
          // IMPORTANT: must make deep copy first and THEN alter values on deep copy, 
          // as oppposed to altering prevChatMessages first and then making copy
          const newMessages = {...prevChatMessages}
          console.log(newMessages)
          newMessages[chat_id] = [...newMessages[chat_id], {content: message, sender: user_id, chat: activeConvo, send_time: date.toISOString(), shared_id: shared_id}]
          return newMessages
        })
      }
      else {
        setChatMessages((prevChatMessages) => {
          const newMessages = {...prevChatMessages}
          newMessages[chat_id] = [{content: message, sender: user_id, chat: activeConvo, send_time: date.toISOString(), shared_id: shared_id}]
          return newMessages
        })
      }
      //console.log(chatMessages)

      // update localStorage
      // if (chat_id in parsed) {
      //   parsed[chat_id].push({content: message, sender: user_id})
      //   localStorage.setItem('chatMessages', JSON.stringify(parsed))
      // }
      // else {
      //   parsed[chat_id] = [{content: message, sender: user_id}]
      //   localStorage.setItem('chatMessages', JSON.stringify(parsed))
      // }
    }

    async function saveMessageToDatabase(userId, userUsername, chatId, content, sharedId, otherUsers) {
      let url = 'http://127.0.0.1:8000/api/save_message/'
      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            'user_id': userId, 
            'user_username': userUsername,
            'chat_id': chatId, 
            'content': content, 
            'shared_id': sharedId, 
            'other_users': otherUsers}),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
      }catch(e) {
        console.log(e)
      }
    }

    async function getChatMessages(userId) {
      let url = 'http://127.0.0.1:8000/api/messages/'
      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'user_id': userId}),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
        return data
      }catch(e) {
        return e
      }
    }
    
    // takes list of usernames and creates chat containing those users
    async function manualChat(users) {
      let url = 'http://127.0.0.1:8000/api/manual_chat/'
      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'other_users': users, 'active_user': activeUser.username}),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
        console.log(data)
        addConversation(data)
        //saveConversationToLocalStorage(data)
        return data
      }catch(e) {
        return e
      }
    }


    const value = {
      conversations: conversations,
      setConversations: setConversations,
      addConversation: addConversation,
      saveConversationToLocalStorage: saveConversationToLocalStorage,
      getConversations: getConversations,
      deleteConvo: deleteConvo,
      deleteConvoFromLocalStorage: deleteConvoFromLocalStorage,
      deleteConvoFromDatabase: deleteConvoFromDatabase,
      activeConvo: activeConvo,
      setActiveConvo: setActiveConvo,
      webSocketsDict: webSocketsDict,
      addWebSocket: addWebSocket,
      addUniqueSocket: addUniqueSocket,
      activeWebSocket: activeWebSocket,
      setActiveWebSocket: setActiveWebSocket,
      saveMessageToLocalStorage: saveMessageToLocalStorage,
      saveMessageToDatabase: saveMessageToDatabase,
      chatMessages: chatMessages,
      setChatMessages: setChatMessages,
      getChatMessages: getChatMessages,
      manualChat: manualChat
    }

    useEffect(() => {
      console.log('websocketsdict', webSocketsDict)
      if ((activeConvo === '' && Object.keys(conversations).length > 0)) {
        setActiveConvo(conversations[0].id)
      }
    })

  return (
    <ConversationsContext.Provider value={value}>
        {props.children}
    </ConversationsContext.Provider>
  )
}

export default ConversationsProvider