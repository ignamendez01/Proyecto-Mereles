import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import Modal from "../../Common/Modal";

const ModificarTacho = () => {
    const { state, dispatch } = useData();
    const tachos = state.tachos.filter((m) => m.isActive);
    const [selectedTacho, setSelectedTacho] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleSelectChange = (event) => {
        const tacho = tachos.find(m => m.id === parseInt(event.target.value));
        if (tacho && tacho.id) {
            setSelectedTacho(tacho);
        } else {
            setSelectedTacho(null);
        }
    };

    const handleEditClick = () => {
        if (selectedTacho) {
            setIsModalOpen(true);
        }
    };

    const handleSubmitEdit = (tachoData) => {
        const updatedTachoData = { ...tachoData, id: selectedTacho.id };

        dispatch({ type: "UPDATE_TACHO", payload: updatedTachoData });

        setSelectedTacho(updatedTachoData);
        setIsModalOpen(false);
    };

    return (
        <PageContainer>
            <h2>Modificación de Tachos</h2>
            <div className="input-container">
                <label htmlFor="tacho-select">Seleccionar Tacho:</label>
                <select
                    id="tacho-select"
                    style={{ fontSize: "16px" }}
                    onChange={handleSelectChange}
                    value={selectedTacho ? selectedTacho.numero : ""}
                >
                    <option value="">Seleccione un tacho</option>
                    {tachos.length > 0 ? (
                        tachos.map((tacho) => (
                            <option key={tacho.id} value={tacho.id}>
                                {tacho.id} - {tacho.descripcion}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay tachos disponibles</option>
                    )}
                </select>
            </div>

            {selectedTacho && (
                <Tabla object={selectedTacho} />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {selectedTacho && (
                    <Button onClick={handleEditClick}>Modificar</Button>
                )}
            </ButtonContainer>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitEdit}
                data={selectedTacho}
                title="Editar Tacho"
            />
        </PageContainer>
    );
};

export default ModificarTacho;
