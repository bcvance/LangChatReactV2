import React, { useEffect, useState, useContext } from 'react'
import { Form, ModalBody, Button, Nav, Tab } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import axios from '../axiosConfig.js'
import { useConversations } from '../contexts/ConversationsProvider.js'
import { useUsers } from '../contexts/UserProvider.js'
import { useContacts } from '../contexts/ContactsProvider.js'

function ConvosModal({show, setShow}) {
    const { contacts, checkedContacts, setCheckedContacts } = useContacts()
    const handleClose = () => setShow(false)
    const [activeTab, setActiveTab] = useState('findPartner')
    const languages = ['English', 'French', 'German', 'Russian', 'Spanish']
    const [myLanguage, setMyLanguage] = useState('English')
    const [learningLanguage, setLearningLanguage] = useState('English')
    const [username, setUsername] = useState('')
    const { conversations, addConversation, saveConversationToLocalStorage, manualChat } = useConversations()
    const { activeUser } = useUsers()

    
    // update state on form change
    const updateLanguages = (event) => {
        event.target.name === 'myLanguage' ? setMyLanguage(event.target.value) : setLearningLanguage(event.target.value)
    }

    const updateChecked = (e) => {
        if (e.target.checked) {
            setCheckedContacts((prevCheckedContacts) => {
                return [...prevCheckedContacts, e.target.value]
            })
        }
        else {
            setCheckedContacts((prevCheckedContacts) => {
                return prevCheckedContacts.filter((username) => username !== e.target.value)
            })
        }
    }

    
    // make call to backend to match user with language partner and generate new chat room
    const handleSubmit = (myLanguage, learningLanguage, event) => {
        event.preventDefault()
        let data = new FormData()
        data.append('know-languages', myLanguage)
        data.append('learning-languages', learningLanguage)
        data.append('username', activeUser.username)
        axios.post('http://127.0.0.1:8000/api/chat/', data)
        .then((response) => {
            data = response.data
            console.log(response.data)
            addConversation(data)
            // saveConversationToLocalStorage(data)
        })
        .catch((error) => {
            console.log(error)
        })
        handleClose()
    }

  return (
    <Modal show={show} onHide={handleClose}>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Modal.Header closeButton>
                <Nav variant='tabs' className='justify-content-center'>
                    <Nav.Item>
                        <Nav.Link eventKey='findPartner'>Find New Partner</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='myContacts'>My Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Modal.Header>
            <ModalBody>
                <Tab.Content>
                    <Tab.Pane eventKey='findPartner'>
                        <Form onSubmit={(event) => handleSubmit(myLanguage, learningLanguage, event)}>
                            <Form.Group className='mb-3' controlId='myLanguage'>
                                <Form.Label>I know:</Form.Label>
                                <Form.Select name='myLanguage' onChange={updateLanguages}>
                                    {languages.map((language, index) => (
                                        <option key={index} label={language}>{language}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='learningLanguage'>
                                <Form.Label>I'm learning:</Form.Label>
                                <Form.Select name='learningLanguage' onChange={updateLanguages}>
                                    {languages.map((language, index) => (
                                        <option key={index} label={language}>{language}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Button as='input' type='submit' value='Match me!'></Button>
                        </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey='myContacts'>
                        <Form onSubmit={() => manualChat(checkedContacts)}>
                            <Form.Group className='mb-3' controlId='selectUsers'>
                                {contacts.map((username, index) => (
                                    <div key={index} className='mb-3'>
                                        <Form.Check type='checkbox' label={username} value={username} onChange={(e) => updateChecked(e)} />
                                    </div>
                                ))}
                            </Form.Group>
                            <Button as='input' type='submit' value='Create conversation'></Button>
                        </Form>
                    </Tab.Pane>
                </Tab.Content>
            </ModalBody>
        </Tab.Container>
    </Modal>
  )
}

export default ConvosModal