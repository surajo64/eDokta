import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>About <span className='text-gray-700 font-medium'> US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12 '>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className=' border border-blue-200 px-12 py-6 flex flex-col justify-center gap-6 md:w-2/3 text-sm text-gray-600 '>
          <p>eDokta is a private digital Health organization that democratizes access to standard healthcare through the use of digital technology across socio-economic devide in Nigeria and other west African Countries. We provide quality and unique medical services at the comfort of your home, or your digital screen. Our portfolio cuts across digital Clinic (Teleconsultation, Home healthcare,
            Wellness Clinic & Medical Checkup,
            Medical tourism and booking,
            Travel Health), e-Pharmacy, Rural Digital Health, Takaful (Risk sharing) Health Insurance, Education and Training, and Digital Health Research. 
            </p>

          <b className='text-gray-800'>Vision</b>
          <p>To be among the top providers of basic and advanced digital Healthcare in Nigeria and West Africa</p>

          <b className='text-gray-800'>Mission</b>
          <p>To provide quality healthcare using digital technology in a customer-friendly environment.</p>

        </div>
      </div>

      <div className=' text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20' >

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>
            Streamlined appointment scheduling that fits into your busy lifestyle.
          </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE:</b>
          <p>
            Access to a network of trusted healthcare professionals in your area.
          </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION:</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of your health.
          </p>
        </div>

      </div>
    </div>
  )
}

export default About
