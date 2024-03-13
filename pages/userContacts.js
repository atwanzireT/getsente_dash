import { useEffect, useState } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { firebase_firestore } from '@/firebaseconfig';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react'
import HeaderBar from '@/components/header';
import Sidebar from '@/components/sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import "../app/page.module.css";
import "../app/globals.css";

export default function userContacts() {
    const id = Cookies.get("id");
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [userContacts, setUserContacts] = useState([]);

    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return; // Ensure id is available before fetching data

            setLoading(true);
            try {
                // Fetch user info
                const userInfoRef = collection(firebase_firestore, "NIDinfo");
                const userInfoQuery = query(userInfoRef, where("userUID", "==", id));
                const userInfoSnapshot = await getDocs(userInfoQuery);
                const userInfoData = userInfoSnapshot.docs.map(doc => doc.data());
                setUserInfo(userInfoData);

                // Extract user contacts from userInfoData
                const contacts = userInfoData.map(user => user.userContacts);
                // Flatten the array of contacts arrays
                const allContacts = contacts.flat();
                setUserContacts(allContacts);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
                <section className="section profile">
                    <div className="row">
                        {userInfo.map((user, index) => (
                            <div className="col-xl-12" key={index}>
                                <div className="card">
                                    <div className="card-body pt-4 d-flex flex-column">
                                        <h3 className="card-title">User Details</h3>
                                        <div className="row">
                                            <h6 className="col-lg-5 col-md-6 label ">UserID</h6>
                                            <p className="col-lg-7 col-md-6">{user.userUID}</p>
                                        </div>
                                        {/* Other user details rendering code remains the same */}
                                        {/* Render user contacts */}
                                        <h6 className="col-lg-5 col-md-6 label">User Contacts</h6>
                                        <div className="col-lg-7 col-md-6">
                                            {userContacts.map((contact, index) => (
                                                <div key={index}>
                                                    <p>{contact.name}</p>
                                                    {/* Render phone numbers */}
                                                    <ul>
                                                        {contact.phoneNumbers.map((number, index) => (
                                                            <li key={index}>{number}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>

    );
};
