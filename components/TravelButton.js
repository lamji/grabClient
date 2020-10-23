import Router from 'next/router'
import { Button } from 'react-bootstrap'

export default function TravelButton() {
    return (
        <Button variant="success" onClick={()=>Router.push('/travel')}>Travel</Button>
    )
}