import React, { useState } from "react";
import {useData} from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { PageContainer, ButtonContainer, Button } from '../../../components/Styles';
import TablaRemito from "../Common/TablaRemito";
import ColadaModal from "../Common/ColadaModal";

const AltaColada = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [remitos, setRemitos] = useState([]);
    const [selectedRemito, setSelectedRemito] = useState(null);

    const { state, dispatch } = useData();
    const navigate = useNavigate();

    const handleCreateRemito = (newRemito) => {
        setRemitos([...remitos, newRemito]);
        setIsModalOpen(false);
    };

    const handleEditRemito = (remito) => {
        setSelectedRemito(remito);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedRemito) => {
        const updatedRemitos = remitos.map((remito) =>
            remito === selectedRemito ? updatedRemito : remito
        );

        setRemitos(updatedRemitos);
        setIsEditModalOpen(false);
        setSelectedRemito(null);
    };

    const handleDeleteRemito = (remito) => {
        const updatedRemitos = remitos.filter((m) => m !== remito);
        setRemitos(updatedRemitos);
    };

    const handleConfirm = () => {
        const newGroupId = state.lastGroupId + 1;
        let currentRemitoId = state.lastRemitoId;

        const RemitosWithId = remitos.map((remito) => {
            const updatedRemito = {
                ...remito,
                id: currentRemitoId,
                groupId: newGroupId,
            };
            currentRemitoId += 1;
            return updatedRemito;
        });

        dispatch({
            type: "ADD_REMITOS",
            payload: { remitos: RemitosWithId, lastRemitoId: currentRemitoId, lastGroupId: newGroupId }
        });

        setRemitos([]);
    };



    return (
        <PageContainer>
            <Button onClick={() => setIsModalOpen(true)}>Agregar Remito</Button>

            <ColadaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateRemito}
                remitoData={null}
                title="Crear Remito"
            />

            <ColadaModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleSaveEdit}
                remitoData={selectedRemito}
                title="Editar Remito"
            />

            {remitos.length > 0 && (
                <TablaRemito
                    remitos={remitos}
                    handleEditRemito={handleEditRemito}
                    handleDeleteRemito={handleDeleteRemito}
                />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {remitos.length > 0 && (
                    <Button onClick={handleConfirm}>Confirmar</Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default AltaColada;
