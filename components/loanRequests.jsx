import { firebase_firestore } from '@/firebaseconfig';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

const DataTableSection = () => {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const router = useRouter()


  useEffect(() => {
    const loanCollection = collection(firebase_firestore, 'loanRequest');
    const loanQuery = query(loanCollection, where('status', '==', 'Pending'));

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
    Cookies.set('id',loanid)
    router.push(`/loandetail/${loanid}`)
  }

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Datatables</h5>

              {/* Table with stripped rows */}
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
              {/* End Table with stripped rows */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataTableSection;
