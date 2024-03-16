import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from "next/router";
import { useState } from 'react';
import Cookies from "js-cookie";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from "@/firebaseconfig";

export default function Home() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleAuth = () => {
    signInWithEmailAndPassword(firebase_auth, formData.email, formData.password )
    .then(()=>{
        router.push("/home")
    }).catch((err) =>{
        alert("Wrong Credentials!");
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div className="container mt-10">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <div>
                <h1 className="card-title">GetSente Admin</h1>
                <h3 className="card-title">Login</h3>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
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
                  <button type="submit" className="btn btn-secondary">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}