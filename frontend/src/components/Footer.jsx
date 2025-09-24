import React from 'react'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    
  <div className='md:mx-10'>
    
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '> 
      {/*------ left side ------*/}
      <div >
        <img className='w-40 cursor-pointer mb-5 ' src={logo} alt="" />
        <p className='w-full text-gray-600 md:w-2/3 leading-6'> 
        eDokta is a private digital Health organization that democratizes access to standard healthcare through the use of digital technology across socio-economic devide in Nigeria and other west African Countries. We provide quality and unique medical services at the comfort of your home, or your digital screen. Our portfolio cuts across digital Clinic (Teleconsultation, Home healthcare,
            Wellness Clinic & Medical Checkup,
            Medical tourism and booking,
            Travel Health), e-Pharmacy, Rural Digital Health, Takaful (Risk sharing) Health Insurance, Education and Training, and Digital Health Research
        </p>
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
        <li>+234-8034459339</li>
        <li>edokta@gmail.com</li>
      </ul>
      </div>
      </div>
      {/*------ cptyright Section ------*/}
        <div>
          <hr/>
          <p className='py-5 text-sm text-center'>Copyright 2025@ eDokta Healthcare.</p>
        </div>

    </div>
  )
}

export default Footer
