import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { transactionAPI, categoryAPI } from '../services/endpoints';
import { fetchSuccess, fetchStart, deleteSuccess } from '../redux/slices/transactionSlice';
import { fetchSuccess as fetchCategoriesSuccess } from '../redux/slices/categorySlice';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading, pagination } = useSelector((state) => state.transaction);
  const [filters, setFilters] = useState({ type: '', category: '', search: '', page: 1 });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        dispatch(fetchStart());
        const params = {
          page: filters.page,
          limit: 10,
          ...(filters.type && { type: filters.type }),
          ...(filters.category && { category: filters.category }),
          ...(filters.search && { search: filters.search }),
        };
        const res = await transactionAPI.getAll(params);
        dispatch(fetchSuccess(res.data));
      } catch (error) {
        toast.error('Failed to load transactions');
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        setCategories(res.data);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };

    fetchTransactions();
    fetchCategories();
  }, [dispatch, filters]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        dispatch(deleteSuccess(id));
        toast.success('Transaction deleted successfully');
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-dark">Transactions</h1>
        <Link to="/transactions/add" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Transaction
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label-field">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="label-field">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="label-field">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search description..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-4 px-4 font-semibold text-dark">Date</th>
              <th className="text-left py-4 px-4 font-semibold text-dark">Category</th>
              <th className="text-left py-4 px-4 font-semibold text-dark">Description</th>
              <th className="text-right py-4 px-4 font-semibold text-dark">Amount</th>
              <th className="text-center py-4 px-4 font-semibold text-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">{format(new Date(t.date), 'MMM dd, yyyy')}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-lg">{t.category.icon}</span>
                    {t.category.name}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{t.description || '-'}</td>
                <td className={`py-4 px-4 text-right font-bold ${t.type === 'income' ? 'text-secondary' : 'text-danger'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </td>
                <td className="py-4 px-4 flex justify-center gap-3">
                  <Link
                    to={`/transactions/edit/${t._id}`}
                    className="text-primary hover:text-blue-600 p-2"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-danger hover:text-red-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No transactions found</p>
            <Link to="/transactions/add" className="text-primary font-medium mt-4 inline-block hover:underline">
              Add your first transaction
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center gap-2">
            Page {filters.page} of {pagination.pages}
          </span>
          <button
            disabled={filters.page === pagination.pages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
