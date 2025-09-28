import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // ✅ import useNavigate

const AdminLogin = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate(); // ✅ initialize navigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                'https://examprep-dja4.onrender.com/api/admin/login',
                form
            );

            if (res.data.message === "Login Successfully") {
                localStorage.setItem("role", res.data.admin.role);
                localStorage.setItem("email", res.data.admin.email);

                // ✅ navigate instead of window.location.href
                navigate('/admin');
            } else {
                window.alert("Your email or password are incorrect");
            }
        } catch (error) {
            console.error("Login error:", error);
            window.alert("Something went wrong. Please try again.");
        }
    };

    // --- Your styles remain same ---
    const styles = { /* ... same styles as you provided ... */ };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Left Panel */}
                <div style={styles.leftPanel}>
                    <div style={{ ...styles.abstractCircles, ...styles.bigCircle }} />
                    <div style={{ ...styles.abstractCircles, ...styles.smallCircle }} />
                    <div style={styles.subheading}>Welcome Back Admin!!</div>
                    <div style={styles.welcomeText}>Your command center awaits.</div>
                    <div style={styles.subText}>
                        Manage users, monitor exams, and track performance — all in one place.
                    </div>
                </div>

                {/* Right Panel */}
                <div style={styles.rightPanel}>
                    <form onSubmit={handleSubmit} style={styles.formBox}>
                        <div style={{ textAlign: 'center' }}>
                            <div className='border-b-2' style={styles.heading}>Admin Login</div>
                        </div>
                        <br />
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            required
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••"
                            required
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <button type="submit" style={styles.submitBtn}>Log In</button>

                        <div style={styles.orDivider}>or</div>

                        <div style={styles.googleButton}>
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                style={{ width: '16px', verticalAlign: 'middle' }}
                            />
                            Sign in with Google
                        </div>

                        <div style={styles.createAccount}>
                            Don't have an account?
                            <a href="#" style={styles.link}>Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
