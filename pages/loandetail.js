import React from 'react'
import HeaderBar from '@/components/header';
import Sidebar from '@/components/sidebar';
import DataTableSection from '@/components/loanRequests';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoanDetailSection from '@/components/loanDetails';
import Link from 'next/link';
import "../app/page.module.css";
import "../app/globals.css";

export default function loandetail() {
  return (
    <div>
       <HeaderBar />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Dashboard</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active">Dashboard</li>
                        </ol>
                    </nav>
                </div>
                <LoanDetailSection />
            </main>
    </div>
  )
}
