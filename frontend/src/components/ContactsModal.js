import React from 'react'
import { Form, ModalBody } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

function ContactsModal({show, setShow}) {
    const options = ['user1','user2','user3']
    const handleClose = () => setShow(false)
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Contacts Modal</Modal.Title>
        </Modal.Header>
        {/* <ModalBody>
            <Form>
                <Form.Group className='mb-3' controlId='selectUsers'></Form.Group>
            </Form>
            {options.map((option) => (
                <Form.Control type="checkbox" value={option}>{option}</Form.Control>
            ))}
        </ModalBody> */}
    </Modal>
  )
}

export default ContactsModal