import React, {useEffect, useState} from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap'
import { useUsers } from '../contexts/UserProvider'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Message from '../components/Message';
import { useConversations } from '../contexts/ConversationsProvider';

function RegisterScreen() {
    const [email, setEmail] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [password2, setPassword2] = useState()
    const { activeUser, setActiveUser, setIsLoggedIn } = useUsers()
    const [success, setSuccess] = useState(true)
    const [error, setError] = useState('')

    const handleRegister = (async(e) => {
        e.preventDefault()
        if (password === password2) {
            try {
                let url = 'http://127.0.0.1:8000/api/register/'
                let response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({'username': username, 'email': email, 'password': password}),
                    headers: {'Content-Type': 'application/json'}
                })
                let data = await response.json()
                console.log(data)
                if (response.ok) {
                    setActiveUser(data)
                    setIsLoggedIn(true)
                    setSuccess(true)
                    localStorage.setItem('user', data)
                }
                else {
                    setSuccess(false)
                    setError(data.detail)
                }
                }catch(error) {
                setSuccess(false)
                setError(error)
                }
        }
        else {
            setSuccess(false)
            setError('Passwords must match.')
        }
        // log user in with provided credentials
    })


    const updateState = (e) => {
        const fieldName = e.target.name
        if (fieldName === 'email') {
            setEmail(e.target.value)
        }
        else if (fieldName === 'username') {
            setUsername(e.target.value)
        }
        else if (fieldName === 'password') {
            setPassword(e.target.value)
        }
        else if (fieldName === 'password2') {
            setPassword2(e.target.value)
        }
    }

    const location = useLocation()
    const navigate = useNavigate()

    const redirect = '/'

    useEffect(() => {

        if ((Object.keys(activeUser).length > 0) && success) {
            navigate('/', { replace: true })
        }
    }, [navigate, activeUser, redirect])

  return (
    <Container className='d-flex flex-column align-items-center' style={{height:'100vh'}}>
      <div style={{margin: 'auto'}} className='d-flex flex-column align-items-center'>
      <Card style={{ width: '25rem', margin: 'auto'}} className='align-middle'>
            <Card.Body>
              <Card.Title><h5 className='text-center'>Login</h5></Card.Title>
              {(error.length > 0) && <Message variant='danger'>{error}</Message>}
                <Form onSubmit={handleRegister}>
                    <Form.Group className='m-3'>
                      <Form.Label>Username</Form.Label>
                      <Form.Control name='username' type='text' placeholder='Enter username' onChange={updateState} />
                    </Form.Group>
                    <Form.Group className='m-3'>
                      <Form.Label>Email address</Form.Label>
                      <Form.Control name='email' type='email' placeholder='Enter email' onChange={updateState} />
                    </Form.Group>
                    <Form.Group className='m-3'>
                      <Form.Label>Password</Form.Label>
                      <Form.Control name='password' type='password' placeholder='Enter password' onChange={updateState} />
                    </Form.Group>
                    <Form.Group className='m-3'>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control name='password2' type='password' placeholder='Enter password' onChange={updateState} />
                    </Form.Group>
                    <div className='text-center'>
                      <Button type='submit' className='text-center'>Log In</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
        <div>
          <p className='small text-secondary'>Already have an account? <Link to='/login/' className='small text-secondary'>Login.</Link></p>
        </div>
      </div>
    </Container>
  )
}

export default RegisterScreen