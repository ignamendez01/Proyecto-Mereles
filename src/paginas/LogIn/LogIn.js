import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LogIn.css'

const API_URL = process.env.REACT_APP_API_URL;

const LogIn = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/usuarios/login`, {
                usuario: username,
                password: password
            });

            const token = response.data;
            localStorage.setItem("token", token);
            navigate("/home");
        } catch (err) {
            console.error("Error al conectar con el servidor:", err);
            if (err.response && err.response.status === 403) {
                setError("Credenciales incorrectas.");
            } else {
                setError("Error al conectar con el servidor.");
            }
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
                <label htmlFor="password">CONTRASEÑA:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin}>Ingresar</button>
        </div>
    );
};

export default LogIn;
