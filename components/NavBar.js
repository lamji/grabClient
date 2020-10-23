import { useContext, useEffect, useState } from 'react'
//import necessary bootstrap components
import {Dropdown, Navbar, Image} from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'
//import nextJS Link component for client-side navigation
import Link from 'next/link'

import UserContext from '../UserContext'

export default function NavBar() {
    //consume the UserContext and destructure it to access the user state from the context provider
    const { user } = useContext(UserContext)
    const [userName, setUserName] = useState('')
    useEffect(() =>{
        fetch(`https://data-zuitt.herokuapp.com/api/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUserName(data.userName)
        })

    },[])   
    console.log(userName)
    return (
        <React.Fragment>
        <Navbar className="navColor">
            <Link href="/">
                <a className="navbar-brand text-white">Travel Tracker</a>
            </Link>
                <Nav className="ml-auto">
                    {(user.id !== null)
                        ? <>
                            <Dropdown className="ml-3 mt-2">
                            <Dropdown.Toggle id="dropdown-basic" className="mb-2 white text-secondary px-5">
                                Hi {userName}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="ml-0">
                            <Link href="/travel">
                                <a className="nav-link t-body" role="button">Travel</a>
                            </Link>
                            <Link href="/insights">
                                <a className="nav-link t-body " role="button">Insights</a>
                            </Link>
                          
                            <Link href="/history">
                                <a className="nav-link t-body" role="button">History</a>
                            </Link>
                            <Link href="/logout">
                                <a className="nav-link t-body" role="button">Logout</a>
                            </Link>
                            </Dropdown.Menu>
                            </Dropdown>
                        </>
                        : <>
                            <Link href="/login">
                                <a className="nav-link text-white" role="button"><Image src="https://cdn0.iconfinder.com/data/icons/follower/154/follower-man-user-login-round-512.png" className="login-image" fluid />Login</a>
                            </Link>
                        </>
                    }
                </Nav>
        </Navbar>
        </React.Fragment>
    )
}
