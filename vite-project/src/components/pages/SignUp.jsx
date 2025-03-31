import { useState, useContext } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(name, email, password);
        navigate("/login"); // Redirect to login after signup
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="auth">
                <h1>SignUp</h1>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="sign-in" type="submit">Sign Up</button>
            </div>
            
        </form>
    );
};

export default Signup;
