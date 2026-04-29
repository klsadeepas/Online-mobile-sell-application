import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../../store/slices/userSlice';
import { FiUsers, FiTrash2, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading, isDarkMode } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user account?')) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        toast.success('User removed');
      } catch (error) {
        toast.error(error || 'Failed to delete');
      }
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
          <FiUsers className="text-blue-500" /> Customer Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u._id} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm relative overflow-hidden group`}>
              <div className="flex items-center gap-4 mb-6">
                <img src={u.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="" className="w-16 h-16 rounded-full border-2 border-blue-500 p-0.5" />
                <div>
                  <h3 className="font-bold text-lg">{u.name}</h3>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{u.role}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2"><FiMail /> {u.email}</div>
                {u.phone && <div className="flex items-center gap-2"><FiPhone /> {u.phone}</div>}
                <div className="flex items-center gap-2"><FiCalendar /> Joined {new Date(u.createdAt).toLocaleDateString()}</div>
              </div>

              <button 
                onClick={() => handleDelete(u._id)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;