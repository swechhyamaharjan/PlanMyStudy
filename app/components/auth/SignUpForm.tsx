"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent} from "react";

export default function SignUpForm(){
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({name: "", email: "", password: "" })

  async function submitHandler(e: FormEvent){
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/users", form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      })
      router.push("/signin");
    } catch (err: any) {
     if (err.response) {
        setError(err.response.data.message || "Invalid Credentials")
      } else if (err.request) {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }
  return(
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">📚</div>
            <h1 className="auth-title">Plan My Study</h1>
            <p className="auth-subtitle">Create your account to get started</p>
        </div>
        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
            id="name"
            type="text" 
            placeholder="Jane Doe"
            required
            value={form.name}
            onChange={(e)=>setForm({...form, name: e.target.value})}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
            id="email"
            type="email" 
            placeholder="jane@example.com"
            required
            value={form.email}
            onChange={(e)=>setForm({...form, email: e.target.value})}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
            id="password"
            type="password" 
            placeholder="••••••••"
            required
            minLength={6}
            value={form.password}
            onChange={(e)=>setForm({...form, password: e.target.value})}/>
          </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit"
         className="auth-btn" 
         disabled={loading}>
          {loading ? "Creating account": "Sign Up"}</button>
        </form>

        <p className="auth-footer">
           Already have an account?{" "}
           <Link href="/signin" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  )
}