import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {useData} from "../../../context/DataContext";
import {ButtonContainer, PageContainer, Button} from "../../../components/Styles";
import TablaRemito from "../Common/TablaRemito";
import ColadaModal from "../Common/ColadaModal";

const ModificarColada = () => {
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { state, dispatch } = useData();
    const remitos = state.remitos;
    const [selectedRemito, setSelectedRemito] = useState(null);

    const [selectedId, setSelectedId] = useState("");
    const [remitosAgrupados, setRemitosAgrupados] = useState({});

    const remitosActivos = remitos.filter(remito => remito.isActive);
    const remitoIds = [...new Set(remitosActivos.map(remito => remito.groupId))];


    const agruparRemitos = (idSeleccionado) => {
        if (idSeleccionado) {
            return { [idSeleccionado]: remitos.filter(remito => remito.groupId === parseInt(idSeleccionado)) };
        }
        return {};
    };

    const handleSelect = (e) => {
        setSelectedId(e.target.value);
    };

    const handleEditRemito = (remito) => {
        console.log("El remito es: ");
        console.log(remito);
        setSelectedRemito(remito);
        console.log("El remito seleccionado quedó: ");
        console.log(selectedRemito);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedRemito) => {
        const editedRemito = {
            ...selectedRemito,  // Mantiene id y groupId originales
            ...updatedRemito    // Aplica los cambios
        };

        dispatch({
            type: "UPDATE_REMITO",
            payload: editedRemito
        });

        setRemitosAgrupados(agruparRemitos(selectedId));
        setIsEditModalOpen(false);
        setSelectedRemito(null);
    };

    const handleDeleteRemito = (remito) => {
        const remitoId = remito.id
        dispatch({
            type: "REMOVE_REMITO",
            payload: remitoId,
        });

        setRemitosAgrupados(agruparRemitos(selectedId));
    };

    useEffect(() => {
        setRemitosAgrupados(agruparRemitos(selectedId));
    }, [selectedId, state.remitos]);

    return (
        <PageContainer>
            <h2>Modificar Remitos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Remito:</label>
                <select style={{fontSize: "16px"}} value={selectedId} onChange={handleSelect}>
                    <option value="">Seleccionar remito</option>
                    {remitoIds.length > 0 ? (
                        remitoIds.map((groupId) => (
                            <option key={groupId} value={groupId}>
                                Remito n°: {groupId}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay remitos disponibles</option>
                    )}
                </select>
            </div>

            {remitosAgrupados[selectedId] && remitosAgrupados[selectedId].length > 0 && (
                <TablaRemito
                    remitos={remitosAgrupados[selectedId]}
                    handleEditRemito={handleEditRemito}
                    handleDeleteRemito={handleDeleteRemito}
                />
            )}

            <ColadaModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleSaveEdit}
                remitoData={selectedRemito}
                title="Editar Remito"
            />

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default ModificarColada;
