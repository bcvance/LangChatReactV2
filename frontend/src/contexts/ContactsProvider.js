import React, { useState, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useUsers } from './UserProvider'


const ContactsContext = React.createContext()

export function useContacts() {
  return useContext(ContactsContext)
}

export function ContactsProvider(props) {
  const [contacts, setContacts] = useLocalStorage('contacts', [])
  const [checkedContacts, setCheckedContacts] = useState([])
  const { activeUser } = useUsers()
    
  function addContact(username) {
    if (!(username in contacts)) {
      setContacts((prevContacts) => {
        return [...prevContacts, username]
      })
    }
  }

  // function addContactToLocalStorage(username) {
  //   let contactsFromLocalStorage = JSON.parse(localStorage.getItem('contacts'))
  //   if (!(username in contactsFromLocalStorage)) {
  //     contactsFromLocalStorage.push(username)
  //     localStorage.setItem('contacts', JSON.stringify(contactsFromLocalStorage))
  //   }
  // }

  async function deleteContactFromDatabase(username) {
    let url = 'http://127.0.0.1:8000/api/delete_contact/'
    try {
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({'user_username': activeUser.username, 'contact_username': username}),
        headers: {'Content-Type': 'application/json'}
      })
      let data = response.json()
      return data
    }catch(e) {
      return e
    }
  }

  async function saveContactToDatabase(user_username, contact_username) {
    let url = 'http://127.0.0.1:8000/api/save_contact/'
    try {
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({'user_username': user_username, 'contact_username': contact_username}),
        headers: {'Content-Type': 'application/json'}
      })
      let data = await response.json()
      return data
    }catch(e) {
      return e
    }
  }

  async function getContactsFromDatabase(userId) {
    let url = 'http://127.0.0.1:8000/api/contacts/'
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


  const value = {
    contacts: contacts,
    setContacts: setContacts,
    addContact: addContact,
    // addContactToLocalStorage: addContactToLocalStorage,
    saveContactToDatabase: saveContactToDatabase,
    getContactsFromDatabase: getContactsFromDatabase,
    checkedContacts: checkedContacts,
    setCheckedContacts: setCheckedContacts,
    deleteContactFromDatabase: deleteContactFromDatabase
  }
  return (
    <ContactsContext.Provider value={value}>
      {props.children}
    </ContactsContext.Provider>
  )
}

export default ContactsProvider