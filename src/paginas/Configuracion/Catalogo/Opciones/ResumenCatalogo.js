import React, {useEffect, useState} from "react";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from "../../Common/Tabla";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useWebSocketModelos} from "../../../../components/hooks/useWebSocketModelos";

const API_URL = process.env.REACT_APP_API_URL;

const ResumenCatalogo = () => {
    const [modelosActivos, setModelosActivos] = useState([]);
    const navigate = useNavigate();

    const fetchModelosActivos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/modelos/activos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setModelosActivos(response.data))
            .catch(error => console.error("Error al obtener modelos:", error));
    };

    useEffect(() => {
        fetchModelosActivos();
    }, []);

    useWebSocketModelos(fetchModelosActivos);

    return (
        <PageContainer>
            <h2>Resumen del Catálogo</h2>
            {modelosActivos.length > 0 ? (
                <Tabla object={modelosActivos} />
            ) : (
                <p>No hay modelos activos para mostrar.</p>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default ResumenCatalogo;
