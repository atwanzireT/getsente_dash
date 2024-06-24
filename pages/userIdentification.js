import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebase_firestore } from "@/firebaseconfig";
import HeaderBar from "@/components/header";
import Sidebar from "@/components/sidebar";
import "../app/page.module.css";
import "../app/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from "next/image";

const UserIdentification = () => {
    const id = Cookies.get("id");
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log("User ID: ", id);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const userInfoRef = doc(firebase_firestore, "NIDinfo", id);
                const userInfoSnap = await getDoc(userInfoRef);

                if (userInfoSnap.exists()) {
                    const userInfoData = userInfoSnap.data();
                    setUserInfo(userInfoData);
                    console.log("User Data: ", userInfoData);
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

    return (
        <div>
            <HeaderBar />
            <Sidebar />
            <main id="main" className="main">
                {loading ? (
                    <p>Loading...</p>
                ) : userInfo ? (
                    <section className="section profile">
                        <Image width={400} height={200} src={userInfo.idURL} alt="User ID" />
                    </section>
                ) : (
                    <p>No user information found.</p>
                )}
            </main>
        </div>
    );
}

export default UserIdentification;
