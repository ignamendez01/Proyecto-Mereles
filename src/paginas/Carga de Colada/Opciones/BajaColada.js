import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useData} from "../../../context/DataContext";
import {ButtonContainer, PageContainer, Button} from "../../../components/Styles";
import TablaColada from "../Common/TablaColada";

const BajaColada = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useData();
    const remitos = state.remitos;

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

    const handleEliminar = () => {
        if (!selectedId) return;

        const remitosActualizados = state.remitos.map(remito =>
            remito.groupId === parseInt(selectedId) ? { ...remito, isActive: false } : remito
        );

        dispatch({ type: "DESACTIVAR_REMITOS", payload: remitosActualizados });

        setSelectedId("");
    };

    useEffect(() => {
        setRemitosAgrupados(agruparRemitos(selectedId));
    }, [selectedId]);

    return (
        <PageContainer>
            <h2>Baja de Remitos</h2>
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

            {remitosAgrupados[selectedId] && (
                <TablaColada remitos={remitosAgrupados[selectedId]}/>
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                <Button onClick={handleEliminar}>Eliminar</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default BajaColada
