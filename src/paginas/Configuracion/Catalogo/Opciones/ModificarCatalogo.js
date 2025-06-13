import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import Modal from "../../Common/Modal";
import axios from "axios";
import {useWebSocketModelos} from "../../../../components/hooks/useWebSocketModelos";

const API_URL = process.env.REACT_APP_API_URL;

const ModificarCatalogo = () => {
    const [modelos, setModelos] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        const token = localStorage.getItem("token");

        try {
            const formData = new FormData();
            formData.append("descripcion", updatedModelData.descripcion);
            formData.append("peso", updatedModelData.peso);

            if (updatedModelData.imagen instanceof File) {
                formData.append("imagen", updatedModelData.imagen);
            }

            axios.put(`${API_URL}/modelos/${selectedModel.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    setSelectedModel(updatedModelData);
                    setIsLoading(false);
                    fetchModelosActivos();
                })
                .catch((error) => {
                    console.error("Error al actualizar el modelo:", error);
                });

        } catch (error) {
            console.error("Error al actualizar el modelo:", error);
        }
    };


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
                    <Button onClick={handleEditClick} disabled={isLoading}>
                        {isLoading ? "Modificando..." : "Modificar"}
                    </Button>
                )}
            </ButtonContainer>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitEdit}
                data={selectedModel}
                title="Editar Modelo"
            />
        </PageContainer>
    );
};

export default ModificarCatalogo;
