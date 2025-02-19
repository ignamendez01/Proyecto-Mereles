import React, { useState } from "react";
//import {useData} from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { PageContainer, ButtonContainer, Button } from '../../../../components/Styles';
import TablaCrear from "../../Common/TablaCrear";
import Modal from "../../Common/Modal";
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/modelos";

const AltaCatalogo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modelos, setModelos] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    //const { dispatch } = useData();
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

    /*const handleConfirm = () => {
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

     */

    const handleConfirm = async () => {
        setIsLoading(true);  // 👈 Bloqueamos la UI
        try {
            for (const modelo of modelos) {
                const formData = new FormData();
                formData.append("descripcion", modelo.descripcion);
                formData.append("peso", modelo.peso);

                if (modelo.imagen instanceof File) {
                    formData.append("imagen", modelo.imagen);
                }

                await axios.post(API_URL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            setModelos([]);
        } catch (error) {
            console.error("Error al subir los modelos:", error);
        } finally {
            setIsLoading(false);  // 👈 Desbloqueamos la UI cuando termina
        }
    };

    return (
        <PageContainer>
            <h2>Alta de Modelos</h2>
            <Button onClick={() => setIsModalOpen(true)} disabled={isLoading}>
                Agregar Modelo
            </Button>

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
                <Button onClick={() => navigate("/home")} disabled={isLoading}>
                    Volver
                </Button>
                {modelos.length > 0 && (
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? "Subiendo..." : "Confirmar"}
                    </Button>
                )}
            </ButtonContainer>

            {isLoading && <p>Cargando...</p>}
        </PageContainer>
    );
};

export default AltaCatalogo;
