import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LogIn.css'

const LogIn = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (username === "" || password === "") {
            setError("Por favor, completa todos los campos.");
        }else{
            navigate("/home");
        }
    };

    return (
        <div className="login_body">
            <h2>INICIO DE SESIÓN</h2>
            <div className="input-container">
                <label htmlFor="username">USUARIO:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="input-container">
                <label className="password-label" htmlFor="password">CONTRASEÑA:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <p>{error}</p>}
            <button onClick={handleLogin}>Ingresar</button>
        </div>
    );
};

export default LogIn;

