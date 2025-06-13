import React, {useEffect, useState} from "react";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from "../../Common/Tabla";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useWebSocketTachos} from "../../../../components/hooks/useWebSocketTachos";

const API_URL = process.env.REACT_APP_API_URL;

const ResumenTacho = () => {
    const [tachosActivos, setTachosActivos] = useState([]);
    const navigate = useNavigate();

    const fetchTachosActivos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/tachos/activos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setTachosActivos(response.data))
            .catch(error => console.error("Error al obtener tachos:", error));
    };

    useEffect(() => {
        fetchTachosActivos();
    }, []);

    useWebSocketTachos(fetchTachosActivos);

    return (
        <PageContainer>
            <h2>Resumen de Tachos</h2>
            {tachosActivos.length > 0 ? (
                <Tabla object={tachosActivos} />
            ) : (
                <p>No hay tachos activos para mostrar.</p>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default ResumenTacho;
