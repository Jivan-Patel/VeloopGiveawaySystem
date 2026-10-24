import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Award, Coins, ArrowRight } from 'lucide-react';

export function Earn() {
  const ways = [
    {
      title: 'Platform Missions & Surveys',
      reward: '+250 VE',
      desc: 'Complete daily engagement tasks, product feedbacks, and interactive modules.',
      icon: <Zap className="text-emerald" size={24} />
    },
    {
      title: 'Milestone Streaks',
      reward: '+500 SVE',
      desc: 'Maintain a 7-day activity streak on VELOOP to unlock exclusive Super Veloop Entries.',
      icon: <Award className="text-gold" size={24} />
    },
    {
      title: 'Community Referrals',
      reward: '+1,000 Tokens',
      desc: 'Invite friends to VELOOP. Both of you receive instant reward tokens on signup.',
      icon: <Coins className="text-amber" size={24} />
    }
  ];

  return (
    <div className="container py-5">
      <div className="text-center py-4 mb-4">
        <h1 className="h2 fw-bold text-white mb-2">How to Earn Entries</h1>
        <p className="text-secondary-custom mx-auto" style={{ maxWidth: '580px' }}>
          Participate in activities across the VELOOP ecosystem to collect VE, SVE, and Reward Tokens for our exclusive prize draws.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {ways.map((w, i) => (
          <div key={i} className="col-12 col-md-4">
            <div className="card bg-surface border-subtle h-100 p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-3 bg-surface-elevated rounded-3">{w.icon}</div>
                <span className="badge bg-surface-elevated border border-subtle fs-6 text-gold">{w.reward}</span>
              </div>
              <h3 className="h5 fw-bold text-white mb-2">{w.title}</h3>
              <p className="small text-secondary-custom flex-grow-1">{w.desc}</p>
              <button className="btn btn-outline-light btn-sm mt-3 d-flex align-items-center justify-content-center gap-2">
                <span>Start Mission</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/giveaway" className="btn btn-primary-gradient px-4 py-2">
          Return to Active Giveaways
        </Link>
      </div>
    </div>
  );
}

export default Earn;
