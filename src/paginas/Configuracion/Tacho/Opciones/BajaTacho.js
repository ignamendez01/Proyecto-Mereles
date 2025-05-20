import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const BajaTacho = () => {
    const [tachos, setTachos] = useState([]);
    const [selectedTacho, setSelectedTacho] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const prevTachosRef = useRef([]);

    useEffect(() => {
        const fetchTachosActivos = () => {
            const token = localStorage.getItem("token");

            axios.get(`${API_URL}/tachos/activos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const nuevosTachos = response.data;

                    if (JSON.stringify(prevTachosRef.current) !== JSON.stringify(nuevosTachos)) {
                        setTachos(nuevosTachos);
                        prevTachosRef.current = nuevosTachos;
                    }
                })
                .catch(error => console.error("Error al obtener tachos:", error));
        };

        fetchTachosActivos();
        const interval = setInterval(fetchTachosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedTacho) {
            const tachoEncontrado = tachos.find(m => m.id === selectedTacho.id);
            if (tachoEncontrado) {
                setSelectedTacho(tachoEncontrado);
            } else {
                setSelectedTacho(null);
            }
        }
    }, [tachos])

    const handleSelectChange = (event) => {
        const tacho = tachos.find(t => t.id === parseInt(event.target.value));
        setSelectedTacho(tacho || null);
    };

    const handleEliminar = () => {
        if (!selectedTacho) return;
        setIsLoading(true);
        const token = localStorage.getItem("token");

        axios.patch(`${API_URL}/tachos/${selectedTacho.id}/desactivar`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setSelectedTacho(null);
                setIsLoading(false);
            })
            .catch(error => console.error("Error al eliminar tacho:", error));
    };

    return (
        <PageContainer>
            <h2>Baja de Tachos</h2>
            <div className="input-container">
                <label htmlFor="tacho-select">Seleccionar Modelo:</label>
                <select id="tacho-select" style={{fontSize:"16px"}} onChange={handleSelectChange} defaultValue="">
                    <option value="">Seleccione un tacho</option>
                    {tachos.length > 0 ? (
                        tachos.map((tacho) => (
                            <option key={tacho.id} value={tacho.id}>
                                {tacho.id} - {tacho.descripcion}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay tachos disponibles</option>
                    )}
                </select>
            </div>

            {selectedTacho && (
                <Tabla object={selectedTacho} />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isLoading}>Volver</Button>
                {selectedTacho && (
                    <Button onClick={handleEliminar} disabled={isLoading}>
                        {isLoading ? "Borrando..." : "Eliminar"}
                    </Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default BajaTacho;
