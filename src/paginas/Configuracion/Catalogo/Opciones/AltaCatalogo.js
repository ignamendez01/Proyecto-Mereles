import React, { useState } from "react";
import {useData} from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { PageContainer, ButtonContainer, Button } from '../../../../components/Styles';
import TablaModelo from "../Common/TablaModelo";
import CatalogoModal from "../Common/CatalogoModal";

const AltaCatalogo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modelos, setModelos] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);

    const { dispatch } = useData();
    const navigate = useNavigate();


    const handleCreateModel = (newModel) => {
        setModelos([...modelos, newModel]);
        setIsModalOpen(false);
    };


    const handleEditModel = (model) => {
        setSelectedModel(model);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedModel) => {
        const updatedModels = modelos.map((model) =>
            model === selectedModel ? updatedModel : model
        );

        setModelos(updatedModels);
        setIsEditModalOpen(false);
        setSelectedModel(null);
    };

    const handleDeleteModel = (model) => {
        const updatedModels = modelos.filter((m) => m !== model);
        setModelos(updatedModels);
    };

    const handleConfirm = () => {
        const modelsWithId = modelos.map((model, index) => {
            return {
                ...model,
            };
        });

        modelsWithId.forEach(model => {
            dispatch({ type: "ADD_MODELO", payload: {...model, isActive:true }});
        });

        setModelos([]);
    };

    return (
        <PageContainer>
            <Button onClick={() => setIsModalOpen(true)}>Agregar Modelo</Button>

            <CatalogoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateModel}
                modelData={null}
                title="Crear Modelo"
            />

            <CatalogoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleSaveEdit}
                modelData={selectedModel}
                title="Editar Modelo"
            />

            {modelos.length > 0 && (
                <TablaModelo
                    modelos={modelos}
                    handleEditModel={handleEditModel}
                    handleDeleteModel={handleDeleteModel}
                />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {modelos.length > 0 && (
                    <Button onClick={handleConfirm}>Confirmar</Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default AltaCatalogo;
