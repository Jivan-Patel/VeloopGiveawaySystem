import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="container py-5 text-center my-auto">
      <div className="d-inline-flex p-3 rounded-circle bg-surface-elevated text-warning mb-3">
        <AlertCircle size={40} />
      </div>
      <h1 className="h2 fw-bold text-white mb-2">404 — Page Not Found</h1>
      <p className="text-secondary-custom mb-4">The giveaway or resource you are looking for does not exist or has been archived.</p>
      <Link to="/giveaway" className="btn btn-primary-gradient px-4 py-2">
        Return to Giveaways
      </Link>
    </div>
  );
}

export default NotFound;
