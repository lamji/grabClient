import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { Table, Alert, Row, Col, Jumbotron, Button, Modal } from 'react-bootstrap'
import moment from 'moment'
import mapboxgl from 'mapbox-gl' 
mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_KEY
import numberWithCommas from '../toString'

export default function history(){
	

    const [records, setRecords] = useState([])
  
	const [amount, setAmount] = useState('')
	const [distance, setDistance] = useState(0)
	const [duration, setDuration] = useState(0)
	const [origin, setOrigin] = useState(0)
	const [distination, setDistination] = useState(0)
	const [originLong, setOriginLong] = useState(0)
    const [originLat, setOriginLat] = useState(0)
    const [destinationLong, setDestinationLong] = useState(0)
    const [destinationLat, setDestinationLat] = useState(0)

	const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
    	fetch(`https://data-zuitt.herokuapp.com/api/users/details`, {
    		headers: {
    			Authorization: `Bearer ${localStorage.getItem('token')}`
    		}
    	})
    	.then(res => res.json())
    	.then(data => {
			
    		if(data._id){
				setRecords(data.travels)
    		}else{
    			setRecords([])
    		}
    	})
    }, [])
	
	useEffect(() =>{
		records.map(record => {
			setAmount(record.charge.amount)
			setDistance(record.distance)
			setDuration(record.duration)
			setOriginLat(record.origin.latitude)
			setOriginLong(record.origin.longitude)
			setDestinationLat(record.destination.latitude)
			setDestinationLong(record.destination.longitude)
		})
	})
 
	useEffect(() => {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${originLong},${originLat}.json?types=poi&access_token=pk.eyJ1IjoibGFtamlsYW1wYWdvIiwiYSI6ImNrZnpjbjRvaDBiOGUydG9iZzFpMXVubnoifQ.OB02jXjeregqO3TB-t7uhA`)
        .then(res => res.json())
        .then(data => {
            if(originLong !== 0 && originLat !== 0){
                setOrigin(data.features[0].place_name)
            }else{
                
            }
        })
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${destinationLong},${destinationLat}.json?types=poi&access_token=pk.eyJ1IjoibGFtamlsYW1wYWdvIiwiYSI6ImNrZnpjbjRvaDBiOGUydG9iZzFpMXVubnoifQ.OB02jXjeregqO3TB-t7uhA`)
        .then(res => res.json())
        .then(data => {
             if(destinationLong !== 0 && destinationLat !== 0){
                setDistination(data.features[0].place_name)
             }else{
                
             }
        })
    })
	
	return(
		<React.Fragment>
			<Head>
				<title>My Travel Records</title>
			</Head>
			<Jumbotron className="text-center" >
				<h3>Travel History</h3>
			</Jumbotron>
			<Row >
				{/* small*/}
				<Col xs={12} lg={12} id="recordShow">
					{records.length > 0
					? <Table striped bordered hover className="w-100 scroll" >
						<thead>
                            <tr>
                                <th>Date</th>
                                <th className="text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                        	{records.map(record => {
                        		return(
                        			<tr key={record._id}>
                        				<td>{moment(record.date).format('MMMM DD YYYY')}</td>
                        				<td className="text-center" onClick={() =>{
											handleShow()
											setAmount(record.charge.amount)
											setDistance(record.distance)
											setDuration(record.duration)
											setOriginLat(record.origin.latitude)
											setOriginLong(record.origin.longitude)
											setDestinationLat(record.destination.latitude)
											setDestinationLong(record.destination.longitude)
										} }>View</td>
										<Modal
											show={show}
											onHide={handleClose}
											backdrop="static"
											keyboard={false}
										>
											<Modal.Header closeButton>
											<Modal.Title className="text-center">{moment(record.date).format('MMMM DD YYYY')}</Modal.Title>
											</Modal.Header>
											<Modal.Body>
												<Row className="p-2 my-1 ">
													<Col sm={12} className="py-2">
														Origin: <br />
														<p className="py-2  bg-light mb-0">	{origin}</p>
													</Col>
													<Col sm={12} className="py-2 ">
														Destination: <br />
														<p className="py-2  bg-light mb-0">{distination}</p>
													</Col>
												</Row>
												<Row className="p-2  bg-light">
													<Col>
														Total Amount (&#8369;):
													</Col>
													<Col>
														&#8369;  {numberWithCommas(amount)}
													</Col>
												</Row>
												<Row className="p-2  ">
													<Col>
														Distance (km):
													</Col>
													<Col>
													{parseInt(distance/1000)} km
													</Col>
												</Row>
												<Row className="p-2 bg-light">
													<Col>
														Duration (mins):
													</Col>
													<Col>
													{parseInt(duration/60)} mins
													</Col>
												</Row>
											</Modal.Body>
											
										</Modal>
									</tr>
                        		)
                        	})}
                        </tbody>
					</Table>
					: <Alert variant="info">You have no travel records yet.</Alert>
					}
				</Col>
			{/* large */}
				<Col xs={12} lg={12} id="record">
					{records.length > 0
					? <Table striped bordered hover className="w-100 scroll" >
						<thead>
                            <tr className="t-head">
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Date</th>
                                <th>Distance</th>
                                <th>Duration</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody className="t-body">
                        	{records.map(record => {
                        		return(
                        			<tr key={record._id}>
                        				<td>
                        					{origin}
                        				</td>
                        				<td>
                        					{distination}
                        				</td>
                        				<td>{moment(record.date).format('MMMM DD YYYY')}</td>
                        				<td>{Math.round(record.distance/1000)} (km)</td>
                        				<td>{Math.round(record.duration/60)} (mins)</td>
                                        <td> &#8369; {record.charge.amount} </td>
									
									</tr>
                        		)
                        	})}
                        </tbody>
					</Table>
					: <Alert variant="info">You have no travel records yet.</Alert>
					}
				</Col>
			</Row>
			
		</React.Fragment>
	)
}
