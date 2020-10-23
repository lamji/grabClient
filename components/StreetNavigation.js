
import { useEffect, useRef, useState, useContext } from 'react'
import { Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = 'pk.eyJ1IjoibGFtamlsYW1wYWdvIiwiYSI6ImNrZnpjbjRvaDBiOGUydG9iZzFpMXVubnoifQ.OB02jXjeregqO3TB-t7uhA'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import UserContext from '../UserContext'
import Router from 'next/router'
import ToString from '../toString'
import Login from '../pages/ModalLogin'
import Head from 'next/head'
import { PayPalButton } from 'react-paypal-button-v2'
import numberWithCommas from '../toString'
import { route } from 'next/dist/next-server/server/router'


export default function StreetNavigation(){

    const { user } = useContext(UserContext)
    const [distance, setDistance] = useState(0)
    const [duration, setDuration] = useState(0)
    const [originLong, setOriginLong] = useState(0)
    const [originLat, setOriginLat] = useState(0)
    const [destinationLong, setDestinationLong] = useState(0)
    const [destinationLat, setDestinationLat] = useState(0)
    const [isActive, setIsActive] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [amount, setAmount] = useState(0)
    const [address, setAddress] = useState(0)
    const [finalDistination, setFinalDistination] = useState(0)

    const mapContainerRef = useRef(null)


    function Record(chargeId){
        fetch(`https://data-zuitt.herokuapp.com/api/users/travels`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                   originLong: originLong,
                   originLat: originLat,
                   destinationLong: destinationLong,
                   destinationLat: destinationLat,
                   duration: duration,
                   distance: distance,
                   amount: amount,
                  chargeId: chargeId

                })
            })
            .then(res => res.json())
            .then(data => {
                if(data === true){
        
                    Router.push('./history')
                }else{
                    Router.push(err)
                }
            })
      }

    useEffect(() => {
            if(distance !== 0 && duration !== 0){
                setIsActive(true)
            }else{
                setIsActive(false)
            }
    }, [distance, duration])

    useEffect(() => {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${originLong},${originLat}.json?types=poi&access_token=pk.eyJ1IjoibGFtamlsYW1wYWdvIiwiYSI6ImNrZnpjbjRvaDBiOGUydG9iZzFpMXVubnoifQ.OB02jXjeregqO3TB-t7uhA`)
        .then(res => res.json())
        .then(data => {
            if(data.features.length === 0 ){
                setAddress("Pisti, dili makuha imong address, pili nalang ug lain.")
            }else{
                if(originLong !== 0 && originLat !== 0 ){
                    setAddress(data.features[0].place_name)
                    }
                }
        })
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${destinationLong},${destinationLat}.json?types=poi&access_token=pk.eyJ1IjoibGFtamlsYW1wYWdvIiwiYSI6ImNrZnpjbjRvaDBiOGUydG9iZzFpMXVubnoifQ.OB02jXjeregqO3TB-t7uhA`)
        .then(res => res.json())
        .then(data => {
            if(data.features.length === 0 ){
                console.log("hasusuus")
            }else{
                if(originLong !== 0 && originLat !== 0){
                    setFinalDistination(data.features[0].place_name)
                 }
                }
        })
    })

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [121.04382, 14.63289],
            zoom: 12
        })
        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving'
        })


        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
        map.addControl(directions, 'top-left')

        directions.on('route', e => {
            
            if(e.route.length <= 0){
                // console.log("hoyyyss")
            }else{
                if(typeof e.route !== "undefined"){
                    // console.log(e.route)
                    setOriginLong(e.route[0].legs[0].steps[0].intersections[0].location[0])
                    setOriginLat(e.route[0].legs[0].steps[0].intersections[0].location[1])
                    setDestinationLong(e.route[0].legs[0].steps[e.route[0].legs[0].steps.length-1].intersections[0].location[0])
                    setDestinationLat(e.route[0].legs[0].steps[e.route[0].legs[0].steps.length-1].intersections[0].location[1])
                    setDistance(e.route[0].distance)
                    setDuration(e.route[0].duration)
                    setAmount(Math.round(e.route[0].distance/1000)*50)
                }
            }
        })
        return () => map.remove()
        
        
    },[])
   console.log(originLong + "," + originLat)
    return(
        <React.Fragment>
        <Card className="p-2">
        <Row className="mb-0">
            <Col xs={12} md={6}>
            <Card className="p-3">
            {user.id === null ? <a className="mb-2 btn btn-sm w-50 text-left" onClick={handleShow}> &#9776; Login</a>
             :
             <a className="mb-2 btn btn-sm w-25 text-left" onClick={handleShow}> &#9776; View Routes</a>
             }
            <Card.Text className="pl-2">Booking Cost: &#8369; {numberWithCommas(amount)}</Card.Text>
            <Col md={6}>
            {isActive === true && user.id !== null
                        ? 
                        
                        <PayPalButton
                            amount={amount}
                            onSuccess={(details, data) => {
                                setOriginLong(0)
                                setOriginLat(0)
                                setDestinationLong(0)
                                setDestinationLat(0)
                                setDistance(0)
                                setDuration(0)
                                setAmount(0)
                                Record(data.orderID)
                            }}
                            options={{
                                currency: "PHP",
                                clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`
                            }}
                            />
                        : <p></p>
                        }
            </Col>
          
                        {isActive === true ? 
                             user.id === null ? <Alert variant="info" className="text-center">You must log in to book a ride.</Alert>
                            : <Alert variant="info" className="text-center">Thank you for booking, Ride Safe.</Alert>
                            
                        :
                            <Alert variant="info" className="text-center">Generate a route</Alert>
                        }
            </Card>
            </Col>
            <Col xs={12} md={6}>
            <div className="mapContainer" ref={mapContainerRef} />
            </Col>
        </Row>
        </Card>
        <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title className="text-center">Record Route</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                {user.id === null
                ?<> 
                <Alert variant="info">You must be login to record your travel</Alert>
                    <Login />
                </> 
                :
                    <Card className="p-2 py3 ">
                    <Row className="m-0">
                        <Col md={12} xs={12} className=" body p-2 ">
                            <Card.Text className="head">
                                From: <br />{address}
                            </Card.Text>
                        </Col>
                        <Col md={12} xs={12} className=" body p-2">
                            <Card.Text className="head" >
                                Destination: <br />{finalDistination}
                            </Card.Text>
                        </Col>
                        <Col md={6} xs={6} className=" body p-2">
                            <Card.Text className="head">
                                Total Distance <br />{ToString(Math.round(distance))} meters
                            </Card.Text>
                        </Col>
                        <Col md={6} xs={6} className=" body p-2">
                            <Card.Text className="head">
                                Total Duration <br />{ToString(Math.round(duration/60))} minutes
                            </Card.Text>
                        </Col>
                    </Row>
                    {isActive === true
                        ? <Alert variant="info" className="text-center">Total Cost: &#8369; {numberWithCommas(amount)}</Alert>
                        : <Alert variant="info" className="text-center">Generate a route to book a ride.</Alert>
                        }
                </Card>
                }
                </Modal.Body>
            </Modal>
    </React.Fragment>
    )
}