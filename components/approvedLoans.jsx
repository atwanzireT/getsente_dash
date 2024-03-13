import { firebase_firestore } from '@/firebaseconfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const ApprovedLoans = () => {
  const [loanData, setLoanData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const loanQuery = query(loanCollection, where('status', '==', 'Approved'));

    const unsubscribe = onSnapshot(loanQuery, (snapshot) => {
      const loanRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoanData(loanRequests);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching Loans:', error);
      setLoading(false);
    });

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const pickLoanData = (loanid) => {
    if (Cookies.get('id')) {
      Cookies.remove('id');
    }
    Cookies.set('id', loanid);
    router.push('/loandetail/');
  };

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {isSmallScreen ?
              loanData.map((loan) => (
                <div className="card my-2" key={loan.id}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="card-text">
                          <span className='text-primary text-bold' style={{ display: 'inline-block', width: '60%' }}>User ID:</span> {loan.id}
                        </p>
                        <p className="card-text">
                          <span className='text-primary text-bold' style={{ display: 'inline-block', width: '60%' }}>Loan ID:</span> {loan.loanID}
                        </p>
                        <p className="card-text">
                          <span className='text-primary text-bold' style={{ display: 'inline-block', width: '60%' }}>Amount Paid:</span> {loan.amountPaid}
                        </p>
                        <p className="card-text">
                          <span className='text-primary text-bold' style={{ display: 'inline-block', width: '60%' }}>Amount Requested:</span> {loan.amountRequested}
                        </p>
                        <p className="card-text">
                          <span className='text-primary text-bold' style={{ display: 'inline-block', width: '60%' }}>Net Amount:</span> {loan.netAmount}
                        </p>
                        <p className="card-text">
                          <span className='text-primary text-bold' style={{ display: 'inline-block', width: '60%' }}>Transaction ID:</span> {loan.transactionId}
                        </p>
                        <p className="card-text">
                          <span className='text-primary text-bold' style={{ display: 'inline-block', width: '60%' }}>Status:</span> {loan.status}
                        </p>

                        <p className="card-text">
                          <button className='btn btn-primary' onClick={() => { pickLoanData(loan.id) }}>Manage</button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              : (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Datatables</h5>
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Loan ID</th>
                          <th>Amount Paid</th>
                          <th>Amount Requested</th>
                          <th>Net Amount</th>
                          <th>Transaction ID</th>
                          <th>Status</th>
                          <th>Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanData.map((loan) => (
                          <tr key={loan.id}>
                            <td>{loan.id}</td>
                            <td>{loan.loanID}</td>
                            <td>{loan.amountPaid}</td>
                            <td>{loan.amountRequested}</td>
                            <td>{loan.netAmount}</td>
                            <td>{loan.transactionId}</td>
                            <td>{loan.status}</td>
                            <td><button className='btn btn-primary' onClick={() => { pickLoanData(loan.id) }}>Manage</button></td>
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

export default ApprovedLoans;
