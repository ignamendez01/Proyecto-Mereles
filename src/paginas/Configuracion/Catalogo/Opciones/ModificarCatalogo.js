import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import Modal from "../../Common/Modal";

const ModificarCatalogo = () => {
    const { state, dispatch } = useData();
    const modelos = state.modelos.filter((m) => m.isActive);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

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

        dispatch({ type: "UPDATE_MODELO", payload: updatedModelData });

        setSelectedModel(updatedModelData);
        setIsModalOpen(false);
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
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {selectedModel && (
                    <Button onClick={handleEditClick}>Modificar</Button>
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
