import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { budgetAPI, categoryAPI } from '../services/endpoints';
import { fetchSuccess, fetchStart, fetchFailure } from '../redux/slices/budgetSlice';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const Budget = () => {
  const dispatch = useDispatch();
  const { budgets = [], isLoading } = useSelector((state) => state.budget);

  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const [formData, setFormData] = useState({
    limit: '',
    category: '',
    month: format(new Date(), 'yyyy-MM'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchStart());

        // Fetch budgets and categories simultaneously
        const [budRes, catRes] = await Promise.all([
          budgetAPI.getAll({ month: selectedMonth }),
          categoryAPI.getAll({ type: 'expense' })
        ]);

        const budgetData = Array.isArray(budRes.data)
          ? budRes.data
          : budRes.data?.data || [];

        // Handle category data - check data property first, then fallback to direct array
        const categoryData = Array.isArray(catRes.data?.data)
          ? catRes.data.data
          : Array.isArray(catRes.data)
          ? catRes.data
          : [];

        // Update local state first
        setCategories(categoryData);
        
        // Then dispatch to Redux to set isLoading to false
        dispatch(fetchSuccess(budgetData));

      } catch (error) {
        console.error(error);
        toast.error('Failed to load budgets and categories');
        dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch data'));
      }
    };

    fetchData();
  }, [dispatch, selectedMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.limit || !formData.category) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await budgetAPI.create({
        ...formData,
        month: selectedMonth,
      });

      toast.success('Budget created successfully');

      setFormData({
        limit: '',
        category: '',
        month: selectedMonth,
      });

      setShowForm(false);

      const budRes = await budgetAPI.getAll({ month: selectedMonth });
      const budgetData = Array.isArray(budRes.data)
        ? budRes.data
        : budRes.data?.data || [];

      // Also refresh categories
      const catRes = await categoryAPI.getAll({ type: 'expense' });
      const categoryData = Array.isArray(catRes.data?.data)
        ? catRes.data.data
        : Array.isArray(catRes.data)
        ? catRes.data
        : [];
      setCategories(categoryData);

      dispatch(fetchSuccess(budgetData));
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create budget';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await budgetAPI.delete(id);

        toast.success('Budget deleted');

        const budRes = await budgetAPI.getAll({ month: selectedMonth });
        const budgetData = Array.isArray(budRes.data)
          ? budRes.data
          : budRes.data?.data || [];

        // Also refresh categories
        const catRes = await categoryAPI.getAll({ type: 'expense' });
        const categoryData = Array.isArray(catRes.data?.data)
          ? catRes.data.data
          : Array.isArray(catRes.data)
          ? catRes.data
          : [];
        setCategories(categoryData);

        dispatch(fetchSuccess(budgetData));
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-dark">Monthly Budgets</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Budget
        </button>
      </div>

      {/* Month Selector */}
      <div className="mb-8 flex gap-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-8">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="label-field">Category</label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="input-field"
              >
                <option value="">Select category</option>

                {(Array.isArray(categories) ? categories : []).map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Budget Limit ($)</label>

              <input
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    limit: e.target.value,
                  })
                }
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-end gap-3">
              <button type="submit" className="btn-primary flex-1">
                Create Budget
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(budgets) ? budgets : []).map((budget) => (
          <div key={budget._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-2xl">{budget.category?.icon}</p>
                <h3 className="text-lg font-bold text-dark">
                  {budget.category?.name}
                </h3>
              </div>

              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Edit2 size={16} className="text-primary" />
                </button>

                <button
                  onClick={() => handleDelete(budget._id)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Trash2 size={16} className="text-danger" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="font-bold">
                    ${budget.spent?.toFixed(2) || '0.00'}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition ${
                      budget.percentageSpent >= 100
                        ? 'bg-danger'
                        : budget.percentageSpent >= 80
                        ? 'bg-warning'
                        : 'bg-secondary'
                    }`}
                    style={{
                      width: `${Math.min(budget.percentageSpent || 0, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-600 mt-1">
                  {(budget.percentageSpent || 0).toFixed(1)}% of $
                  {(budget.limit || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm text-gray-600">Remaining</span>

                <span
                  className={`font-bold ${
                    budget.remaining >= 0
                      ? 'text-secondary'
                      : 'text-danger'
                  }`}
                >
                  ${(budget.remaining || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12 card">
          <p className="text-gray-600 text-lg mb-4">No budgets set yet</p>

          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create your first budget
          </button>
        </div>
      )}
    </div>
  );
};

export default Budget;
