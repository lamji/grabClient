import { useEffect, useState } from 'react'
import moment from 'moment'
import { Tabs, Tab, Container, Row, Col, Card, Table, Jumbotron } from 'react-bootstrap'
import MonthlyChart from '../components/MonthlyChart'
import numberWithCommas from '../toString'
import toHours from '../toHours'

export default function insights(){
    const [distances, setDistances] = useState([])
    const [amount, setAmount] = useState([])
    const [duration, setDuration] = useState([])
    const [totalDistances, setTotalDistances] = useState(0)
    const [hours, setHours] = useState(0)
    const [expenses, setExpenses] = useState(0)
  
    useEffect(() =>{
        fetch(`https://data-zuitt.herokuapp.com/api/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.travels.length > 0){
                let monthlyDistance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                let monthlyAmount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                let monthlyDuration = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                let totalDistance = 0
                let totalhours = 0
                let totalExpeses = 0
                data.travels.forEach(travel => {
                    const index = moment(travel.date).month()
                    monthlyDistance[index] += (parseInt(travel.distance/1000))
                    monthlyAmount[index] += (travel.charge.amount)
                    monthlyDuration[index] += (parseInt(travel.duration/60))
                    totalDistance += parseInt(travel.distance)
                    totalhours += parseInt(travel.duration)
                    totalExpeses += parseInt(travel.charge.amount)
                })
                setExpenses(numberWithCommas(totalExpeses))
                setHours(toHours(totalhours))
                setTotalDistances(totalDistance)
                setAmount(monthlyAmount)
                setDistances(monthlyDistance)
                setDuration(monthlyDuration)
            }
        })
    },[])
    return(
        <React.Fragment>
         <Jumbotron>
            <h3 className="text-center">Insights Charts</h3>
        </Jumbotron>
        <Container>
        <Tabs fill defaultActiveKey="distances" id="monthlyFigures">
            <Tab eventKey="distances" title="Distance">
                <Row>
                    <Col lg={8} xs={12}>
                        <MonthlyChart figuresArray={distances} label={"Monthly Distance Travel in Km"}/>
                    </Col>
                    <Col lg={4} xs={12}>
                    <Card className="mt-4 border-0">
                        <Card.Body>
                            <Card.Title>Details</Card.Title>
                            <Table striped bordered hover>
						<thead>
                            <tr className="t-body">
                                <th>Total Distances</th>
                            </tr>
                        </thead>
                        <tbody className="t-body">
                            <tr>
                                <td>{numberWithCommas(totalDistances)} km</td>
                            </tr>
                        </tbody>
					</Table>
                        </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Tab>
            <Tab eventKey="duration" title="Duration">
            <Row>
                <Col lg={8} xs={12}>
                <MonthlyChart figuresArray={duration} label={"Duration"}/>
                </Col>
                <Col lg={4} xs={12}>
                <Card className="mt-4 border-0">
                    <Card.Body>
                        <Card.Title>Details</Card.Title>
                        <Table striped bordered hover>
                    <thead>
                        <tr className="t-body">
                            <th>Total Durations</th>
                        </tr>
                    </thead>
                    <tbody className="t-body">
                        <tr>
                            <td>{numberWithCommas(hours)}</td>
                        </tr>
                    </tbody>
                </Table>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
            </Tab>
            <Tab eventKey="amount" title="Expences">
            <Row>
                <Col lg={8} xs={12}>
                <MonthlyChart figuresArray={amount} label={"Expences Monthly Chart"}/>
                </Col>
                <Col lg={4} xs={12}>
                <Card className="mt-4 border-0">
                    <Card.Body>
                        <Card.Title>Details</Card.Title>
                        <Table striped bordered hover>
                    <thead>
                        <tr className="t-body">
                            <th>Total Expenses</th>
                        </tr>
                    </thead>
                    <tbody className="t-body">
                        <tr>
                            <td>&#8369;  {expenses}.00</td>
                        </tr>
                    </tbody>
                </Table>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
            </Tab>
        </Tabs>
        </Container>
        </React.Fragment>
    )
}