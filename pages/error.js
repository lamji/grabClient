import Head from 'next/head'
import Banner from '../components/Banner'

export default function error() {
  const data ={
    title: "Something went wrong",
    content: "Please try again later." 
  }
  return (
    <>
      <Head>
        <title>Oops...</title>
      </Head>
      <Banner data={data} />
    </>
  )
}