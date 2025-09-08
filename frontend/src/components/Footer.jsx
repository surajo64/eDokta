import React from 'react'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    
  <div className='md:mx-10'>
    
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '> 
      {/*------ left side ------*/}
      <div >
        <img className='w-40 cursor-pointer mb-5 ' src={logo} alt="" />
        <p className='w-full text-gray-600 md:w-2/3 leading-6'> KIRCT Kilimanjaro Hospital is a private hospital located at the Kano Independent Research Centre Trust (KIRCT) in Kano, Nigeria. We provide quality and unique medical and surgical services and training to our clients in an ambient and friendly environment. The hospital has combined local and expatriate medical experts working harmoniously to provide excellent world-class services with a local touch. </p>
      </div>

      {/*------ Center Section ------*/}
      
      <div>
        <div className='w-40 mb-5 '></div>
      <h1 className='text-xl font-medium mb-5'>HOSPITAL</h1>
      <ul className='flex flex-col gap-2 text-gray-600'>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
        <li>Privacy & Policy</li>
      </ul>
      </div>

      {/*------ Right Section ------*/}
      
      <div>
      <div className='w-40 mb-5 '></div>
      <h1 className='text-xl font-medium mb-5'>Get In Touch!</h1>
      <ul className='flex flex-col gap-2 text-gray-600'>
        <li>+234-7035400899</li>
        <li>danja.umar@kirct.com</li>
      </ul>
      </div>
      </div>
      {/*------ cptyright Section ------*/}
        <div>
          <hr/>
          <p className='py-5 text-sm text-center'>Copyright 2025@ kirct kilimanjaro hospital.com</p>
        </div>

    </div>
  )
}

export default Footer
