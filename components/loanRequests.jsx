import { firebase_firestore } from '@/firebaseconfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const DataTableSection = () => {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loanCollection = collection(firebase_firestore, 'loanRequest');
    const loanQuery = query(loanCollection, where('status', '==', 'Pending'));

    const unsubscribe = onSnapshot(
      loanQuery,
      (snapshot) => {
        const loanRequests = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created: data.created ? data.created.toDate() : null, // Convert Firestore timestamp to Date
          };
        });
        setLoanData(loanRequests);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching Loans:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const pickLoanData = (loanid) => {
    if (Cookies.get('id')) {
      Cookies.remove('id');
    }
    Cookies.set('id', loanid);
    router.push('/loandetail/');
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : loanData.length === 0 ? (
              <div className="text-center my-5">
                <p>No pending loan requests found.</p>
              </div>
            ) : isSmallScreen ? (
              loanData.map((loan) => (
                <div className="card my-2" key={loan.id}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="card-text">
                          <span className="text-primary fw-bold">User ID:</span> {loan.id}
                        </p>
                        <p className="card-text">
                          <span className="text-primary fw-bold">Loan ID:</span> {loan.loanID}
                        </p>
                        <p className="card-text">
                          <span className="text-primary fw-bold">Gross Amount:</span> {loan.amountRequested}
                        </p>
                        <p className="card-text">
                          <span className="text-primary fw-bold">Net Amount:</span> {loan.netAmount}
                        </p>
                        <p className="card-text">
                          <span className="text-primary fw-bold">Status:</span> {loan.status}
                        </p>
                        <p className="card-text">
                          <span className="text-primary fw-bold">Created:</span> {formatDate(loan.created)}
                        </p>
                        <p className="card-text">
                          <button className="btn btn-primary" onClick={() => pickLoanData(loan.id)}>Manage</button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Datatables</h5>
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Loan ID</th>
                        <th>Gross Amount</th>
                        <th>Net Amount</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loanData.map((loan) => (
                        <tr key={loan.id}>
                          <td>{loan.id}</td>
                          <td>{loan.loanID}</td>
                          <td>{loan.amountRequested}</td>
                          <td>{loan.netAmount}</td>
                          <td>{loan.status}</td>
                          <td>{formatDate(loan.created)}</td>
                          <td><button className="btn btn-primary" onClick={() => pickLoanData(loan.id)}>Manage</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataTableSection;
