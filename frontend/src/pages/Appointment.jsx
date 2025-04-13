import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/relatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLoading } from '../context/loadingContext';

const Appointment = () => {
  const { docId } = useParams();

  const { doctors, currencySymbol, backendUrl, getDoctorsData, token } = useContext(AppContext);
  const navigate = useNavigate();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [type, setType] = useState("");
  const { setLoading } = useLoading();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  };


  const getAvailbleSlot = async () => {
    setDocSlots([]);

    let today = new Date();
    for (let i = 0; i < 7; i++) { // ✅ Fixed loop condition
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "-" + month + "-" + year
        const slotTime = formattedTime;

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          // add slot to an array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }


        currentDate.setMinutes(currentDate.getMinutes() + 30); // ✅ Fixed incorrect `setMilliseconds()`
      }

      setDocSlots(prev => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please Login to Book an Appointment!")
      return navigate('/login')
    }
    setLoading(true);
    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1;
      let year = date.getFullYear()

      const slotDate = day + "-" + month + "-" + year

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime, type }, { headers: { token } })
      console.log(data)

      if (data.success) {
        toast.success(data.message)
        await getDoctorsData();
        navigate('/my-appointment')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailbleSlot();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return docInfo && (
    <div>
      {/*------ Doctors Detail -------*/}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className="flex-1 border border-gray-400 py-7 rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/*------ Name, Degree, etc -------*/}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-4" src={assets.verified_icon} alt="Verified" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>

          {/*------ About Doctor -------*/}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-500 max-w-lg mt-1">{docInfo.about}</p>
          </div>

          {/*------ Appointment Fee -------*/}
          <p className="text-gray-500 font-medium mt-4 mb-6">
            Appointment Fee: <span className="text-gray-700">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>
      {/*------ Bookin Slot -------*/}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light px-5 py-2 flex-shrink-0 rounded-full cursor-pointer
                  ${item.time === slotTime ? 'bg-primary text-white' : 'border border-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))

          }

        </div>

        <div>
          <select onChange={(e) => setType(e.target.value)} value={type} className="px-5 py-3 mt-6 text-smborder border border-blue-200 rounded" required>
            <option value="">Select Type of Appointment</option>
            <option value="telemedicine">Telemedicine Booking</option>
            <option value="facility">Facility Booking</option>
          </select>
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white px-5 py-3 rounded-full font-light mt-6 text-sm '>Book an Appointment</button>

      </div>
      {/*-------Related Doctors -------*/}

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div >

  );
};

export default Appointment;
