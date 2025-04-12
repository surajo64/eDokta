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
          <p>KIRCT Kilimanjaro Hospital is a private hospital located at the Kano Independent Research Centre Trust (KIRCT) in Kano, Nigeria. We provide quality and unique medical and surgical services and training to our clients in an ambient and friendly environment. The hospital has combined local and expatriate medical experts working harmoniously to provide excellent world-class services with a local touch. The target clients include those from Kano, Nigeria and neighboring West African countries with a strong desire to reduce and reverse medical tourism in the long run.</p>

          <b className='text-gray-800'>Vision</b>
          <p>To be among the top providers of advanced medical and surgical services and training in Nigeria and Sub-Saharan Africa</p>

          <b className='text-gray-800'>Mission</b>
          <p>To provide advanced medical and surgical services and training with incorporation of technology in a customer-friendly environment</p>

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

        <div  className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
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
