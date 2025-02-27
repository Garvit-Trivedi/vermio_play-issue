import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const navigate = useNavigate(); // Hook for redirection
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        display_name: "",
        email_id: "",
        date_of_birth: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://vermio-play.onrender.com/api/auth/signup", formData);
            alert("Account created successfully!");
            navigate("/signin"); // Redirect to Sign-In page after signup
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
            <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
            <input type="text" name="display_name" placeholder="Display Name" onChange={handleChange} required />
            <input type="email" name="email_id" placeholder="Email" onChange={handleChange} required />
            <input type="date" name="date_of_birth" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignUp;
