import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firebase_firestore } from "@/firebaseconfig";
import HeaderBar from "@/components/header";
import Sidebar from "@/components/sidebar";
import "../app/page.module.css";
import "../app/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserActivities = () => {
    const [transactionData, setTransactionData] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchId, setSearchId] = useState(""); // State to hold the search ID

    useEffect(() => {
        const fetchTransactions = async () => {
            const querySnapshot = await getDocs(collection(firebase_firestore, "confirmedTransactions"));
            const transactions = [];
            querySnapshot.forEach((doc) => {
                transactions.push({ id: doc.id, ...doc.data() });
            });
            setTransactionData(transactions);
            setFilteredTransactions(transactions); // Initially set filtered transactions to all transactions
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        // Filter transactions based on searchId whenever it changes
        if (searchId.trim() !== "") {
            const filtered = transactionData.filter(transaction => transaction.loanId === searchId);
            setFilteredTransactions(filtered);
        } else {
            setFilteredTransactions(transactionData); // If searchId is empty, show all transactions
        }
    }, [searchId, transactionData]);

    return (
        <div>
            <HeaderBar />
            <Sidebar />
            <main id="main" className="main">
                <div className="container">
                    <h1>User Activities</h1>
                    <div className="mb-3">
                        <label htmlFor="loanIdInput" className="form-label">Filter by Loan ID:</label>
                        <input 
                            type="text" 
                            id="loanIdInput" 
                            className="form-control" 
                            value={searchId} 
                            onChange={(e) => setSearchId(e.target.value)} 
                        />
                    </div>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Loan ID: {transaction.loanId}</h5>
                                    <p className="card-text">
                                        <strong>Transaction Date:</strong> {transaction.transactionDate?.toDate().toString()}
                                    </p>
                                    <p className="card-text">
                                        <strong>User UID:</strong> {transaction.userUID}
                                    </p>
                                    <p className="card-text">
                                        <strong>Paid Amount:</strong> {isNaN(transaction.paidAmount) ? 'N/A' : transaction.paidAmount}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No transactions found.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserActivities;
