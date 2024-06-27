import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from "next/router";
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from "@/firebaseconfig";

export default function Home() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = () => {
    setLoading(true);
    signInWithEmailAndPassword(firebase_auth, formData.email, formData.password)
      .then(() => {
        setLoading(false);
        router.push("/home");
      })
      .catch((err) => {
        setLoading(false);
        alert("Wrong Credentials!");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="justify-content-center">
        <div>
          <div className="card shadow-lg p-4">
            <div className="text-center mb-4">
              <h4 className="card-title">GetSente Admin</h4>
              <h6 className="card-subtitle mb-2 text-muted">Login</h6>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="text-center">
                  {loading ? (
                    <div className="spinner-border text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <button type="submit" className="btn btn-secondary">Login</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
