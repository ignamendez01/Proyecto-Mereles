import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {useData} from "../../../context/DataContext";
import {ButtonContainer, PageContainer, Button} from "../../../components/Styles";
import TablaColada from "../Common/TablaColada";
import ColadaModal, {Img} from "../Common/ColadaModal";

const ModificarColada = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useData();

    const remitos = state.remitos.filter(remito => remito.isActive);
    const [selectedId, setSelectedId] = useState("");
    const [selectedColada, setSelectedColada] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTachoId, setSelectedTachoId] = useState("");
    const [localColadas, setLocalColadas] = useState([]);
    const [imagen, setImagen] = useState(null);

    const remitoIds = remitos.map(remito => remito.id);
    const tachos = state.tachos.filter(tacho => tacho.isActive);

    const handleSelect = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);

        if (!newId) {
            setSelectedTachoId("");
            setLocalColadas([]);
        } else {
            const remitoSeleccionado = remitos.find(remito => remito.id === parseInt(newId));
            setLocalColadas([...remitoSeleccionado.coladas]);
            const tachoSeleccionado = tachos.find(tacho => tacho.id === parseInt(remitoSeleccionado.tachoId));
            setSelectedTachoId(tachoSeleccionado.id);
            setImagen(tachoSeleccionado.imagen);
        }
    };

    const handleSaveColada = (updatedColada) => {
        console.log(updatedColada);

        setLocalColadas(prevColadas => {
            const newColadas = prevColadas.map(colada =>
                colada.coladaId === selectedColada.coladaId
                    ? { ...updatedColada, coladaId: selectedColada.coladaId }
                    : colada
            );

            return [...newColadas];
        });

        setIsEditModalOpen(false);
    };


    const handleDeleteColada = (deletedColada) => {
        setLocalColadas(prevColadas => {
            return prevColadas
                .filter((c) => c.coladaId !== deletedColada.coladaId)
                .map((c) =>
                    c.coladaId > deletedColada.coladaId
                        ? {...c, coladaId: c.coladaId - 1}
                        : c
                );
        });
    };

    const handleUpdateRemito = () => {
        const updatedRemito = {
            ...remitos.find(remito => remito.id === parseInt(selectedId)),
            tachoId: selectedTachoId,
            coladas: localColadas,
        };

        dispatch({ type: "UPDATE_REMITO", payload: updatedRemito });
        setSelectedId("");
        setLocalColadas([])
    };

    function handleSelectTacho(e) {
        const tachoSeleccionado = tachos.find(tacho => tacho.id === parseInt(e.target.value));
        setSelectedTachoId(tachoSeleccionado.id);
        setImagen(tachoSeleccionado.imagen);
    }

    const handleEditColada = (colada) => {
        setSelectedColada(colada);
        setIsEditModalOpen(true);
    };

    return (
        <PageContainer>
            <h2>Editar Remitos</h2>

            <div className="input-container">
                <label htmlFor="remito-select">Seleccionar Remito:</label>
                <select style={{ fontSize: "16px" }} value={selectedId} onChange={handleSelect}>
                    <option value="">Seleccionar remito</option>
                    {remitoIds.length > 0 ? (
                        remitoIds.map((id) => (
                            <option key={id} value={id}>
                                Remito n°: {id}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay remitos disponibles</option>
                    )}
                </select>
            </div>

            {selectedId && (
                <div className="input-container">
                    <label htmlFor="tacho-select">Seleccionar Tacho:</label>
                    <div style={{ display: "flex", gap: "2vh", alignItems: "center" }}>
                        <select
                            style={{ fontSize: "16px" }}
                            value={selectedTachoId}
                            onChange={handleSelectTacho}
                        >
                            {tachos.map((tacho) => (
                                <option key={tacho.id} value={tacho.id}>
                                    Tacho n°: {tacho.id}
                                </option>
                            ))}
                        </select>
                        <Img src={imagen} alt="Vista previa"/>
                    </div>
                </div>
            )}

            {localColadas.length > 0 && (
                <div>
                    <TablaColada
                        coladas={localColadas}
                        handleEditRemito={handleEditColada}
                        handleDeleteRemito={handleDeleteColada}
                    />
                </div>
            )}

            {selectedColada && isEditModalOpen && (
                <ColadaModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleSaveColada}
                    coladaData={selectedColada}
                    title="Editar Colada"
                />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                <Button onClick={handleUpdateRemito} disabled={!selectedId}>Actualizar Remito</Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default ModificarColada;
