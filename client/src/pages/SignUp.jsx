import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/giveaway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="card bg-surface border-subtle p-4 p-md-5 shadow-lg" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle bg-surface-elevated text-gold mb-2">
            <UserPlus size={28} />
          </div>
          <h1 className="h3 fw-bold text-white">Create Account</h1>
          <p className="small text-secondary-custom">Join VELOOP Rewards and start collecting entries</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small text-secondary-custom">Email Address</label>
            <input
              type="email"
              className="form-control bg-surface-elevated text-white border-subtle"
              value={email}
              placeholder="you@domain.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label small text-secondary-custom">Password</label>
            <input
              type="password"
              className="form-control bg-surface-elevated text-white border-subtle"
              value={password}
              placeholder="Create a strong password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-gold-gradient py-2 fw-bold mt-2">
            {loading ? 'Creating Account…' : 'Register & Get 1,000 VE'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-subtle">
          <span className="small text-muted-custom">Already have an account? </span>
          <Link to="/login" className="small text-gold fw-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
