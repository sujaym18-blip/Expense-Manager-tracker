import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { transactionAPI, categoryAPI } from '../services/endpoints';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader } from 'lucide-react';
import { format } from 'date-fns';

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Added `watch` and defaultValues to handle the transaction type state cleanly
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      type: 'expense'
    }
  });
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Using `watch` to track the type for filtering categories, replacing the buggy custom onChange
  const transactionType = watch('type');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        const catData = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setCategories(catData);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };

    const fetchTransaction = async () => {
      if (id) {
        try {
          const res = await transactionAPI.getOne(id);
          const t = res.data.data;
          reset({
            type: t.type,
            amount: t.amount,
            // 3. Added safe fallback: works whether the backend populates the category object or just sends the string ID
            category: t.category?._id || t.category, 
            description: t.description,
            date: format(new Date(t.date), 'yyyy-MM-dd'),
          });
        } catch (error) {
          toast.error('Failed to load transaction');
        }
      }
    };

    fetchCategories();
    fetchTransaction();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (id) {
        await transactionAPI.update(id, data);
        toast.success('Transaction updated successfully');
      } else {
        await transactionAPI.create(data);
        toast.success('Transaction created successfully');
      }
      navigate('/transactions');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save transaction';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = (categories || []).filter((cat) => cat.type === transactionType || cat.type === 'both');

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/transactions')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} className="text-dark" />
        </button>
        <h1 className="text-4xl font-bold text-dark">{id ? 'Edit' : 'Add'} Transaction</h1>
      </div>

      {/* Form */}
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Type */}
          <div>
            <label className="label-field">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="income"
                  {...register('type', { required: true })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 font-medium">Income</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="expense"
                  {...register('type', { required: true })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 font-medium">Expense</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label-field">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="input-field"
            >
              <option value="">Select a category</option>
              {(filteredCategories || []).map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-danger text-sm mt-1">{errors.category.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="label-field">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-danger text-sm mt-1">{errors.amount.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="label-field">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="input-field"
            />
            {errors.date && <p className="text-danger text-sm mt-1">{errors.date.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label-field">Description (Optional)</label>
            <textarea
              {...register('description')}
              className="input-field"
              placeholder="Add a note..."
              rows="4"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
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
                id ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;