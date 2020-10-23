//bootstrap components
import { Row, Col, Jumbotron } from 'react-bootstrap'
//import nextJS Link component for client-side navigation
import BackButton from './BackButton'
import TravelButton from './TravelButton'
import { useRouter } from 'next/router'

export default function Banner({data}) {
    const router = useRouter()
    //destructure the data prop into its properties
    const {title, content} = data
    return (
        <Row>
            <Col>
                <Jumbotron>
                    <h1>{title}</h1>
                    <p>{content}</p>
                    {router.pathname === '/' ? <TravelButton /> : <BackButton />}
                </Jumbotron>
            </Col>
        </Row>
    )
}