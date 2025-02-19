import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
//import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/tachos";

const BajaTacho = () => {
    const [tachos, setTachos] = useState([]);
    const [selectedTacho, setSelectedTacho] = useState(null);
    //const { state, dispatch } = useData();
    //const tachos = state.tachos.filter((m) => m.isActive);
    const navigate = useNavigate();

    const prevModelosRef = useRef([]);

    useEffect(() => {
        const fetchTachosActivos = () => {
            axios.get(`${API_URL}/activos`)
                .then(response => {
                    const nuevosTachos = response.data;

                    if (JSON.stringify(prevModelosRef.current) !== JSON.stringify(nuevosTachos)) {
                        setTachos(response.data);
                        prevModelosRef.current = nuevosTachos; // Actualizar referencia
                    }
                })
                .catch(error => console.error("Error al obtener tachos:", error));
        };

        fetchTachosActivos();
        const interval = setInterval(fetchTachosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSelectChange = (event) => {
        const tacho = tachos.find(t => t.id === parseInt(event.target.value));
        setSelectedTacho(tacho || null);
    };

    const handleEliminar = () => {
        if (!selectedTacho) return;

        axios.patch(`${API_URL}/${selectedTacho.id}/desactivar`)
            .then(() => {
                setSelectedTacho(null);
            })
            .catch(error => console.error("Error al eliminar tacho:", error));
    };

    /*const handleEliminar = () => {
        if (selectedModel) {
            dispatch({ type: "DESACTIVAR_TACHO", payload: selectedModel.id });
            setSelectedModel(null);
        }
    };

     */

    return (
        <PageContainer>
            <h2>Baja de Tachos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Modelo:</label>
                <select id="model-select" style={{fontSize:"16px"}} onChange={handleSelectChange} defaultValue="">
                    <option value="">Seleccione un tacho</option>
                    {tachos.length > 0 ? (
                        tachos.map((modelo) => (
                            <option key={modelo.id} value={modelo.id}>
                                {modelo.id} - {modelo.descripcion}
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
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {selectedTacho && (
                    <Button onClick={handleEliminar}>Eliminar</Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default BajaTacho;
