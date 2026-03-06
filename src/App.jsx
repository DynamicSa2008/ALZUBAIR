import React from 'react'
import Navbar from './assets/Components/Navbar/Navbar'
import Hero from './assets/Components/Hero'
import Services from './assets/Components/Services'
import About from './assets/Components/About'
import Partners from './assets/Components/Partners'
import WhyAlzubair from './assets/Components/WhyAlzubair'
import Features from './assets/Components/Features'
import Questions from './assets/Components/Questions'
import ContactForm from './assets/Components/Contact'
import Footer from './assets/Components/Footer/Footer'
ContactForm
WhyAlzubair
Partners
About
Services
Navbar
export default function () {
 return (
    <>
    <Navbar/>
    <Hero/>
    <Services/>
    <About/>
    <Partners/>
    <WhyAlzubair/>
    <Features/>
    <Questions/>
    <ContactForm />
    <Footer/>
    </>
  )
}
