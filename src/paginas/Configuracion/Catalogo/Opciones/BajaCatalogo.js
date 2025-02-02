import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/CatalogStyles';
import TablaCatalogo from '../../../../components/TablaCatalogo';

const BajaCatalogo = () => {
    const { state, dispatch } = useData();
    const modelos = state.items.filter((m) => m.isActive);
    const [selectedModel, setSelectedModel] = useState(null);
    const navigate = useNavigate();

    const handleSelectChange = (event) => {
        const model = modelos.find(m => m.id === parseInt(event.target.value));
        if (model && model.id) {
            setSelectedModel(model);
        } else {
            setSelectedModel(null);
        }
    };

    const handleEliminar = () => {
        if (selectedModel) {
            dispatch({ type: "DESACTIVATE_ITEM", payload: selectedModel.id });
            setSelectedModel(null);
        }
    };

    return (
        <PageContainer>
            <h2>Baja de Modelos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Modelo:</label>
                <select id="model-select" style={{fontSize:"16px"}} onChange={handleSelectChange} defaultValue="">
                    <option value="">Seleccione un modelo</option>
                    {modelos.length > 0 ? (
                        modelos.map((modelo) => (
                            <option key={modelo.id} value={modelo.id}>
                                {modelo.id} - {modelo.descripcion}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay modelos disponibles</option>
                    )}
                </select>
            </div>

            {selectedModel && (
                <TablaCatalogo modelos={selectedModel} />
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

export default BajaCatalogo;

