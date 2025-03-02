import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, ButtonContainer, Button } from '../../../../components/Styles';
import TablaCrear from "../../Common/TablaCrear";
import Modal from "../../Common/Modal";
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/tachos";

const AltaTacho = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tachos, setTachos] = useState([]);
    const [selectedTacho, setSelectedTacho] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreateTacho = (newTacho) => {
        setTachos([...tachos, newTacho]);
        setIsModalOpen(false);
    };

    const handleEditTacho = (tacho) => {
        setSelectedTacho(tacho);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedTacho) => {
        const updatedTachos = tachos.map((tacho) =>
            tacho === selectedTacho ? updatedTacho : tacho
        );

        setTachos(updatedTachos);
        setIsEditModalOpen(false);
        setSelectedTacho(null);
    };

    const handleDeleteTacho = (tacho) => {
        const updatedTachos = tachos.filter((m) => m !== tacho);
        setTachos(updatedTachos);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            for (const tacho of tachos) {
                const formData = new FormData();
                formData.append("descripcion", tacho.descripcion);
                formData.append("peso", tacho.peso);

                if (tacho.imagen instanceof File) {
                    formData.append("imagen", tacho.imagen);
                }

                await axios.post(API_URL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            setTachos([]);
        } catch (error) {
            console.error("Error al subir los tachos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageContainer>
            <h2>Alta de Tachos</h2>
            <Button onClick={() => setIsModalOpen(true)} disabled={isLoading}>
                Agregar Tacho
            </Button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTacho}
                data={null}
                title="Crear Tacho"
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleSaveEdit}
                data={selectedTacho}
                title="Editar Tacho"
            />

            {tachos.length > 0 && (
                <TablaCrear
                    object={tachos}
                    handleEdit={handleEditTacho}
                    handleDelete={handleDeleteTacho}
                />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isLoading}>
                    Volver
                </Button>
                {tachos.length > 0 && (
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? "Subiendo..." : "Confirmar"}
                    </Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default AltaTacho;
