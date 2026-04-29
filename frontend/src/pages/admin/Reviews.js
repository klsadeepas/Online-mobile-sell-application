import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { reviewAPI } from '../../utils/api';
import { FiMessageSquare, FiTrash2, FiCheck, FiX, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { isDarkMode } = useSelector((state) => state.theme);

  const fetchReviews = async () => {
    const { data } = await reviewAPI.getAllReviews();
    setReviews(data.reviews);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApproval = async (id, status) => {
    await reviewAPI.updateReview(id, { isApproved: status });
    toast.info(status ? 'Review approved' : 'Review hidden');
    fetchReviews();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      await reviewAPI.deleteReview(id);
      toast.success('Review deleted');
      fetchReviews();
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3"><FiMessageSquare className="text-blue-500" /> Review Moderation</h1>

        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r._id} className={`p-6 rounded-3xl border flex flex-col md:flex-row gap-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">{r.user?.name}</span>
                  <span className="text-gray-400">on</span>
                  <span className="text-blue-500 font-medium">{r.product?.name}</span>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < r.rating ? "currentColor" : "none"} />)}
                </div>
                <p className="italic opacity-80">"{r.comment}"</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleApproval(r._id, !r.isApproved)} className={`p-3 rounded-xl ${r.isApproved ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {r.isApproved ? <FiX /> : <FiCheck />}
                </button>
                <button onClick={() => handleDelete(r._id)} className="p-3 bg-red-100 text-red-700 rounded-xl"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;