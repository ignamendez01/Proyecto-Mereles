import React, {useEffect, useRef, useState} from "react";
import { Button, ButtonContainer, PageContainer } from "../../../components/Styles";
import { useNavigate } from "react-router-dom";
import TablaRemito from "../Common/TablaRemito";
import TablaEnviarRemito from "../Common/TablaEnviarRemito";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ResumenColada = () => {
    const navigate = useNavigate();

    const [remitos, setRemitos] = useState([]);

    const [selectedId, setSelectedId] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [remitosFiltrados, setRemitosFiltrados] = useState(remitos);

    const [modoFiltrado, setModoFiltrado] = useState(false);
    const [enviandoRemitoId, setEnviandoRemitoId] = useState(null);

    const remitoIds = remitos.map(remito => remito.id);

    const prevRemitosRef = useRef([]);

    useEffect(() => {
        const fetchRemitosActivos = () => {
            axios.get(`${API_URL}/remitos/activos`)
                .then(response => {
                    const nuevosRemitos = response.data;

                    if (JSON.stringify(prevRemitosRef.current) !== JSON.stringify(nuevosRemitos)) {
                        setRemitos(response.data);
                        prevRemitosRef.current = nuevosRemitos;
                    }
                })
                .catch(error => console.error("Error al obtener remitos:", error));
        };

        fetchRemitosActivos();
        const interval = setInterval(fetchRemitosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

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
            setModoFiltrado(true);
        }

        setRemitosFiltrados(nuevosRemitos);
    };

    const handleSelect = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);
        setFechaDesde("");
        setFechaHasta("");
        setModoFiltrado(false);

        if (!newId) {
            setRemitosFiltrados(remitos);
        } else {
            setRemitosFiltrados(remitos.filter(remito => remito.id === parseInt(newId)));
        }
    };

    const handleEnviarRemito = (remito) => {
        const remitoId = remito.id;
        setEnviandoRemitoId(remito.id);

        axios.patch(`${API_URL}/remitos/${remitoId}/enviar`)
            .then(() => {
                axios.post(`${API_URL}/pesajes/crearDesdeRemito/${remitoId}`)
                    .catch(error => console.error("Error al crear pesaje desde remito:", error));
                setSelectedId("")
            })
            .catch(error => console.error("Error al enviar remito:", error))
            .finally(() => setEnviandoRemitoId(null));
    };

    useEffect(() => {
        setRemitosFiltrados(remitos);
    }, [remitos]);

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
                    <Button
                        onClick={handleBuscar}
                        disabled={fechaDesde === "" || fechaHasta === ""}>
                        Buscar
                    </Button>
                </div>
            )}

            {remitosFiltrados.map(remito => (
                <div key={remito.id}>
                    {modoFiltrado ? (
                        <TablaRemito remito={remito} />
                    ) : (
                        <TablaEnviarRemito
                            remito={remito}
                            handleEnviarRemito={handleEnviarRemito}
                            enviandoRemitoId={enviandoRemitoId}
                        />
                    )}
                </div>
            ))}

            <ButtonContainer>
                <Button
                    onClick={() => navigate("/home")}
                    disabled={enviandoRemitoId !== null}
                >
                    Volver
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default ResumenColada;
