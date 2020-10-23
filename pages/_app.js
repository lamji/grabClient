import { useState, useEffect } from 'react'
//bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css'
//mapbox css
import 'mapbox-gl/dist/mapbox-gl.css'
//mapbox directions css
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
//custom css
import '../styles.css'
import { Container } from 'react-bootstrap'
import { UserProvider } from '../UserContext'
import Navbar from '../components/NavBar'

export default function App({ Component, pageProps }) {
    //state hook for user state, define here for global scope 
    const [user, setUser] = useState({
        //initialized as an object with properties set as null
        //proper values will be obtained from localStorage AFTER component gets rendered due to Next.JS pre-rendering
        id: null
    })

    //effect hook to set global user state when changes to the id property of user state is detected
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data._id){//JWT validated
                setUser({
                    id: data._id
                })
            }else{//JWT is invalid or non-existent
                setUser({
                    id: null
                })
            }            
        })
    }, [user.id])

    //function for clearing local storage upon logout
    const unsetUser = () => {
        localStorage.clear()
        //set the user global scope in the context provider to have its id set to null
        setUser({
            id: null
        });
    }

    return (
        <>
            {/* wrap the component tree within the UserProvider context provider so that components will have access to the passed in values here */}
            <UserProvider value={{user, setUser, unsetUser}}>
                <Navbar />
                <Container>
                    <Component {...pageProps} />
                </Container>
            </UserProvider>
        </>
    )
}