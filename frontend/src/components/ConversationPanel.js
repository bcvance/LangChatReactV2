import React, { useEffect, useState } from 'react'
import TopNav from './TopNav'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import { useUsers } from '../contexts/UserProvider'
import MessageBubble from './MessageBubble'


function ConversationPanel() {
    const { conversations, activeConvo, setActiveConvo, webSocketsDict, saveMessageToLocalStorage, saveMessageToDatabase, chatMessages } = useConversations()
    let thisWebSocket;
    const { activeUser } = useUsers()
    const [message, setMessage] = useState('')
    const updateMessage = (e) => {
        setMessage(e.target.value)
    }
    let currentMessages = (activeConvo in chatMessages) ? chatMessages[activeConvo] : []

    // get information (object) of active conversation
    const getConvoObject = (shared_id) => {
        for (let i=0; i<conversations.length; i++) {
            if (conversations[i].shared_id === shared_id) {
                return conversations[i]
            }
        }
    }

    const handleSendMessage = (e) => {
        const activeConvoObject = getConvoObject(activeConvo)
        thisWebSocket = webSocketsDict[activeConvoObject.shared_id]
        console.log('message sent')
        e.preventDefault()
        thisWebSocket.send(
            JSON.stringify({
                type: 'message', 
                message: message,
                message_username: activeUser.username,
                message_user_id: activeUser.id,
                shared_id: activeConvoObject.shared_id,
                other_users: activeConvoObject.other_users
            })
        )
        saveMessageToDatabase(activeUser.id, activeUser.username, activeConvo, message, activeConvoObject.shared_id, activeConvoObject.other_users)
        setMessage('')
    }

    

    useEffect(() => {
        // console.log('rerendered')
        currentMessages = (activeConvo in chatMessages) ? chatMessages[activeConvo] : []
        // console.log(activeConvo)
        // console.log(currentMessages)
        thisWebSocket = webSocketsDict[activeConvo]


        if (Object.keys(webSocketsDict).length > 0) {
            for (const convoId in webSocketsDict) {
                webSocketsDict[convoId].onmessage = (message) => {
                    const messageData = JSON.parse(message.data)
                    // console.log(messageData)
                    if (messageData.type === 'new_chat_message') {
                        console.log('got new chat message')
                        // trigger refresh to test first, then do by altering state
                        window.location.reload(true)
                    }
                    else if (!(messageData.type === 'id_message')) {
                        saveMessageToLocalStorage(messageData.message_user_id, messageData.chat_id, messageData.message, messageData.shared_id)
                    }
                }
            }
        }
        const messageBox = document.getElementById('message-box')
        messageBox.scrollTop = messageBox.scrollHeight
    }, [currentMessages])
    
  return (
    <div style={{ height: '100vh'}} className='d-flex flex-column'>
        <TopNav />
        
        <div className='flex-grow-1' style={{height: '90vh', position: 'relative'}}>
            <div id='message-box' style={{maxHeight: '89%'}} className='overflow-auto d-flex flex-column'>
                {currentMessages.map((message, index) => (
                    <MessageBubble key={index} message={message} index={index} />
                ))}
            </div>
            <div id='input' style={{width: '100%', position: 'absolute', bottom:'0'}} className='align-self-end'>
                <Form className='' style={{width: '100%'}} onSubmit={handleSendMessage}>
                    <Row className='mx-1 my-1'>
                        <Col style={{flexGrow: '11'}} className='m-auto'>
                            <Form.Control value={message} className='' style={{borderRadius: '40px'}} type='text' name='message' placeholder='Type message here.' onChange={(e) => updateMessage(e)} />
                        </Col>
                        <Col style={{flexGrow: '1'}}>
                            <Button type='submit'>Send</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </div>
    
  )
}

export default ConversationPanel