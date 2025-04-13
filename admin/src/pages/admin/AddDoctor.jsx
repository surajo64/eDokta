import React, { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/adminContext";
import { useLoading } from '../../context/loadingContext';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [degree, setDegree] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [doctorFee, setDoctorFee] = useState("");
  const [specialityList, setSpecialityList] = useState([]); 
  const states = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", 
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", 
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe"
  ];
  const { setLoading } = useLoading();

  const { backendUrl, aToken } = useContext(AdminContext);

  // Fetch Specialities on Mount
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/speciality-list`, {
          headers: { aToken }
        });

        if (data.success) {
          setSpecialityList(data.specialityData);
        } else {
          toast.error("Failed to fetch specialities.");
        }
      } catch (error) {
        toast.error("Error fetching specialities.");
      }
    };

    fetchSpecialities();
  }, [backendUrl, aToken]);

  // Handle Speciality Change
  const handleSpecialityChange = (e) => {
    const selectedSpeciality = e.target.value;
    setSpeciality(selectedSpeciality);

    // Find the selected speciality's fees from the specialityList
    const selectedSpec = specialityList.find((item) => item.speciality === selectedSpeciality);
    if (selectedSpec) {
      setFees(selectedSpec.fee);
      setDoctorFee(selectedSpec.doctorFee);
    } else {
      setFees("");
      setDoctorFee("");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!docImg) {
      return toast.error("Please upload an image!");
    }

    try {
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("doctorFee", Number(doctorFee));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", address);
      formData.append("state", state);
      formData.append("gender", gender);
      formData.append("phone", phone);

      // API Request
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken },
      });

      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("");
        setFees("");
        setDoctorFee("");
        setAbout("");
        setSpeciality("");
        setDegree("");
        setAddress("");
        setGender("")
        setPhone("")
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding the doctor.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full mt-10">
      <form onSubmit={onSubmitHandler} className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6">Add Doctor</h2>

        <div className="bg-white py-8 px-8 border rounded w-full max-h-[80vh] overflow-y-scroll">

          {/* Image Upload */}
          <div className="flex items-center gap-4 text-gray-500 justify-center">
            <label htmlFor="doc-img" className="cursor-pointer">
              <img
                className="w-16 bg-gray-100 rounded-full mb-4"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt="Doctor"
              />
              <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden required />
            </label>
            <p>Upload Doctor<br />Image</p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            {/* Left Column */}
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" className="w-full p-2 border border-blue-200 rounded" required />
              <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="w-full p-2 border border-blue-200 rounded" required />
              <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="w-full p-2 border border-blue-200 rounded" required />

              {/* Speciality Dropdown */}
              <select onChange={handleSpecialityChange} value={speciality} className="w-full p-2 border border-blue-200 rounded" required>
                <option value="">Select Speciality</option>
                {specialityList.map((item) => (
                  <option key={item._id} value={item.speciality}>
                    {item.speciality}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => setState(e.target.value)}
                value={state}
                className="w-full p-2 border border-blue-200 rounded"
                required
              >
                <option value="" disabled>Doctor State of Residence</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>


              <input onChange={(e) => setDegree(e.target.value)} value={degree} type="text" placeholder="Qualification" className="w-full p-2 border border-blue-200 rounded" required />

              <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" placeholder="Phone Number" className="w-full p-2 border border-blue-200 rounded" required />

            </div>

            


            {/* Right Column */}
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <textarea onChange={(e) => setAbout(e.target.value)} value={about} placeholder="About" className="w-full p-2 border border-blue-200 rounded" required></textarea>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className="w-full p-2 border border-blue-200 rounded" required>
                <option value="">---Select Experience---</option>
                <option value="1-5 Years">1-5 Years</option>
                <option value="6-10 Years">6-10 Years</option>
                <option value="11-15 Years">11-15 Years</option>
                <option value="16-20 Years">16-20 Years</option>
                <option value="More than 20 Years">More than 20 Years</option>
              </select>

              <select onChange={(e) => setGender(e.target.value)} value={gender} className="w-full p-2 border border-blue-200 rounded" required>
                <option value="">---Select Gender---</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not Specified">Not Specified</option>
              </select>

              {/* Fee Fields (Read-only) */}
              <input value={fees} type="number" placeholder="Fees" className="w-full p-2 border border-blue-200 rounded bg-gray-100 cursor-not-allowed" readOnly />
              <input value={doctorFee} type="number" placeholder="Doctor Fee" className="w-full p-2 border border-blue-200 rounded bg-gray-100 cursor-not-allowed" readOnly />

              <textarea onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Doctors Facility Address" className="w-full p-2 border border-blue-200 rounded" required></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button type="submit" className="w-36 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
              Add Doctor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
