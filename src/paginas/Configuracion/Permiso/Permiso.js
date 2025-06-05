import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {Button, ButtonContainer, PageContainer} from "../../../components/Styles";

const API_URL = process.env.REACT_APP_API_URL;

const Permiso = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const permiso = decoded.permiso;
    const [creandoUsuario, setCreandoUsuario] = useState(false);

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
    const { nombre, usuario, password, permiso: selectedPermiso } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        setCreandoUsuario(true);

        try {
            await axios.post(`${API_URL}/usuarios/register`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMensaje('Usuario registrado exitosamente');
            setFormData({ nombre: '', usuario: '', password: '', permiso: '' });
        } catch (error) {
            console.error(error);
            setMensaje('Error al registrar usuario');
        } finally {
            setCreandoUsuario(false);
        }
    };

    const isFormEmpty = !nombre || !usuario || !password || !selectedPermiso;

    return (
        <PageContainer>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="name">NOMBRE:</label>
                    <input
                        id="name"
                        name="nombre"
                        value={nombre}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="usuario">USUARIO:</label>
                    <input
                        id="usuario"
                        name="usuario"
                        value={usuario}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>

                <div className="input-container">
                    <label className="password-label" htmlFor="password">CONTRASEÑA:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>

                <div className="input-container">
                    <label>PERMISO:</label>
                    <div>
                        {['FABRICA_A', 'FABRICA_B', 'ADMIN'].map((permiso) => (
                            <label key={permiso} style={{ display: 'block', marginTop: '5px' }}>
                                <input
                                    type="radio"
                                    name="permiso"
                                    value={permiso}
                                    checked={selectedPermiso === permiso}
                                    onChange={() => handlePermisoChange(permiso)}
                                    required
                                />
                                {' '}
                                {permiso.replace('_', ' ')}
                            </label>
                        ))}
                    </div>
                </div>
            </form>
            {mensaje && <p style={{ marginTop: '10px' }}>{mensaje}</p>}
            <ButtonContainer>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isFormEmpty}
                >
                    Registrar
                </Button>
                <Button onClick={() => navigate("/home")} disabled={creandoUsuario}>
                    Volver
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default Permiso;
