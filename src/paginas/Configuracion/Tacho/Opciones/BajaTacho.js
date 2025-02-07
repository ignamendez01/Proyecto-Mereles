import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';

const BajaTacho = () => {
    const { state, dispatch } = useData();
    const tachos = state.tachos.filter((m) => m.isActive);
    const [selectedModel, setSelectedModel] = useState(null);
    const navigate = useNavigate();

    const handleSelectChange = (event) => {
        const model = tachos.find(m => m.id === parseInt(event.target.value));
        if (model && model.id) {
            setSelectedModel(model);
        } else {
            setSelectedModel(null);
        }
    };

    const handleEliminar = () => {
        if (selectedModel) {
            dispatch({ type: "DESACTIVAR_TACHO", payload: selectedModel.id });
            setSelectedModel(null);
        }
    };

    return (
        <PageContainer>
            <h2>Baja de Tachos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Modelo:</label>
                <select id="model-select" style={{fontSize:"16px"}} onChange={handleSelectChange} defaultValue="">
                    <option value="">Seleccione un tacho</option>
                    {tachos.length > 0 ? (
                        tachos.map((modelo) => (
                            <option key={modelo.id} value={modelo.id}>
                                {modelo.id} - {modelo.descripcion}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay tachos disponibles</option>
                    )}
                </select>
            </div>

            {selectedModel && (
                <Tabla object={selectedModel} />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                {selectedModel && (
                    <Button onClick={handleEliminar}>Eliminar</Button>
                )}
            </ButtonContainer>
        </PageContainer>
    );
};

export default BajaTacho;

