import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../services/endpoints';
import { DollarSign, Mail, ArrowLeft, Loader } from 'lucide-react';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link';
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

        {!submitted ? (
          <>
            <h2 className="text-3xl font-bold text-center text-white mb-2">Forgot Password?</h2>
            <p className="text-center text-gray-400 mb-8">Enter your email and we'll send you a reset link</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
              <Mail className="text-blue-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Check Your Email</h3>
            <p className="text-gray-400 mb-6">We've sent a password reset link to your email address. Click the link to reset your password.</p>
            <p className="text-sm text-gray-500">The link expires in 1 hour.</p>
          </div>
        )}

        {/* Back Link */}
        <Link to=\"/login\" className=\"flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-medium mt-6 transition\">
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
