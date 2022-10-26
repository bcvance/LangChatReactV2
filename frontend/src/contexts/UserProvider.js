import React, { useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const UserContext = React.createContext();

export function useUsers() {
    return useContext(UserContext)
}

export function UsersProvider(props) {
    const [activeUser, setActiveUser] = useLocalStorage('user', {})
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if ((Object.keys(activeUser).length > 0)) {
            return true
        }
        else {
            return false
        }
    })

    useEffect(() => {
        console.log(isLoggedIn)
        if ((!isLoggedIn && Object.keys(activeUser).length > 0)) {
            setIsLoggedIn(true)
        }
    })

    const value = {
        activeUser: activeUser,
        setActiveUser: setActiveUser,
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn
      }

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UsersProvider
