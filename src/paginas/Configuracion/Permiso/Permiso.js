import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const Tacho = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const permiso = decoded.permiso;

    useEffect(() => {
        if (permiso !== "ADMIN") {
            navigate("/home");
        }
    }, [permiso, navigate]);

    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        password: '',
        permiso: ''
    });

    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePermisoChange = (permiso) => {
        setFormData(prev => ({
            ...prev,
            permiso
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            await axios.post('http://localhost:8080/usuarios/register', formData, {
                headers: {
                    Authorization: `Bearer ${token}` // 🔒 Se envía el token en el header
                }
            });
            setMensaje('Usuario registrado exitosamente');
            setFormData({ nombre: '', usuario: '', password: '', permiso: '' });
        } catch (error) {
            console.error(error);
            setMensaje('Error al registrar usuario');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="name">NOMBRE:</label>
                    <input
                        id="name"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        style={{width: '100%', marginBottom: '10px'}}
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="usuario">USUARIO:</label>
                    <input
                        id="usuario"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                        required
                        style={{width: '100%', marginBottom: '10px'}}
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="password">CONTRASEÑA:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{width: '100%', marginBottom: '10px'}}
                    />
                </div>

                <div className="input-container">
                    <label>PERMISO:</label>
                    <div>
                        {['FABRICA_A', 'FABRICA_B', 'ADMIN'].map((permiso) => (
                            <label key={permiso} style={{display: 'block', marginTop: '5px'}}>
                                <input
                                    type="radio"
                                    name="permiso"
                                    value={permiso}
                                    checked={formData.permiso === permiso}
                                    onChange={() => handlePermisoChange(permiso)}
                                    required
                                />
                                {' '}
                                {permiso.replace('_', ' ')}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" style={{width: '100%', padding: '10px'}}>
                    Registrar
                </button>
            </form>
            {mensaje && <p style={{marginTop: '10px'}}>{mensaje}</p>}
        </div>
    );
};

export default Tacho;
