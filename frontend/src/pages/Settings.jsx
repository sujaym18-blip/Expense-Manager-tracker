import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/endpoints';
import toast from 'react-hot-toast';
import { Loader, Lock, AlertCircle } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await userAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (password) => {
    setIsLoading(true);
    try {
      await userAPI.deleteAccount(password);
      toast.success('Account deleted successfully');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-dark mb-8">Settings</h1>

      {/* Change Password */}
      <div className="card max-w-2xl mb-8">
        <h3 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
          <Lock size={24} />
          Change Password
        </h3>

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="label-field">Current Password</label>
            <input
              type="password"
              {...register('currentPassword', { required: 'Current password is required' })}
              className="input-field"
            />
            {errors.currentPassword && <p className="text-danger text-sm mt-1">{errors.currentPassword.message}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="label-field">New Password</label>
            <input
              type="password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Min 6 characters' },
              })}
              className="input-field"
            />
            {errors.newPassword && <p className="text-danger text-sm mt-1">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label-field">Confirm New Password</label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Please confirm password' })}
              className="input-field"
            />
            {errors.confirmPassword && <p className="text-danger text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="card max-w-2xl border-2 border-danger">
        <h3 className="text-2xl font-bold text-danger mb-6 flex items-center gap-2">
          <AlertCircle size={24} />
          Delete Account
        </h3>

        <p className="text-gray-700 mb-6">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger"
          >
            Delete My Account
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const password = e.target.password.value;
              handleDeleteAccount(password);
            }}
            className="space-y-4"
          >
            <p className="text-gray-700 font-medium">Confirm by entering your password:</p>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              placeholder="Enter your password"
            />

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
