import React from 'react'
import "../app/page.module.css";
import "../app/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderBar from "../components/header";
import Sidebar from "../components/sidebar";
import Dashboard from "../components/dashboard";
import Link from 'next/link';

export default function index() {
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
                <Dashboard />
            </main>
        </div>
    )
}
