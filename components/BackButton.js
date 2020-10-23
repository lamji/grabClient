import Router from 'next/router'
import { Button } from 'react-bootstrap'

export default function BackButton() {
    return (
        <Button variant="secondary" onClick={()=>Router.back()}>Go Back</Button>
    )
}