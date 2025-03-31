import { useState, useContext } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate("/"); // Redirect to home after login
    };

    return (
        <form onSubmit={handleSubmit} >
            <div className="auth">
                <h1>Login</h1>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="sign-in" type="submit">Login</button>
            </div>
        </form>
    );
};

export default Login;
