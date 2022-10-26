import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useUsers } from '../contexts/UserProvider'
import ConversationsProvider from '../contexts/ConversationsProvider'
import ContactsProvider from '../contexts/ContactsProvider'
import UserProvider from '../contexts/UserProvider'

export const ProtectedRoute = (props) => {
    const { isLoggedIn } = useUsers()

        if (!isLoggedIn) {
            return <Navigate to='/login/' />
        }
        return (
                props.children
        )

}
