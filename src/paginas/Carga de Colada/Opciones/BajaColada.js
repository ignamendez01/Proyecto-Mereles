import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useData} from "../../../context/DataContext";
import {ButtonContainer, PageContainer, Button} from "../../../components/Styles";
import TablaRemito from "../Common/TablaRemito";

const BajaColada = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useData();

    const remitos = state.remitos.filter(remito => remito.isActive);
    const [selectedId, setSelectedId] = useState("");
    const [remitosFiltrados, setRemitosFiltrados] = useState([]);

    const remitoIds = remitos.map(remito => remito.id);

    const handleSelect = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);

        if (!newId) {
            setRemitosFiltrados([]);
        } else {
            setRemitosFiltrados(remitos.filter(remito => remito.id === parseInt(newId)));
        }
    };

    const handleEliminar = () => {
        if (!selectedId) return;

        const remitoAEliminar = remitos.find(remito => remito.id === parseInt(selectedId));
        dispatch({ type: "DESACTIVAR_REMITO", payload: remitoAEliminar });

        setSelectedId("");
        setRemitosFiltrados([]);
    };


    return (
        <PageContainer>
            <h2>Baja de Remitos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Remito:</label>
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

            {remitosFiltrados.map(remito => (
                <div key={remito.id}>
                    <TablaRemito remito={remito} />
                </div>
            ))}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                <Button onClick={handleEliminar} disabled={!selectedId}>
                    Eliminar
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default BajaColada
