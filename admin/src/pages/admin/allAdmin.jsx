import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/adminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLoading } from '../../context/loadingContext';

const allAdmin = () => {
  const { aToken, getAllAdmin, admins, backendUrl, } = useContext(AdminContext);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const { setLoading } = useLoading();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = { name, email };

      // Send password only if it's a new admin
      if (!editingAdmin) {
        formData.password = event.target.password.value;
      }

      if (editingAdmin) {
        // Only send email if it's actually changed
        if (editingAdmin.email === email) {
          delete formData.email; // Avoid triggering duplicate check
        }

        const { data } = await axios.post(
          `${backendUrl}/api/admin/update-admin`,
          { adminId: editingAdmin._id, ...formData },
          { headers: { aToken } }
        );

        if (data.success) {
          toast.success("Admin updated successfully!");
          setShowForm(false);
          getAllAdmin();
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/admin/add-admin`, formData, { headers: { aToken } });

        if (data.success) {
          toast.success("Admin Added successfully!");
          setName("");
          setEmail("");
          setShowForm(false);
          getAllAdmin();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally { // Keep loading for an additional 2 seconds
        setLoading(false);  
    }
  };


  const handleAddNew = () => {
    setEditingAdmin(null);
    setName("");
    setEmail("");
    setShowForm(true);
  };

  const handleUpdate = (item) => {
    setEditingAdmin(item);
    setName(item.name);
    setEmail(item.email);
    setShowForm(true);
  };

  const adminStatus = async (adminID) => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/admin-status', { adminID }, { headers: { aToken } })
      console.log("Sending adminId:", adminID);

      if (data.success) {
        toast.success(data.message)
        getAllAdmin(); 
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error Updating Admin Statu:", error);
      toast.error("Something went wrong.");
    } finally { 
      setLoading(false);  
  }
  };


  useEffect(() => {
    if (aToken) {
      getAllAdmin();
    }
  }, [aToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-xl font-medium '>All Admin</p>
      <button
        onClick={handleAddNew}
        className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-600 transition mb-6 items-left justift-left">
        Add Admin
      </button>
      <div className='bg-white border-rounded text-sm max-h-[80vh] min-h-[60vh] overflow-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_3fr_2fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Admin Name</p>
          <p>Email</p>
          <p>Actions</p>
        </div>

        {admins?.length > 0 ? (
          admins.map((item, index) => (
            <div key={index} className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_3fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-blue-50">
              <p>{index + 1}</p>
              <p>{item.name}</p>
              <p>{item.email}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => adminStatus(item._id)}
                  className={`text-white text-sm px-3 py-1 rounded-full ${item.isActive ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                  {item.isActive ? 'Deactivate' : 'Active'}</button>

                <button onClick={() => handleUpdate(item)} className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">Update</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-5 text-gray-500">No admins found.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md relative">
            <button onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">{editingAdmin ? "Update Admin" : "Add New Admin"}</h2>
            <form onSubmit={onSubmitHandler} className="space-y-4">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Full Name</label>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Email</label>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {!editingAdmin && (
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Password</label>
                  <input type="password" name="password" required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
                {/* Submit Button */}
                <button
                type="submit"
              
                className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
              >
                { editingAdmin ? "Update Admin" : "Add Admin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default allAdmin;