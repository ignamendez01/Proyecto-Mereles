import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
//import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import Modal from "../../Common/Modal";
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/modelos";

const ModificarCatalogo = () => {
    //const { state, dispatch } = useData();
    //const modelos = state.modelos.filter((m) => m.isActive);
    const [modelos, setModelos] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const prevModelosRef = useRef([]);

    useEffect(() => {
        const fetchModelosActivos = () => {
            axios.get(`${API_URL}/activos`)
                .then(response => {
                    const nuevosModelos = response.data;

                    if (JSON.stringify(prevModelosRef.current) !== JSON.stringify(nuevosModelos)) {
                        setModelos(nuevosModelos);
                        prevModelosRef.current = nuevosModelos; // Actualizar referencia
                    }
                })
                .catch(error => console.error("Error al obtener modelos:", error));
        };

        fetchModelosActivos();
        const interval = setInterval(fetchModelosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSelectChange = (event) => {
        const model = modelos.find(m => m.id === parseInt(event.target.value));
        if (model && model.id) {
            setSelectedModel(model);
        } else {
            setSelectedModel(null);
        }
    };

    const handleEditClick = () => {
        if (selectedModel) {
            setIsModalOpen(true);
        }
    };

    const handleSubmitEdit = (modelData) => {
        const updatedModelData = { ...modelData, id: selectedModel.id };
        setIsModalOpen(false);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("descripcion", updatedModelData.descripcion);
            formData.append("peso", updatedModelData.peso);

            if (updatedModelData.imagen instanceof File) {
                formData.append("imagen", updatedModelData.imagen);
            }

            axios.put(`${API_URL}/${selectedModel.id}`, formData)
                .then((response) => {
                    setSelectedModel(updatedModelData);
                })
                .catch((error) => {
                    console.error("Error al actualizar el modelo:", error);
                });

        } catch (error) {
            console.error("Error al actualizar el modelo:", error);
        } finally {
            setIsLoading(false);  // 👈 Desbloqueamos la UI cuando termina
        }
    };

    /*const handleSubmitEdit = (modelData) => {
        const updatedModelData = { ...modelData, id: selectedModel.id };

        dispatch({ type: "UPDATE_MODELO", payload: updatedModelData });

        setSelectedModel(updatedModelData);
        setIsModalOpen(false);
    };

     */

    return (
        <PageContainer>
            <h2>Modificación de Modelos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Modelo:</label>
                <select
                    id="model-select"
                    style={{ fontSize: "16px" }}
                    onChange={handleSelectChange}
                    value={selectedModel ? selectedModel.numero : ""}
                >
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
                    <Button onClick={handleEditClick} disabled={isLoading}>Modificar</Button>
                )}
            </ButtonContainer>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitEdit}
                data={selectedModel}
                title="Editar Modelo"
            />
            {isLoading && <p>Cargando...</p>}
        </PageContainer>
    );
};

export default ModificarCatalogo;
