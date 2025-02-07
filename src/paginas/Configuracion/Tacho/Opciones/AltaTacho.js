import React, { useState } from "react";
import {useData} from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { PageContainer, ButtonContainer, Button } from '../../../../components/Styles';
import TablaCrear from "../../Common/TablaCrear";
import Modal from "../../Common/Modal";

const AltaTacho = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tachos, setTachos] = useState([]);
    const [selectedTacho, setSelectedTacho] = useState(null);

    const { dispatch } = useData();
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

    const handleConfirm = () => {
        const tachosWithId = tachos.map((tacho, index) => {
            return {
                ...tacho,
            };
        });

        tachosWithId.forEach(tacho => {
            dispatch({ type: "ADD_TACHO", payload: {...tacho, isActive:true }});
        });

        setTachos([]);
    };

    return (
        <PageContainer>
            <h2>Alta de Tachos</h2>
            <Button onClick={() => setIsModalOpen(true)}>Agregar Tacho</Button>

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
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {tachos.length > 0 && (
                    <Button onClick={handleConfirm}>Confirmar</Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default AltaTacho;
