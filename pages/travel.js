import Head from 'next/head'
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/StreetNavigation'))

export default function travel(){
    return(
        <React.Fragment>
            <Head>
                <title>Book a Ride</title>          
            </Head>
            <DynamicComponent />
        </React.Fragment>
    )
}