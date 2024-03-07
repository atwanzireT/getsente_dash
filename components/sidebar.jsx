// components/Sidebar.js

import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
            <Link href="/" className="nav-link">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
            <Link href="/loanRequests" className="nav-link">
              <i className="bi bi-grid"></i>
              <span>Loan Request</span>
            </Link>
            <Link href="/approvedLoans" className="nav-link">
              <i className="bi bi-grid"></i>
              <span>Approved Loan</span>
            </Link>
            <Link href="/declinedLoans" className="nav-link">
              <i className="bi bi-grid"></i>
              <span>Declined Loan</span>
            </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
