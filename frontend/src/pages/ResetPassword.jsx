import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { loginSuccess } from '../redux/slices/authSlice';
import { authAPI } from '../services/endpoints';
import { DollarSign, Lock, Loader, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center border border-white/10">
          <h2 className="text-2xl font-bold text-rose-400 mb-2">Invalid Link</h2>
          <p className="text-gray-400 mb-6">This password reset link is invalid or expired.</p>
          <Link to="/forgot-password" className="btn-primary inline-block">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      dispatch(loginSuccess(response.data.data));
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <DollarSign size={32} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Expense Manager</h1>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">Reset Password</h2>
        <p className="text-center text-gray-400 mb-8">Enter your new password</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Password */}
          <div>
            <label className="label-field text-gray-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-rose-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label-field text-gray-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="password"
                {...register('confirmPassword', { required: 'Please confirm password' })}
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-rose-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {/* Back Link */}
        <Link to="/login" className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-medium mt-6 transition">
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
