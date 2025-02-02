import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/CatalogStyles';
import TablaCatalogo from '../../../../components/TablaCatalogo';
import CatalogoModal from "../../../../components/CatalogoModal";

const ModificarCatalogo = () => {
    const { state, dispatch } = useData();
    const modelos = state.items.filter((m) => m.isActive);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [originalNumero, setOriginalNumero] = useState(null);

    const navigate = useNavigate();

    const handleSelectChange = (event) => {
        const model = modelos.find((m) => m.numero === event.target.value);
        setSelectedModel(model || null);
        setOriginalNumero(model?.numero);
    };

    const handleEditClick = () => {
        if (selectedModel) {
            setIsModalOpen(true);
        }
    };

    const handleSubmitEdit = (modelData) => {
        const otherModels = modelos.filter((model) => model !== selectedModel);
        const isDuplicate = otherModels.some((model) => model.numero === modelData.numero);

        if (isDuplicate) {
            alert("Error: Ya existe un modelo con ese número de ID.");
            return;
        }

        dispatch({ type: "UPDATE_ITEM", payload: modelData, originalNumero: originalNumero });
        setSelectedModel(modelData);
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
                            <option key={modelo.numero} value={modelo.numero}>
                                {modelo.numero} - {modelo.descripcion}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay modelos disponibles</option>
                    )}
                </select>
            </div>

            {selectedModel && (
                <TablaCatalogo modelos={selectedModel} />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {selectedModel && (
                    <Button onClick={handleEditClick}>Modificar</Button>
                )}
            </ButtonContainer>

            <CatalogoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitEdit}
                modelData={selectedModel}
                title="Editar Modelo"
            />
        </PageContainer>
    );
};

export default ModificarCatalogo;
