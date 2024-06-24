import { useEffect, useState } from 'react';
import { collection, getDocs, where, doc, updateDoc, query, addDoc } from 'firebase/firestore';
import { firebase_firestore } from '@/firebaseconfig';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoanDetailSection() {
    const id = Cookies.get("id");
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [loanData, setLoanData] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [paidAmount, setPaidAmount] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const userInfoRef = collection(firebase_firestore, "NIDinfo");
                const userInfoQuery = query(userInfoRef, where("userUID", "==", id));
                const userInfoSnapshot = await getDocs(userInfoQuery);
                const userInfoData = userInfoSnapshot.docs.map(doc => doc.data());
                setUserInfo(userInfoData);

                const loanRef = collection(firebase_firestore, 'loanRequest');
                const loanQuery = query(loanRef, where("userUID", "==", id));
                const loanSnapshot = await getDocs(loanQuery);
                const loanData = loanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLoanData(loanData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusChange = async (loanId, newStatus, userUID) => {
        setProcessing(true);
        try {
            const loanDocRef = doc(firebase_firestore, 'loanRequest', loanId);
            await updateDoc(loanDocRef, { status: newStatus });
            Cookies.set('id', userUID); // Set the userUID in cookies
            alert('Loan status updated successfully');
            router.push("/home");
        } catch (error) {
            console.error('Error updating loan status:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handlePaymentConfirmation = async (loanId) => {
        setProcessing(true);
        try {
            if (paidAmount) {
                const loan = loanData.find(loan => loan.id === loanId);
                const loanDocRef = doc(firebase_firestore, 'loanRequest', loanId);
                const newBalance = loan.LoanBalance - parseFloat(paidAmount);
                await updateDoc(loanDocRef, { LoanBalance: newBalance });

                // Add transaction record
                const transactionRef = collection(firebase_firestore, 'confirmedTransactions');
                await addDoc(transactionRef, {
                    loanId,
                    userUID: loan.userUID,
                    paidAmount: parseFloat(paidAmount),
                    transactionDate: new Date(),
                });

                alert('Payment confirmed successfully');
                router.push("/home");
            }
            alert('Input Paid Amount.');

        } catch (error) {
            console.error('Error confirming payment:', error);
        } finally {
            setProcessing(false);
        }
    }

    const handlePaidAmountChange = (event) => {
        setPaidAmount(event.target.value);
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <section className="section profile">
            <div className="row">
                {userInfo.map((user, index) => (
                    <div className="col-xl-6" key={index}>
                        <div className="card">
                            <div className="card-body pt-4 d-flex flex-column">
                                <h3 className="card-title">User Details</h3>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">UserID</h6>
                                    <p className="col-lg-7 col-md-6">{user.userUID}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Name</h6>
                                    <p className="col-lg-7 col-md-6">{user.firstname} {user.othername}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Email</h6>
                                    <p className="col-lg-7 col-md-6">{user.useremail}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">NIN Number</h6>
                                    <p className="col-lg-7 col-md-6">{user.ninNo}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">WhatsApp Number</h6>
                                    <p className="col-lg-7 col-md-6">{user.whatsNo}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Company Name</h6>
                                    <p className="col-lg-7 col-md-6">{user.companyName}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Company Location</h6>
                                    <p className="col-lg-7 col-md-6">{user.companyLocation}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Father/Mother's No:</h6>
                                    <p className="col-lg-7 col-md-6">{user.father ? `${user.father.name} (Contact: ${user.father.contact})` : "Not Available"}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Friend's No:</h6>
                                    <p className="col-lg-7 col-md-6">{user.friend ? `${user.friend.name} (Contact: ${user.friend.contact})` : "Not Available"}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Sister/Brother's No:</h6>
                                    <p className="col-lg-7 col-md-6">{user.sister ? `${user.sister.name} (Contact: ${user.sister.contact})` : "Not Available"}</p>
                                </div>
                                <div className="row">
                                    <h6 className="col-lg-5 col-md-6 label">Wife/Husband's No:</h6>
                                    <p className="col-lg-7 col-md-6">{user.wife ? `${user.wife.name} (Contact: ${user.wife.contact})` : "Not Available"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {loanData.map((loan, index) => (
                    <div className="col-xl-6" key={index}>
                        <div className="card">
                            <div className="card-body pt-3">
                                <ul className="nav nav-tabs nav-tabs-bordered">
                                    <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">
                                            Overview
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-2">
                                    <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                        <h5 className="card-title">Loan Details</h5>
                                        <div className="row">
                                            <p className="col-lg-3 col-md-4 label">Loan ID</p>
                                            <p className="col-lg-9 col-md-8">{loan.loanID}</p>
                                        </div>
                                        <div className="row">
                                            <p className="col-lg-3 col-md-4 label">User UID</p>
                                            <p className="col-lg-9 col-md-8">{loan.userUID}</p>
                                        </div>
                                        <div className="row">
                                            <p className="col-lg-3 col-md-4 label">Loan Amount</p>
                                            <p className="col-lg-9 col-md-8">{loan.amountRequested}</p>
                                        </div>
                                        {loan.status === 'Approved' && (
                                            <form className='mx-2' onSubmit={(e) => { e.preventDefault(); handlePaymentConfirmation(loan.id); }}>
                                                <div className="row">
                                                    <p className="col-lg-3 col-md-4 label">Paid Amount</p>
                                                    <input
                                                        className='form-control'
                                                        style={{ borderColor: 'blue', padding: '8px' }}
                                                        placeholder='Enter Paid Amount'
                                                        value={paidAmount}
                                                        onChange={handlePaidAmountChange}
                                                    />
                                                    <button type="submit" className='btn btn-primary mt-3'>SUBMIT</button>
                                                </div>
                                            </form>
                                        )}
                                        {loan.status === 'Pending' && (
                                            <div className="row">
                                                <p className="col-lg-3 col-md-4 label">Status</p>
                                                <div className="col-lg-9 col-md-8">
                                                    <button
                                                        className='btn btn-success me-2'
                                                        onClick={() => handleStatusChange(loan.id, 'Approved', loan.userUID)}
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Processing...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        className='btn btn-danger'
                                                        onClick={() => handleStatusChange(loan.id, 'Declined', loan.userUID)}
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Processing...' : 'Decline'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="row">
                                            <div className='col'>
                                                <Link href="/userContacts/" className="btn btn-primary btn-sm" onClick={() => Cookies.set('id', loan.userUID)}>View Phone Contacts</Link>
                                            </div>
                                            <div className='col'>
                                                <Link href="/userActivities/" className="btn btn-primary btn-sm" onClick={() => Cookies.set('id', loan.userUID)}>Account Activities</Link>
                                            </div>
                                            <div className='col'>
                                                <Link href="/userIdentification/" className="btn btn-primary btn-sm" onClick={() => Cookies.set('id', loan.userUID)}>View Identification</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
