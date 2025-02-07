import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { Button, ButtonContainer, PageContainer } from "../../../components/Styles";
import { useNavigate } from "react-router-dom";
import TablaRemito from "../Common/TablaRemito";

const ResumenColada = () => {
    const { state } = useData();
    const navigate = useNavigate();

    const remitos = state.remitos.filter(remito => remito.isActive);
    const [selectedId, setSelectedId] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [remitosFiltrados, setRemitosFiltrados] = useState(remitos);

    const remitoIds = remitos.map(remito => remito.id);

    const handleBuscar = () => {
        let nuevosRemitos = remitos.filter(remito => remito.id === parseInt(selectedId));

        if (fechaDesde && fechaHasta) {
            nuevosRemitos = nuevosRemitos.map(remito => ({
                ...remito,
                coladas: remito.coladas.filter(colada => {
                    const fechaColada = new Date(colada.fecha);
                    return fechaColada >= new Date(fechaDesde) && fechaColada <= new Date(fechaHasta);
                })
            }));
        }

        setRemitosFiltrados(nuevosRemitos);
    };

    const handleSelect = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);
        setFechaDesde("");
        setFechaHasta("");

        if (!newId) {
            setRemitosFiltrados(remitos); // Mostrar todos los remitos si no hay selección
        } else {
            setRemitosFiltrados(remitos.filter(remito => remito.id === parseInt(newId)));
        }
    };

    return (
        <PageContainer>
            <h2>Resumen de Remitos</h2>

            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Remito:</label>
                <select value={selectedId} style={{ fontSize: "16px" }} onChange={handleSelect}>
                    <option value="">Todos los remitos</option>
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
                    <label>Desde: </label>
                    <input
                        type="date"
                        style={{ marginRight: "20px" }}
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                    <label>Hasta: </label>
                    <input
                        type="date"
                        value={fechaHasta}
                        style={{ marginRight: "20px" }}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                    <Button onClick={handleBuscar}>Buscar</Button>
                </div>
            )}

            {remitosFiltrados.map(remito => (
                <div key={remito.id}>
                    <TablaRemito remito={remito} />
                </div>
            ))}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>
        </PageContainer>
    );
};


export default ResumenColada;
