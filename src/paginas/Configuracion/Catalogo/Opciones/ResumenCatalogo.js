import React, {useEffect, useRef, useState} from "react";
//import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from "../../Common/Tabla";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/modelos";

const ResumenCatalogo = () => {
    //const { state } = useData();
    //const modelosActivos = state.modelos.filter((modelo) => modelo.isActive);
    const [modelosActivos, setModelosActivos] = useState([]);
    const navigate = useNavigate();
    const prevModelosRef = useRef([]);

    useEffect(() => {
        const fetchModelosActivos = () => {
            axios.get(`${API_URL}/activos`)
                .then(response => {
                    const nuevosModelos = response.data;

                    if (JSON.stringify(prevModelosRef.current) !== JSON.stringify(nuevosModelos)) {
                        setModelosActivos(nuevosModelos);
                        prevModelosRef.current = nuevosModelos; // Actualizar referencia
                    }
                })
                .catch(error => console.error("Error al obtener modelos:", error));
        };

        fetchModelosActivos();
        const interval = setInterval(fetchModelosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

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
