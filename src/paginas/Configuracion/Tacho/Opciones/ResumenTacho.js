import React, {useEffect, useRef, useState} from "react";
//import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from "../../Common/Tabla";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/tachos";

const ResumenTacho = () => {
    //const { state } = useData();
    //const tachosActivos = state.tachos.filter((tacho) => tacho.isActive);
    const [tachosActivos, setTachosActivos] = useState([]);
    const navigate = useNavigate();

    const prevModelosRef = useRef([]);

    useEffect(() => {
        const fetchTachosActivos = () => {
            axios.get(`${API_URL}/activos`)
                .then(response => {
                    const nuevosTachos = response.data;

                    if (JSON.stringify(prevModelosRef.current) !== JSON.stringify(nuevosTachos)) {
                        setTachosActivos(response.data);
                        prevModelosRef.current = nuevosTachos; // Actualizar referencia
                    }
                })
                .catch(error => console.error("Error al obtener tachos:", error));
        };

        fetchTachosActivos();
        const interval = setInterval(fetchTachosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <PageContainer>
            <h2>Resumen de Tachos</h2>
            {tachosActivos.length > 0 ? (
                <Tabla object={tachosActivos} />
            ) : (
                <p>No hay modelos activos para mostrar.</p>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default ResumenTacho;
