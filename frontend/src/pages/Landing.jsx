import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, PieChart, Lock, BarChart3, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container-custom h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-300">
            <DollarSign size={28} />
            <span>Expense Manager</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 text-blue-300 font-medium hover:text-blue-200 transition">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Take Control of Your <span className="text-blue-400">Finances</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Track expenses, manage budgets, and visualize your spending with our powerful expense management application.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn-primary px-8 py-3 text-lg">
            Start Free
          </Link>
          <Link to="/login" className="px-8 py-3 border-2 border-blue-400/50 text-blue-300 font-medium rounded-xl hover:bg-blue-500/20 backdrop-blur-md transition">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: 'Track Transactions',
              desc: 'Easily record and categorize all your income and expenses in one place.',
            },
            {
              icon: PieChart,
              title: 'Visual Analytics',
              desc: 'Get insights with beautiful charts and graphs of your spending patterns.',
            },
            {
              icon: BarChart3,
              title: 'Budget Planning',
              desc: 'Set monthly budgets and get alerts when you\'re about to exceed limits.',
            },
            {
              icon: Lock,
              title: 'Secure & Private',
              desc: 'Your financial data is encrypted and secured with industry standards.',
            },
            {
              icon: Zap,
              title: 'Fast & Responsive',
              desc: 'Lightning-fast interface that works seamlessly on all devices.',
            },
            {
              icon: DollarSign,
              title: 'Multi-Currency',
              desc: 'Support for multiple currencies to manage finances globally.',
            },
          ].map((feature, i) => (
            <div key={i} className="card text-center hover:shadow-lg transition">
              <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600/20 to-blue-400/20 backdrop-blur-md border border-blue-400/20 text-white py-20 mt-20 rounded-3xl mx-4">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Master Your Money?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of users who are taking control of their finances today.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3 inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 text-gray-300 py-8 mt-20 border-t border-white/10">
        <div className="container-custom text-center">
          <p>© 2024 Expense Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
