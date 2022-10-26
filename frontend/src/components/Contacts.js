import React from 'react'
import { useContacts } from '../contexts/ContactsProvider'
import { Container, ListGroup } from 'react-bootstrap'


function Contacts() {
  const { contacts, setContacts, deleteContactFromDatabase } = useContacts()

  const handleDeleteContact = (contact, index) => {
    // delete contact from state
    setContacts((prevContacts) => {
      let newContacts = [...prevContacts]
      newContacts = newContacts.filter((username) => username !== contact)
      return newContacts
    })
    // delete contact from local storage
    let contactsFromLocalStorage = JSON.parse(localStorage.getItem('contacts'))
    contactsFromLocalStorage = contactsFromLocalStorage.filter((username) => username !== contact)
    localStorage.setItem('contacts', contactsFromLocalStorage)
    // delete contact from database
    deleteContactFromDatabase(contact)
  }

  return (
    <div style={{height: '90vh'}} className='d-flex flex-column overflow-auto'>
      <ListGroup variant='flush'>
      {contacts.map((contact, index) => (
        <ListGroup.Item className='d-flex flex-column' key={index} >
          <div style={{width: '100%'}}>{contact}
          <div className='float-end' onClick={() => handleDeleteContact(contact, index)}>
            <svg style={{cursor: 'pointer'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </div>
          </div>
        </ListGroup.Item>
      ))}
      </ListGroup>
    </div>
  )
}

export default Contacts