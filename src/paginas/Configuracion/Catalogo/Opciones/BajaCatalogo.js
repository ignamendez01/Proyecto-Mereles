import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import axios from "axios";
import {useWebSocketModelos} from "../../../../components/hooks/useWebSocketModelos";

const API_URL = process.env.REACT_APP_API_URL;

const BajaCatalogo = () => {
    const [modelos, setModelos] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchModelosActivos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/modelos/activos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setModelos(response.data))
            .catch(error => console.error("Error al obtener modelos:", error));
    };

    useEffect(() => {
        fetchModelosActivos();
    }, []);

    useWebSocketModelos(fetchModelosActivos);

    useEffect(() => {
        if (selectedModel) {
            const modeloEncontrado = modelos.find(m => m.id === selectedModel.id);
            if (modeloEncontrado) {
                setSelectedModel(modeloEncontrado);
            } else {
                setSelectedModel(null);
            }
        }
    }, [modelos])

    const handleSelectChange = (event) => {
        const model = modelos.find(m => m.id === parseInt(event.target.value));
        setSelectedModel(model || null);
    };

    const handleEliminar = () => {
        if (!selectedModel) return;
        setIsLoading(true);
        const token = localStorage.getItem("token");

        axios.patch(`${API_URL}/modelos/${selectedModel.id}/desactivar`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setSelectedModel(null);
                setIsLoading(false);
                fetchModelosActivos();
            })
            .catch(error => console.error("Error al eliminar modelo:", error));
    };

    return (
        <PageContainer>
            <h2>Baja de Modelos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Modelo:</label>
                <select id="model-select" style={{fontSize:"16px"}} onChange={handleSelectChange} defaultValue="">
                    <option value="">Seleccione un modelo</option>
                    {modelos.length > 0 ? (
                        modelos.map((modelo) => (
                            <option key={modelo.id} value={modelo.id}>
                                {modelo.id} - {modelo.descripcion}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay modelos disponibles</option>
                    )}
                </select>
            </div>

            {selectedModel && (
                <Tabla object={selectedModel} />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isLoading}>Volver</Button>
                {selectedModel && (
                    <Button onClick={handleEliminar} disabled={isLoading}>
                        {isLoading ? "Borrando..." : "Eliminar"}
                    </Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default BajaCatalogo;
