import { useEffect, useState } from 'react';
import { collection, getDocs, where, doc, updateDoc, query } from 'firebase/firestore';
import { firebase_firestore } from '@/firebaseconfig';
import Cookies from 'js-cookie';

export default function LoanDetailSection() {
    const id  = Cookies.get("id");
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [loanData, setLoanData] = useState([]);
    const [statusUpdated, setStatusUpdated] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [value, setValue] = useState('');

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

                // Fetch loan data
                const loanRef = collection(firebase_firestore, 'loanRequest');
                const loanQuery = query(loanRef, where("userUID", "==", id));
                const loanSnapshot = await getDocs(loanQuery);
                const loanData = loanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLoanData(loanData);

                // Check if loan status is 'Pending'
                const pendingLoan = loanData.find(loan => loan.status === 'Pending');
                if (pendingLoan) {
                    setStatusUpdated(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusChange = async (loanId, newStatus) => {
        try {
            const loanDocRef = doc(firebase_firestore, 'loanRequest', loanId);
            await updateDoc(loanDocRef, { status: newStatus });
            alert('Loan status updated successfully');
            router.push("/");
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
