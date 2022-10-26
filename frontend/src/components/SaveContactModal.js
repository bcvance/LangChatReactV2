import React, { useEffect, useState } from 'react'
import { Form, Container, Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { useConversations } from '../contexts/ConversationsProvider'
import { useContacts } from '../contexts/ContactsProvider'
import { useUsers } from '../contexts/UserProvider'

function SaveContactModal({show, setShow}) {
    const { activeUser } = useUsers()
    const { conversations, activeConvo } = useConversations()
    const { addContact, addContactToLocalStorage, saveContactToDatabase } = useContacts()
    const [saveUsers, setSaveUsers] = useState([])
    const handleClose = () => setShow(false)
    const getConvoObject = (shared_id) => {
        for (let i=0; i<conversations.length; i++) {
            if (conversations[i].shared_id === shared_id) {
                return conversations[i]
            }
        }
    }
    const activeConvoObject = getConvoObject(activeConvo)

    const handleSaveContacts = (e) => {
        e.preventDefault()
        console.log('save contacts triggered')
        for (let i=0; i<saveUsers.length; i++) {
            addContact(saveUsers[i])
            saveContactToDatabase(activeUser.username, saveUsers[i])
        }
        handleClose()
    }

    const handleChange = (e) => {
        // add user tolist of users to save
        if (e.target.checked) {
            setSaveUsers((prevSaveUsers) => [...prevSaveUsers, e.target.value])
        }
        // remove user from ist of users to save
        else {
            setSaveUsers((prevSaveUsers) => {
                let newSaveUsers = [...prevSaveUsers]
                newSaveUsers = newSaveUsers.filter((username) => username !== e.target.value) 
            })
        }
    }



  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <h3>Choose user/users to save to contacts.</h3>
        </Modal.Header>
        <Modal.Body>
            <Container>
                {(typeof activeConvoObject !== 'undefined' && 'other_users' in activeConvoObject) &&
                <Form onSubmit={(e) => handleSaveContacts(e)}>
                {activeConvoObject['other_users'].map((username, index) => (

                    <div key={index}>
                        <Form.Check id={username} value={username} label={username} onChange={(e) => handleChange(e)}></Form.Check>
                    </div>
                ))}
                <Button as='input' type='submit' value='Save to contacts' />
            </Form>}
            </Container>
        </Modal.Body>
    </Modal>
  )
}

export default SaveContactModal