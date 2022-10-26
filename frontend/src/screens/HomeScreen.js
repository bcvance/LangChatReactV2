import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useUsers } from '../contexts/UserProvider'
import ConversationPanel from '../components/ConversationPanel'
import { useConversations } from '../contexts/ConversationsProvider'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { useContacts } from '../contexts/ContactsProvider'
import { v4 as uuidv4 } from 'uuid'

function HomeScreen() {
  const { activeUser, setActiveUser, isLoggedIn } = useUsers()
  const { conversations, addWebSocket, activeWebSocket, setActiveWebSocket, webSocketsDict, setConversations, getConversations, getChatMessages, setChatMessages, setActiveConvo, addUniqueSocket } = useConversations()
  const { getContactsFromDatabase, setContacts } = useContacts()
  const navigate = useNavigate()
  
  

  // create websocket connections for all existent conversations
  useEffect(() => {
    // create initial unique websocket connection for this client so that consumers
    // can interact with client even if client has no chats (and therefore no other websocket connections)
    const uuid = uuidv4()
    addUniqueSocket(uuid, activeUser.id, activeUser.username)
  
    async function getData() {
      // get all conversations containing logged in user
      const convosFromBackend = await getConversations(activeUser.id)
      setConversations(convosFromBackend)
      setActiveConvo(convosFromBackend[0].shared_id)
      localStorage.setItem('conversations', JSON.stringify(convosFromBackend))
      const chatMessagesFromBackend = await getChatMessages(activeUser.id)
      setChatMessages(chatMessagesFromBackend)
      localStorage.setItem('chatMessages', JSON.stringify(chatMessagesFromBackend))
      // open all websockets
      convosFromBackend.map((conversation, index) => {
        addWebSocket(conversation.shared_id, activeUser.id, activeUser.username)
    }, [])
      // get contacts from backend and set state and local storage with contacts
      const contactsFromBackend =  await getContactsFromDatabase(activeUser.id)

      setContacts(contactsFromBackend.contacts)
      localStorage.setItem('contacts', JSON.stringify(contactsFromBackend.contacts))
  }
  getData()
}, [])

  return (
    <div className="HomeScreen">
        <div className='d-flex' style={{ height: '100vh'}}>
          <div className='flex-grow-3'>
            <Sidebar />
          </div>
          <div style={{width: '100%'}} className='flex-grow-9'>
            <ConversationPanel />
          </div>
        </div>
    </div>
  )
}

export default HomeScreen



