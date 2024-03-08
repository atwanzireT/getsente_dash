import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, where, doc, updateDoc, query } from 'firebase/firestore';
import { firebase_firestore } from '@/firebaseconfig';

export default function LoanDetailSection(){
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [loanData, setLoanData] = useState([]);
    const [statusUpdated, setStatusUpdated] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

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
            {loading && <p>Loading...</p>}
            {!loading && userInfo.length > 0 && (
                <div className="user-details">
                    {/* Render user details */}
                </div>
            )}
            {!loading && loanData.length > 0 && (
                <div className="loan-details">
                    {/* Render loan details */}
                    {loanData.map(loan => (
                        <div className="loan-card" key={loan.id}>
                            <h3>Loan ID: {loan.id}</h3>
                            <p>User UID: {loan.userUID}</p>
                            <p>Loan Amount: {loan.amountRequested}</p>
                            {statusUpdated && (
                                <div>
                                    <label htmlFor={`status_${loan.id}`}>Status:</label>
                                    <select
                                        id={`status_${loan.id}`}
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Declined">Declined</option>
                                    </select>
                                    <button onClick={() => handleStatusChange(loan.id, selectedStatus)}>Update Status</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
