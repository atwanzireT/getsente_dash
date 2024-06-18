import { useEffect, useState } from 'react';
import { collection, getDocs, where, query, doc, getDoc } from 'firebase/firestore';
import { firebase_firestore } from '@/firebaseconfig';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import HeaderBar from '@/components/header';
import Sidebar from '@/components/sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import "../app/page.module.css";
import "../app/globals.css";

export default function UserContacts() {
    const id = Cookies.get("id");
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [userContacts, setUserContacts] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setLoading(true);
            try {
                // Fetch user information
                const userInfoRef = collection(firebase_firestore, "NIDinfo");
                const userInfoQuery = query(userInfoRef, where("userUID", "==", id));
                const userInfoSnapshot = await getDocs(userInfoQuery);
                const userInfoData = userInfoSnapshot.docs.map(doc => doc.data());
                setUserInfo(userInfoData);

                // Fetch user contacts
                const contactDocRef = doc(firebase_firestore, "userContacts", id);
                const contactDocSnap = await getDoc(contactDocRef);
                if (contactDocSnap.exists()) {
                    setUserContacts(contactDocSnap.data().userContact || []);
                    console.log("Loading User Contacts: ", contactDocSnap.data().userContact);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

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
                                        <h3 className="card-title">User Contacts</h3>
                                        <div className="row">
                                    
                                            <div className="col-lg-7 col-md-6">
                                                {userContacts.length > 0 ? (
                                                    userContacts.map((contact, idx) => (
                                                        <div key={idx} className="contact-info">
                                                            <p><strong>Name:</strong> {contact.name}</p>
                                                            {contact.phoneNumbers.map((phone, phoneIdx) => (
                                                                <p key={phoneIdx}><strong>Phone:</strong> {phone}</p>
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No contacts found.</p>
                                                )}
                                            </div>
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
}
