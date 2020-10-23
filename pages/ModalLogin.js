import { useState, useContext } from 'react'
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap'
import UserContext from '../UserContext'
import Router from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function login() {
    //use the UserContext and destructure it to access the user and setUser defined in the App component
    const { setUser } = useContext(UserContext)

    //states for form input
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //function to process user authentication
    function authenticate(e) {
        //prevent redirection via form submission
        e.preventDefault()

        fetch(`https://data-zuitt.herokuapp.com/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            //successful authentication will return a JWT via the response accessToken property
            if(data.accessToken){
                //store JWT in local storage
                localStorage.setItem('token', data.accessToken);
                //send a fetch request to decode JWT and obtain user ID and role for storing in context
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/details`, {
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`
                    } 
                })
                .then(res => res.json())
                .then(data => {
                    //set the global user state to have properties containing authenticated user's ID
                    setUser({
                        id: data._id
                    })
                    Router.push('/travel')
                })
            }else{//authentication failure
                Router.push('/error')
            }
        })
    }

    return (
        <React.Fragment>
            <Head>
                <title>Login</title>
            </Head>
            
            <Row>
                <Col md={6} sm={12}>
                <Image src="./login.jpg" fluid />
                </Col>
                <Col md={6} sm={12} className="mt-2 px-3">
                    <Form onSubmit={(e) => authenticate(e)}>
                        <h4 className="text-dark text-center">User Login</h4>
                        <Form.Group controlId="userEmail">
                            <Form.Control className="inputForm" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Control className="inputForm" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </Form.Group>

                        <Button  type="submit" className="modalLogin">
                            Login
                        </Button>
                        <Link href="/register">
                            <a className="signUp text-center"> Not yet Register? Sign Up</a>
                        </Link>
                    </Form>
                </Col>
            </Row>
        </React.Fragment>
    )
}