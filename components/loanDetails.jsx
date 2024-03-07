import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, where, doc, updateDoc } from 'firebase/firestore';
import { firebase_firestore } from '@/firebaseconfig';
import { query } from 'firebase/database';

const LoanDetailSection = () => {
    const router = useRouter();

    const [id, setId] = useState(null); // Initialize to null
    const [loading, setLoading] = useState(true); // Set loading to true initially
    const [loanData, setLoanData] = useState([]);
    const [value, setValue] = useState('');
    const [statusUpdated, setStatusUpdated] = useState(false);
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        setId(router.query.id);
    }, [router.query.id]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (id) {
                    const userInfoRef = collection(firebase_firestore, "NIDinfo");
                    const q = query(userInfoRef, where("userUID", "==", id));
                    const querySnapshot = await getDocs(q);
                    const UserInfoData = [];
                    querySnapshot.forEach((doc) => {
                        UserInfoData.push(doc.data());
                    });
                    setUserInfo(UserInfoData);
                    setLoading(false); // Set loading to false after data is fetched
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };


        const fetchLoanData = async () => {
            try {
                if (id) {
                    const loanRef = collection(firebase_firestore, 'loanRequest');
                    const q = query(loanRef, where("userUID", "==", id));
                    const querySnapshot = await getDocs(q);
                    const UserLoanData = [];

                    querySnapshot.forEach((doc) => {
                        UserLoanData.push({ ...doc.data(), id: doc.id });
                    });

                    if (UserLoanData.length > 0) {
                        setLoanData(UserLoanData);
                        setValue(UserLoanData[0].status); // Set value to the initial status
                        console.log("STATUS: ", UserLoanData[0].status); // Log the updated value immediately
                        if (UserLoanData[0].status === "Pending") {
                            setStatusUpdated(true);
                        }
                    }

                }
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching loan data:", error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchLoanData();
        fetchUserInfo();
    }, [id]);

    // Update status immediately after setting it
    useEffect(() => {
        console.log("STATUS: ", value);
        console.log("User Info: ", userInfo);
    }, [value]);


    const handleStatusChange = async (e, loanId) => {
        const newStatus = e.target.value;
        setValue(newStatus); // Update value with the selected status
        try {
            const loanDocRef = doc(firebase_firestore, 'loanRequest', loanId);
            await updateDoc(loanDocRef, {
                status: newStatus
            });
            alert('Loan status updated successfully');
            router.push("/"); // Use router.push from the initialized router object
        } catch (error) {
            console.error('Error updating loan status:', error);
        }
    };

    return (
        <section className="section profile">

            <div className="row" >
                {userInfo.map((user, index) => (
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-body pt-4 d-flex flex-column">
                            <h3 className="card-title">User Details</h3>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">UserID</h6>
                                    <p className="col-lg-7 col-md-6">{user.userUID}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Name</h6>
                                    <p className="col-lg-7 col-md-6">{user.firstname} {user.othername}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Email</h6>
                                    <p className="col-lg-7 col-md-6">{user.useremail}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">NIN Number</h6>
                                    <p className="col-lg-7 col-md-6">{user.ninNo}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">WhatsApp Number</h6>
                                    <p className="col-lg-7 col-md-6">{user.whatsNo}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Company Name</h6>
                                    <p className="col-lg-7 col-md-6">{user.companyName}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Company Location</h6>
                                    <p className="col-lg-7 col-md-6">{user.companyLocation}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Father's/ Mother's No</h6>
                                    <p className="col-lg-7 col-md-6"> {user.father ? `${user.father.name} (Contact: ${user.father.contact})` : "Not Available"}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Friend's No:</h6>
                                    <p className="col-lg-7 col-md-6"> {user.friend ? `${user.friend.name} (Contact: ${user.friend.contact})` : "Not Available"}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Sister/ Brother's No:</h6>
                                    <p className="col-lg-7 col-md-6"> {user.sister ? `${user.sister.name} (Contact: ${user.sister.contact})` : "Not Available"}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label ">Wife/ Husband's No:</h6>
                                    <p className="col-lg-7 col-md-6"> {user.wife ? `${user.wife.name} (Contact: ${user.wife.contact})` : "Not Available"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {loanData.map((loan, index) => (
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-body pt-3">
                                {/* Bordered Tabs */}
                                <ul className="nav nav-tabs nav-tabs-bordered">
                                    <li className="nav-item">
                                        <button
                                            className="nav-link active"
                                            data-bs-toggle="tab"
                                            data-bs-target="#profile-overview"
                                        >
                                            Overview
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-2">
                                    <div
                                        className="tab-pane fade show active profile-overview"
                                        id="profile-overview"
                                    >
                                        <h5 className="card-title">Loan Details</h5>
                                        <div className="row">
                                            <p className="col-lg-3 col-md-4 label ">Loan ID</p>
                                            <p className="col-lg-9 col-md-8">{loan.loanID}</p>
                                        </div>
                                        <div className="row">
                                            <p className="col-lg-3 col-md-4 label">User UID</p>
                                            <p className="col-lg-9 col-md-8">
                                                {loan.userUID}
                                            </p>
                                        </div>
                                        <div className="row">
                                            <p className="col-lg-3 col-md-4 label">Loan Amount</p>
                                            <p className="col-lg-9 col-md-8">{loan.amountRequested}</p>
                                        </div>
                                        {statusUpdated &&
                                            <div className="row">
                                                <p className="col-lg-3 col-md-4 label">Status</p>
                                                <div className="col-lg-9 col-md-8">
                                                    <select
                                                        className='form-select'
                                                        value={value}
                                                        onChange={(e) => handleStatusChange(e, loan.id)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Approved">Approved</option>
                                                        <option value="Declined">Declined</option>
                                                    </select>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {/* End Bordered Tabs */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
};

export default LoanDetailSection;
