import React from 'react'
import { Nav, Tab, Button } from 'react-bootstrap'
import { useState } from 'react'
import Conversations from '../components/Conversations'
import Contacts from '../components/Contacts'
import ConvosModal from '../components/ConvosModal'
import ContactsModal from '../components/ContactsModal'
import { useContacts } from '../contexts/ContactsProvider'

function Sidebar() {
    const [activeTab, setActiveTab] = useState('conversations')
    const [showConvosModal, setShowConvosModal] = useState(false)
    const [showContactsModal, setShowContactsModal] = useState(false)
    const { contactChecked } = useContacts()

    function handleShow(activeTab) {
        activeTab === 'conversations' ? setShowConvosModal(true) : setShowContactsModal(true)
    }

  return (
    <div style={{ width: '250px'}} className='d-flex flex-column'>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant='tabs' className='justify-content-center'>
                <Nav.Item>
                    <Nav.Link eventKey='conversations'>Conversations</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey='contacts'>Contacts</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content className='border-end overflow-auto flex-grow-1'>
                <Tab.Pane eventKey='conversations'>
                    <Conversations />
                </Tab.Pane>
                <Tab.Pane eventKey='contacts'>
                    <Contacts />
                </Tab.Pane>
            </Tab.Content>
            {activeTab === 'conversations' && 
            <Button style={{position: 'absolute', bottom: '0', width: '250px', zIndex: '100'}} className='p-2 text-light bg-primary my-1' onClick={() => handleShow(activeTab)}>
                New Conversation
            </Button>}
            {(activeTab === 'contacts' && contactChecked) &&
            <Button style={{position: 'absolute', bottom: '0', width: '250px', zIndex: '100'}} className='p-2 text-light bg-primary my-1' onClick={() => handleShow(activeTab)}>
                Create Conversation
            </Button>}
        </Tab.Container>
        <ConvosModal show={showConvosModal} setShow={setShowConvosModal}/>
        <ContactsModal show={showContactsModal} setShow={setShowContactsModal}/>
    </div>
  )
}

export default Sidebar