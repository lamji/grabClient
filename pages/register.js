import { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap'
import Router from 'next/router'
import Head from 'next/head'

export default function register() {
    //form input state hooks
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [userName, setUserName] = useState('')

    //state to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false)

    //validate form input whenever email, password1, or password2 is changed
    useEffect(() => {
        //validation to enable submit button when all fields are populated and both passwords match
        if((password1 !== '' && password2 !== '') && (password2 === password1)){
            setIsActive(true)
        }else{
            setIsActive(false)
        }
    }, [password1, password2])

    /* useEffect(() => {
        effect
        return () => {
            cleanup
        }
    }, [input]) */

    //function to register user
    function registerUser(e) {
        e.preventDefault();

        //check for duplicate email in database first
        fetch(`https://data-zuitt.herokuapp.com/api/users/email-exists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            })
        })
        .then(res => res.json())
        .then(data => {
            //if no duplicates found
            if (data === false){
                fetch(`https://data-zuitt.herokuapp.com/api/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userName: userName,
                        email: email,
                        password: password1
                    })
                })
                .then(res => res.json())
                .then(data => {
                    //registration successful
                    if(data === true){
                        //redirect to login
                        Router.push('/login')
                    }else{
                        //error in creating registration, redirect to error page
                        Router.push('/error')
                    }
                })
            }else{//duplicate email found
                Router.push('/error')
            }
        })
    } 

    return (
        <React.Fragment>
            <Head>
                <title>Register</title>
            </Head>
            <Container className="container py-2 shadow">
            <Row>
                <Col md={6} sm={12}>
                <Image src="./login.jpg" fluid />
                </Col>
                <Col md={6} sm={12} className=" px-3 LoginHolder">
                <h4>User Registration</h4>
                <Form onSubmit={(e) => registerUser(e)}>
                <Form.Group controlId="userName">
                    <Form.Control className="inputForm" type="text" placeholder="Enter Username" value={userName} onChange={e => setUserName(e.target.value)} required/>
                </Form.Group>

                <Form.Group controlId="userEmail">
                    <Form.Control className="inputForm" type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    <Form.Text className="text-muted t-body">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="password1">
                    <Form.Control className="inputForm" type="password" placeholder="Password" value={password1} onChange={e => setPassword1(e.target.value)} required/>
                </Form.Group>

                <Form.Group controlId="password2">
                    <Form.Control className="inputForm" type="password" placeholder="Verify Password" value={password2} onChange={e => setPassword2(e.target.value)} required/>
                </Form.Group>

                {/* conditionally render submit button based on isActive state */}
                {isActive
                    ? <Button variant="primary" type="submit" id="submitBtn">Register</Button>
                    : <Button variant="primary" type="submit" id="submitBtn" disabled>Register</Button>
                }
                
            </Form>
                </Col>
            </Row>
            </Container>
        </React.Fragment>
    )
}