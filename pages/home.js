import React, { useEffect, useState } from 'react'
import "../app/page.module.css";
import "../app/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderBar from "../components/header";
import Sidebar from "../components/sidebar";
import Dashboard from "../components/dashboard";
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from '@/firebaseconfig';
import NoAcc from '@/components/noAcc';

export default function Home() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        // Set up Firebase auth state observer
        const unsubscribe = onAuthStateChanged(firebase_auth, (user) => {
            if (user) {
                // User is signed in.
                setIsAuth(true);
            } else {
                // User is signed out.
                setIsAuth(false);
            }
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

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
                {isAuth ? <Dashboard /> :
                <NoAcc />}
            </main>
        </div>
    )
}
