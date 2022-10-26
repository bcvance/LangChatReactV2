import React from 'react'
import { useUsers } from '../contexts/UserProvider'
import { useConversations } from '../contexts/ConversationsProvider'
import { getTimeFormat } from '../utils/formatters'

function MessageBubble({message, index}) {
    const { activeUser } = useUsers()
    const { chatMessages } = useConversations()
    let timeStamp = ''

    if (message.chat in chatMessages) {
      if (index === chatMessages[message.chat].length-1) {
        timeStamp = getTimeFormat(message.send_time)
      }
    }

    const getClasses = () => {
        if (message.sender === activeUser.id) {
            return index === chatMessages[message.chat].length-1 ? 'mt-3 mx-3 bg-primary align-self-end text-light p-2' : 'm-3 bg-primary align-self-end text-light p-2'
        }
        else  {
            return index === chatMessages[message.chat].length-1 ? 'mt-3 mx-3 align-self-start bg-light p-2' : 'm-3 align-self-start bg-light p-2'
        }
    }
  return (
    <div className='d-flex flex-column'>
      <div style={{borderRadius: '10px', maxWidth:'100px'}} className={getClasses()}>{message.content}</div>
      {timeStamp !== '' && 
        <div className='d-flex flex-column mx-3 my-1'>
          <p style={{fontSize: '10px'}} className={message.sender === activeUser.id ? 'align-self-end' : ''}>{timeStamp}</p>
        </div>}
    </div>
    
  )
}

export default MessageBubble