import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { userAPI } from '../services/endpoints';
import { updateUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { User, Loader } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        currency: user.currency || 'USD',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await userAPI.updateProfile(data);
      dispatch(updateUser(res.data.data));
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-dark mb-8">Profile</h1>

      {/* Profile Avatar */}
      <div className="card mb-8 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-dark">{user?.firstName} {user?.lastName}</h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      {/* Edit Profile Form */}
      <div className="card max-w-2xl">
        <h3 className="text-2xl font-bold text-dark mb-6">Edit Profile</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="label-field">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className="input-field"
            />
            {errors.firstName && <p className="text-danger text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="label-field">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className="input-field"
            />
            {errors.lastName && <p className="text-danger text-sm mt-1">{errors.lastName.message}</p>}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="label-field">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="input-field bg-gray-100 cursor-not-allowed"
              disabled
            />
            <p className="text-sm text-gray-600 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="label-field">Phone Number</label>
            <input
              type="tel"
              {...register('phone')}
              className="input-field"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="label-field">Preferred Currency</label>
            <select {...register('currency')} className="input-field">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
