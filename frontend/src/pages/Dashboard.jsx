import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { transactionAPI, budgetAPI } from '../services/endpoints';
import { fetchSuccess as fetchTransactionSuccess, fetchStart as fetchTransactionStart } from '../redux/slices/transactionSlice';
import { fetchStatusSuccess } from '../redux/slices/budgetSlice';
import toast from 'react-hot-toast';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactions, isLoading } = useSelector((state) => state.transaction);
  const { budgetStatus } = useSelector((state) => state.budget);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  const currentMonth = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchTransactionStart());
        
        // Fetch transactions for current month
        const transRes = await transactionAPI.getAll({
          startDate: `${currentMonth}-01`,
          endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
        });
        dispatch(fetchTransactionSuccess(transRes.data));

        // Fetch budget status
        const budgetRes = await budgetAPI.getStatus(currentMonth);
        dispatch(fetchStatusSuccess(budgetRes.data.data));

        // Calculate stats
        const income = transRes.data.data.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transRes.data.data.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;

        setStats({
          income,
          expenses,
          balance,
          transactionCount: transRes.data.data.length,
        });

        // Prepare chart data (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          last7Days.push({
            date: format(date, 'MMM dd'),
            income: 0,
            expenses: 0,
          });
        }

        transRes.data.data.forEach((t) => {
          const dayIndex = last7Days.findIndex((d) => d.date === format(new Date(t.date), 'MMM dd'));
          if (dayIndex !== -1) {
            if (t.type === 'income') {
              last7Days[dayIndex].income += t.amount;
            } else {
              last7Days[dayIndex].expenses += t.amount;
            }
          }
        });

        setChartData(last7Days);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };

    fetchData();
  }, [dispatch, currentMonth]);

  if (isLoading) return <LoadingSpinner />;

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  const categoryData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find((c) => c.name === t.category.name);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category.name, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview for {format(new Date(), 'MMMM yyyy')}</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Income */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold text-dark mt-2">${stats.income.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-secondary w-10 h-10" />
            </div>
          </div>

          {/* Expenses */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-danger mt-2">${stats.expenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="text-danger w-10 h-10" />
            </div>
          </div>

          {/* Balance */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Balance</p>
                <p className={`text-3xl font-bold mt-2 ${stats.balance >= 0 ? 'text-secondary' : 'text-danger'}`}>
                  ${stats.balance.toFixed(2)}
                </p>
              </div>
              <Calendar className="text-primary w-10 h-10" />
            </div>
          </div>

          {/* Transactions */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Transactions</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats.transactionCount}</p>
              </div>
              <Target className="text-primary w-10 h-10" />
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Income vs Expenses Chart */}
        <div className="lg:col-span-2 card">
          <h3 className="text-xl font-bold text-dark mb-6">Income vs Expenses (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Status */}
        {budgetStatus && (
          <div className="card">
            <h3 className="text-xl font-bold text-dark mb-6">Budget Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Spent</span>
                  <span className="font-bold">${budgetStatus.totalSpent.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min((budgetStatus.totalSpent / budgetStatus.totalLimit) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">of ${budgetStatus.totalLimit.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold text-dark mb-6">Top Spending Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <h3 className="text-xl font-bold text-dark mb-6">Recent Transactions</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {transactions.slice(0, 8).map((t) => (
                <div key={t._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-dark">{t.category.name}</p>
                    <p className="text-sm text-gray-600">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <p className={`font-bold ${t.type === 'income' ? 'text-secondary' : 'text-danger'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
