import React, { useContext, useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import { useUsers } from '../contexts/UserProvider'
import { getTimeFormat, getDisplayText } from '../utils/formatters'
import SaveContactModal from './SaveContactModal'

function Conversations() {
    const { conversations, setConversations, activeConvo, setActiveConvo, webSocketsDict, addWebSocket, chatMessages, deleteConvo, deleteConvoFromLocalStorage, deleteConvoFromDatabase } = useConversations()
    const { activeUser } = useUsers()
    const [showSaveContactModal, setShowSaveContactModal] = useState(false)

    const changeActiveConvo = (id, index) => {
      console.log('convo changed')
      setActiveConvo(id)
    }

    const itemClasses = (shared_id) => {
      if (shared_id === activeConvo) {
        return 'active'
      }
      else {
        return ''
      }
    }

    const handleDeleteConvo = (chat_id, index) => {
      deleteConvoFromDatabase(chat_id)
      deleteConvo(index)
      deleteConvoFromLocalStorage(index)
    }

    const handleShowSaveContactModal = () => {
      setShowSaveContactModal(true)
    }

  return (
    <div style={{height: '90vh'}} className='d-flex flex-column overflow-auto'>
      <ListGroup variant=''>
        {conversations.map((conversation, index) => {
          let displayDate = ''
          let displayText = ''
          if (conversation.shared_id in chatMessages && chatMessages[conversation.shared_id].length > 0) {
            let dateString = chatMessages[conversation.shared_id][chatMessages[conversation.shared_id].length-1].send_time
            displayDate = getTimeFormat(dateString)
            let mostRecent = chatMessages[conversation.shared_id][chatMessages[conversation.shared_id].length-1].content
            displayText = getDisplayText(mostRecent)
          }
          
          return (
            <ListGroup.Item key={conversation.id} onClick={() => changeActiveConvo(conversation.shared_id, index)} className={itemClasses(conversation.shared_id)}>
              {('other_users' in conversation && conversation['other_users'].length > 0) 
              ? <div className='d-flex flex-column'>
                  <div>
                    <span style={{fontSize: '14px', cursor: 'pointer'}} className='float-start' onClick={() => handleShowSaveContactModal()}>{conversation.other_users.join(', ')}</span>
                    <span style={{fontSize: '14px'}} className={activeConvo === conversation.shared_id ? 'float-end' : 'float-end text-secondary'}>{displayDate}</span>
                  </div>
                  <div>
                    <p style={{fontSize: '12px'}} className={activeConvo === conversation.shared_id ? 'mb-0' : 'text-secondary mb-0'}>{displayText}</p>
                  </div>
                  <div>
                    <div className='float-end' onClick={() => handleDeleteConvo(conversation.id, index)}>
                      <svg style={{cursor: 'pointer'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              : <div>
                  <p>Finding partner...</p>
                </div>}
            </ListGroup.Item>
          )
          })}
      </ListGroup>
      <SaveContactModal show={showSaveContactModal} setShow={setShowSaveContactModal} />
    </div>
  )
}

export default Conversations