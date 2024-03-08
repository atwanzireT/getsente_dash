import { firebase_firestore } from "@/firebaseconfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [loanRequestCount, setLoanRequestCount] = useState();
    const [loanApprovedCount, setApprovedCount] = useState();
    const [loanDeclinedCount, setLoanDeclinedCount] = useState();
    const [loanRequestList, setLoanRequestList] = useState([]);

    useEffect(() => {
        const loanCollection = collection(firebase_firestore, 'loanRequest');

        const unsubscribe = onSnapshot(loanCollection, (snapshot) => {
            const loanRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLoanRequestList(loanRequests);
        }, (error) => {
            console.error('Error fetching Loans:', error);
            setLoading(false);
        });

        // Fetch cart data
        const unsubscribeLoanRequests = onSnapshot(
            query(collection(firebase_firestore, 'loanRequest'), where('status', '==', 'Pending')),
            (snapshot) => {
                const cartData = snapshot.docs;
                setLoanRequestCount(cartData.length);
            }
        );


        const unsubscribeApprovedLoan = onSnapshot(
            query(collection(firebase_firestore, 'loanRequest'), where('status', '==', 'Approved')),
            (snapshot) => {
                const approvedLoanRequests = snapshot.docs;
                setLoanRequestCount(approvedLoanRequests.length);
            }
        );

        // Fetch order count and details
        const unsubscribeDeclinedLoans = onSnapshot(collection(firebase_firestore, 'loanRequest'),
            (snapshot) => {
                const orderData = snapshot.docs.map(doc => doc.data());
                setLoanDeclinedCount(orderData.length);
            });

        console.log("List: ", loanRequestList);
        return () => {
            // Unsubscribe from Firestore listeners when component unmounts
            unsubscribeLoanRequests();
            unsubscribeApprovedLoan();
            unsubscribeDeclinedLoans();
            unsubscribe();
        };
    }, []);
    return (
        <section className="section dashboard">
            <div className="row">
                {/* Left side columns */}
                <div className="col-lg-12">
                    <div className="row">
                        {/* Sales Card */}
                        <div className="col-xxl-4 col-md-6">
                            <div className="card info-card sales-card">
                                <div className="filter">
                                    <a className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </a>

                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Pending Loans
                                    </h5>
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
                        {/* End Sales Card */}
                        {/* Revenue Card */}
                        <div className="col-xxl-4 col-md-6">
                            <div className="card info-card revenue-card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Approved Loans
                                    </h5>
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
                        {/* End Revenue Card */}
                        {/* Customers Card */}
                        <div className="col-xxl-4 col-xl-12">
                            <div className="card info-card customers-card">
                                <div className="filter">
                                    <Link
                                     className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </Link>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Declined Loans
                                    </h5>
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
                        {/* End Customers Card */}
                        {/* Reports */}
                        <div className="col-12">
                            <div className="card">
                                <div className="filter">
                                    <Link className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </Link>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Reports
                                    </h5>
                                    {/* Line Chart */}
                                    <div id="reportsChart" />
                                    {/* End Line Chart */}
                                </div>
                            </div>
                        </div>
                        {/* End Reports */}
                        {/* Recent Sales */}
                        <div className="col-12">
                            <div className="card recent-sales overflow-auto">
                                <div className="filter">
                                    <a className="icon" href="#" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots" />
                                    </a>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Recent Sales
                                    </h5>
                                    <table className="table table-borderless datatable">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Customer</th>
                                                <th scope="col">Product</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loanRequestList.map((loan) => (
                                                <tr>
                                                    <th scope="row">
                                                        <Link href="#">{loan.id}</Link>
                                                    </th>
                                                    <td>{loan.amountRequested}</td>
                                                    <td>
                                                        {loan.netAmount}
                                                    </td>
                                                    <td>$64</td>
                                                    <td>
                                                        <span className="badge bg-success">{loan.status}</span>
                                                    </td>
                                                </tr>

                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* End Recent Sales */}
                    </div>
                </div>
                {/* End Left side columns */}

            </div>
        </section>
    )
}