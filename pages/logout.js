import { useContext, useEffect } from 'react'
import UserContext from '../UserContext'
import Router from 'next/router'

export default function logout() {
    //consume the UserContext and destructure it to access the user and unsetUser values from the context provider
    const { unsetUser } = useContext(UserContext);
    
    //invoke unsetUser only after initial render
    useEffect(() => {
        //invoke unsetUser() to clear local storage of user info
        unsetUser();
        Router.push('/');
    }, [])
    return null;
}