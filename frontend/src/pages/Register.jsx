import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { loginSuccess } from '../redux/slices/authSlice';
import { authAPI } from '../services/endpoints';
import { DollarSign, Mail, Lock, User, Loader } from 'lucide-react';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authAPI.register(registerData);
      dispatch(loginSuccess(response.data.data));
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <DollarSign size={32} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Expense Manager</h1>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
        <p className="text-center text-gray-400 mb-8">Start managing your finances today</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="label-field text-gray-300">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className="input-field"
              placeholder="John"
            />
            {errors.firstName && <p className="text-rose-400 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="label-field text-gray-300">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className="input-field"
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-rose-400 text-sm mt-1">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label-field text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-rose-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label-field text-gray-300">Password</label>
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

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
