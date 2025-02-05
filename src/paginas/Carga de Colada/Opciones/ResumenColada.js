import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { Button, ButtonContainer, PageContainer } from "../../../components/Styles";
import { useNavigate } from "react-router-dom";
import TablaColada from "../Common/TablaColada";

const ResumenColada = () => {
    const { state } = useData();
    const navigate = useNavigate();

    const remitos = state.remitos;
    const [selectedId, setSelectedId] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [remitosAgrupados, setRemitosAgrupados] = useState({});

    const remitosActivos = remitos.filter(remito => remito.isActive);
    const remitoIds = [...new Set(remitosActivos.map(remito => remito.groupId))];


    const agruparRemitos = (idSeleccionado) => {
        if (idSeleccionado) {
            return {
                [idSeleccionado]: remitosActivos.filter(remito => remito.groupId === parseInt(idSeleccionado))
            };
        } else {
            return remitosActivos.reduce((acc, remito) => {
                if (!acc[remito.groupId]) acc[remito.groupId] = [];
                acc[remito.groupId].push(remito);
                return acc;
            }, {});
        }
    };

    const handleBuscar = () => {
        if (fechaDesde && fechaHasta) {
            const remitosFiltrados = remitosAgrupados[selectedId]?.filter(remito => {
                const fechaRemito = new Date(remito.fecha);
                return fechaRemito >= new Date(fechaDesde) && fechaRemito <= new Date(fechaHasta);
            });
            setRemitosAgrupados({ [selectedId]: remitosFiltrados });
        }
    };

    const handleSelect = (e) => {
        setSelectedId(e.target.value)
        setFechaDesde("");
        setFechaHasta("");
    };

    React.useEffect(() => {
        setRemitosAgrupados(agruparRemitos(selectedId));
    }, [selectedId]);

    return (
        <PageContainer>
            <h2>Resumen de Remitos</h2>
            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Remito:</label>
                <select value={selectedId} style={{fontSize: "16px"}} onChange={handleSelect}>
                    <option value="">Todos los remitos</option>
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
            {selectedId && (
                <div className="input-container">
                    <label>Desde: </label>
                    <input
                        type="date"
                        style={{marginRight: "20px"}}
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                    <label>Hasta: </label>
                    <input
                        type="date"
                        value={fechaHasta}
                        style={{marginRight: "20px"}}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                    <button onClick={handleBuscar}>Buscar</button>
                </div>
            )}

            {Object.entries(remitosAgrupados).map(([groupId, listaRemitos]) => (
                    <div key={groupId}>
                        <TablaColada remitos={listaRemitos}/>
                    </div>
                ))}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default ResumenColada;

