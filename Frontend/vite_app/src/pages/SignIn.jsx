import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [formData, setFormData] = useState({ email_id: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://vermio-play.onrender.com/api/auth/signin", formData);
            localStorage.setItem("token", res.data.token); // Store JWT
            alert("Login successful!");
            navigate("/home"); // Redirect to Home after login
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Invalid credentials"));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
                <input 
                    type="email" 
                    name="email_id" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    required 
                    className="w-full mb-2 p-2 border rounded"
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                    className="w-full mb-4 p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Sign In
                </button>
                <p className="text-center mt-3">New here?</p>
                <button 
                    type="button" 
                    onClick={() => navigate("/signup")} 
                    className="w-full mt-2 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignIn;
