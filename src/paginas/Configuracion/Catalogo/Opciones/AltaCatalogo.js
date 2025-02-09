import React, { useState } from "react";
import {useData} from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { PageContainer, ButtonContainer, Button } from '../../../../components/Styles';
import TablaCrear from "../../Common/TablaCrear";
import Modal from "../../Common/Modal";

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
            <h2>Alta de Modelos</h2>
            <Button onClick={() => setIsModalOpen(true)}>Agregar Modelo</Button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateModel}
                data={null}
                title="Crear Modelo"
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleSaveEdit}
                data={selectedModel}
                title="Editar Modelo"
            />

            {modelos.length > 0 && (
                <TablaCrear
                    object={modelos}
                    handleEdit={handleEditModel}
                    handleDelete={handleDeleteModel}
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
