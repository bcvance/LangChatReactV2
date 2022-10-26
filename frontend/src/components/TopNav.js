import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../contexts/UserProvider'
import { useConversations } from '../contexts/ConversationsProvider'

function TopNav() {
    const navigate = useNavigate()
    const { activeUser, setActiveUser, isLoggedIn, setIsLoggedIn } = useUsers()
    const { setConversations, setChatMessages } = useConversations()


    const handleLog = () => {
        if (isLoggedIn) {
            console.log('14 executed')
            setIsLoggedIn(false)
            console.log('16 executed')
            localStorage.setItem('user', {})
            console.log(localStorage.getItem('user'))
            console.log('18 executed')
            localStorage.setItem('conversations', [])
            console.log(localStorage.getItem('conversations'))
            console.log('20 executed')
            localStorage.setItem('chatMessages', {})
            console.log(localStorage.getItem('chatMessages'))
            console.log('22 executed')
            setActiveUser({})
            setConversations([])
            setChatMessages({})
        }
        else {
            navigate('/login/')
        }
    }

  return (
    <div style={{ padding: '7.5px' }} className='border-bottom align-items text-end'>
        <a style={{fontSize: 'small', cursor: 'pointer'}} className='ms-auto me-2 text-primary' onClick={handleLog}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
        </a>
    </div>
  )
}

export default TopNav