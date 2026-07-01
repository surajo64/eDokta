import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/adminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLoading } from '../../context/loadingContext';

const AllEducators = () => {
  const { aToken, getAllAdmin, admins, backendUrl } = useContext(AdminContext);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [editingEducator, setEditingEducator] = useState(null);
  const { setLoading } = useLoading();

  const filteredEducators = admins?.filter(item => item.role === 'educator') || [];

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (editingEducator) {
        const formData = { name, email };
        if (editingEducator.email === email) {
          delete formData.email;
        }

        const { data } = await axios.post(
          `${backendUrl}/api/admin/update-admin`,
          { adminId: editingEducator._id, ...formData },
          { headers: { aToken } }
        );

        if (data.success) {
          toast.success("Educator updated successfully!");
          setShowForm(false);
          getAllAdmin();
        }
      } else {
        const password = event.target.password.value;
        const { data } = await axios.post(
          `${backendUrl}/api/educator/register`,
          { name, email, phone, role: 'educator', about, password },
          { headers: { atoken: aToken } }
        );

        if (data.success) {
          toast.success("Educator added successfully!");
          setName("");
          setEmail("");
          setPhone("");
          setAbout("");
          setShowForm(false);
          getAllAdmin();
        } else {
          toast.error(data.message || "Failed to add educator.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingEducator(null);
    setName("");
    setEmail("");
    setPhone("");
    setAbout("");
    setShowForm(true);
  };

  const handleUpdate = (item) => {
    setEditingEducator(item);
    setName(item.name);
    setEmail(item.email);
    setPhone(item.phone || "");
    setAbout(item.about || "");
    setShowForm(true);
  };

  const educatorStatus = async (educatorId) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/admin-status`,
        { adminID: educatorId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message || "Status updated successfully!");
        getAllAdmin();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating educator status:", error);
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
    <div className='w-full max-w-6xl m-5 select-none'>
      <p className='mb-3 text-xl font-medium'>Educator List</p>
      <button
        onClick={handleAddNew}
        className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-600 transition mb-6"
      >
        Add Educator
      </button>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-scroll shadow-xs'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_3fr_2fr_2fr] py-3 px-6 border-b font-semibold bg-gray-50 text-gray-700'>
          <p>#</p>
          <p>Educator Name</p>
          <p>Email</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {filteredEducators.length > 0 ? (
          filteredEducators.map((item, index) => (
            <div key={index} className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_3fr_2fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-blue-50/50 transition-colors">
              <p className="font-medium text-gray-900">{index + 1}</p>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p>{item.email}</p>
              <p className={item.isActive !== false ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                {item.isActive !== false ? 'Active' : 'Inactive'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => educatorStatus(item._id)}
                  className={`text-white text-xs px-3 py-1 rounded-full shadow-xs hover:shadow active:scale-95 transition-all ${
                    item.isActive !== false ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {item.isActive !== false ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => handleUpdate(item)}
                  className="bg-green-500 hover:bg-green-600 active:scale-95 text-white text-xs px-3 py-1 rounded-full shadow-xs hover:shadow transition-all"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-500">No educators found.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl relative mx-4">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
              {editingEducator ? "Update Educator" : "Add New Educator"}
            </h2>
            <form onSubmit={onSubmitHandler} className="space-y-4">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {!editingEducator && (
                <>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-1">About Info</label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      required
                      rows="2"
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-sm hover:shadow active:scale-95"
              >
                {editingEducator ? "Update Educator" : "Add Educator"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEducators;
