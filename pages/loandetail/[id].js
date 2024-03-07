import React from 'react'
import { useRouter } from 'next/router';
import HeaderBar from '@/components/header';
import Sidebar from '@/components/sidebar';
import DataTableSection from '@/components/loanRequests';
import "../../app/page.module.css";
import "../../app/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoanDetailSection from '@/components/loanDetails';
import Link from 'next/link';

export default function loandetail() {
  const router = useRouter();
  const { id } = router.query;

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
