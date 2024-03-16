import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from "firebase/auth";
import { firebase_auth } from "@/firebaseconfig";

const Sidebar = () => {
  const router = useRouter();

  const handleSignOut = () => {
    signOut(firebase_auth)
      .then(() => {
        // Sign-out successful.
        router.push("/");
        // You can redirect the user or perform any other action after sign-out.
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out: ", error);
      });
  };

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link href="/" className="nav-link">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/loanRequests" className="nav-link">
            <i className="bi bi-grid"></i>
            <span>Loan Request</span>
          </Link>
        </li >
        <li className="nav-item">
          <Link href="/approvedLoans" className="nav-link">
            <i className="bi bi-grid"></i>
            <span>Approved Loan</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/declinedLoans" className="nav-link">
            <i className="bi bi-grid"></i>
            <span>Declined Loan</span>
          </Link>
        </li>
        <li className="nav-item">
          <button onClick={handleSignOut} className="nav-link">
            <span>Sign out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
