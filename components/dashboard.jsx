import { firebase_firestore } from "@/firebaseconfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [loanRequestCount, setLoanRequestCount] = useState(0);
    const [loanApprovedCount, setApprovedCount] = useState(0);
    const [loanDeclinedCount, setLoanDeclinedCount] = useState(0);
    const [loanRequestList, setLoanRequestList] = useState([]);

    useEffect(() => {
        const fetchLoanRequests = async () => {
            const loanCollection = collection(firebase_firestore, 'loanRequest');

            const unsubscribe = onSnapshot(loanCollection, (snapshot) => {
                const loanRequests = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLoanRequestList(loanRequests);
            }, (error) => {
                console.error('Error fetching Loans:', error);
            });

            const pendingQuery = query(loanCollection, where('status', '==', 'Pending'));
            const approvedQuery = query(loanCollection, where('status', '==', 'Approved'));

            const unsubscribeLoanRequests = onSnapshot(pendingQuery, (snapshot) => {
                setLoanRequestCount(snapshot.docs.length);
            });

            const unsubscribeApprovedLoan = onSnapshot(approvedQuery, (snapshot) => {
                setApprovedCount(snapshot.docs.length);
            });

            const unsubscribeDeclinedLoans = onSnapshot(query(loanCollection, where('status', '==', 'Declined')), (snapshot) => {
                setLoanDeclinedCount(snapshot.docs.length);
            });

            return () => {
                unsubscribeLoanRequests();
                unsubscribeApprovedLoan();
                unsubscribeDeclinedLoans();
                unsubscribe();
            };
        };

        fetchLoanRequests();
    }, []);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-success';
            case 'Declined':
                return 'bg-danger';
            case 'Pending':
                return 'bg-primary';
            default:
                return '';
        }
    };

    return (
        <section className="section dashboard">
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-xxl-4 col-md-6">
                            <div className="card info-card sales-card">
                                <div className="filter">
                                    <a className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </a>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Pending Loans</h5>
                                    <div className="d-flex align-items-center">
                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i className="bi bi-cart" />
                                        </div>
                                        <div className="ps-3">
                                            <h6>{loanRequestCount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                            <div className="card info-card revenue-card">
                                <div className="card-body">
                                    <h5 className="card-title">Approved Loans</h5>
                                    <div className="d-flex align-items-center">
                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i className="bi bi-currency-dollar" />
                                        </div>
                                        <div className="ps-3">
                                            <h6>{loanApprovedCount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-12">
                            <div className="card info-card customers-card">
                                <div className="filter">
                                    <Link className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </Link>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Declined Loans</h5>
                                    <div className="d-flex align-items-center">
                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i className="bi bi-people" />
                                        </div>
                                        <div className="ps-3">
                                            <h6>{loanDeclinedCount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="filter">
                                    <Link className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </Link>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Reports</h5>
                                    <div id="reportsChart" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card recent-sales overflow-auto">
                                <div className="filter">
                                    <a className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </a>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Recent Loans</h5>
                                    <table className="table table-borderless datatable">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Amount Requested</th>
                                                <th scope="col">Net Amount</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loanRequestList.map((loan) => (
                                                <tr key={loan.id} className={getStatusBadgeClass(loan.status)}>
                                                    <th scope="row">
                                                        <Link href="#">{loan.id}</Link>
                                                    </th>
                                                    <td>{loan.amountRequested}</td>
                                                    <td>{loan.netAmount}</td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(loan.status)}`}>{loan.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
