import React, {useEffect, useRef, useState} from "react";
import { Button, ButtonContainer, PageContainer } from "../../../components/Styles";
import { useNavigate } from "react-router-dom";
import TablaRemito from "../Common/TablaRemito";
import TablaEnviarRemito from "../Common/TablaEnviarRemito";
import axios from "axios";
import RemitoDocumento from "../RemitoDocumento";

const API_URL = process.env.REACT_APP_API_URL;

const ResumenColada = () => {
    const navigate = useNavigate();

    const [remitos, setRemitos] = useState([]);
    const [modelos, setModelos] = useState([]);

    const [selectedId, setSelectedId] = useState("");
    const [datos, setDatos] = useState(null);

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [remitosFiltrados, setRemitosFiltrados] = useState(remitos);

    const [modoFiltrado, setModoFiltrado] = useState(false);
    const [enviandoRemitoId, setEnviandoRemitoId] = useState(null);

    const remitoIds = remitos.map(remito => remito.id);

    const prevRemitosRef = useRef([]);

    useEffect(() => {
        const fetchRemitosActivos = () => {
            const token = localStorage.getItem("token");

            axios.get(`${API_URL}/remitos/activos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
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

    const prevModelosRef = useRef([]);

    useEffect(() => {
        const fetchModelosActivos = () => {
            const token = localStorage.getItem("token");

            axios.get(`${API_URL}/modelos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const nuevosModelos = response.data;

                    if (JSON.stringify(prevModelosRef.current) !== JSON.stringify(nuevosModelos)) {
                        setModelos(response.data);
                        prevModelosRef.current = nuevosModelos;
                    }
                })
                .catch(error => console.error("Error al obtener modelos:", error));
        };

        fetchModelosActivos();
        const interval = setInterval(fetchModelosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(selectedId) {
            const remitoSelected = remitos.find(remito => remito.id === parseInt(selectedId));
            if (remitoSelected) {
                let nuevosRemitos = remitos.filter(m => m.id === parseInt(selectedId));
                console.log(nuevosRemitos)
                if(modoFiltrado) {
                    nuevosRemitos = nuevosRemitos.map(remito => ({
                        ...remito,
                        coladas: remito.coladas.filter(colada => {
                            const fechaColada = new Date(colada.fecha);
                            return fechaColada >= new Date(fechaDesde) && fechaColada <= new Date(fechaHasta);
                        })
                    }));
                }
                setRemitosFiltrados(nuevosRemitos);
            }else{
                setSelectedId("");
                setFechaDesde("");
                setFechaHasta("");
                setModoFiltrado(false);
            }

        }else{
            setRemitosFiltrados(remitos);
        }
    }, [remitos]);

    const handleSelect = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);
        setFechaDesde("");
        setFechaHasta("");
        setModoFiltrado(false);

        if (!newId) {
            setRemitosFiltrados(remitos);
        } else {
            const remitoSeleccionado = remitos.find(remito => remito.id === parseInt(newId));
            setRemitosFiltrados([remitoSeleccionado]);

            if (remitoSeleccionado) {
                setDatos({
                    numero: `${remitoSeleccionado.id}`,
                    fecha: new Date().toLocaleDateString("es-AR"),
                    cliente: "",
                    domicilio: "",
                    iva: "",
                    cuit: "",
                    transportistaNombre: "",
                    transportistaDomicilio: "",
                    cuil: "",
                    items: (remitoSeleccionado.coladas || []).map(colada => {
                        const modelo = modelos.find(m => m.id === colada.modeloId);
                        console.log(modelo)
                        return {
                            notaPedido: "",
                            ordenFabric: "",
                            cantidad: colada.cantidad,
                            denominacion: modelo.descripcion,
                            ordenCompra: "",
                            kgs: colada.peso,
                            observaciones: "",
                        };
                    })
                });
            } else {
                setDatos(null); // seguridad por si no se encuentra
            }
        }
    };

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

    const handleEnviarRemito = (remito) => {
        const remitoId = remito.id;
        setEnviandoRemitoId(remito.id);
        const token = localStorage.getItem("token");

        axios.patch(`${API_URL}/remitos/${remitoId}/enviar`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                axios.post(`${API_URL}/pesajes/crearDesdeRemito/${remitoId}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(error => console.error("Error al crear pesaje desde remito:", error));
                setSelectedId("");
            })
            .catch(error => console.error("Error al enviar remito:", error))
            .finally(() => setEnviandoRemitoId(null));
    };

    const remitoRef = useRef();

    const handlePrintManual = () => {
        const content = remitoRef.current;

        if (!content) {
            console.error("No se encontró el contenido del remito.");
            return;
        }

        console.log(content.innerHTML); // Verifica si hay contenido aquí

        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
            <html>
                <head>
                    <title>Remito</title>
                </head>
                <body>${content.innerHTML}</body>
            </html>
        `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    return (
        <PageContainer>
            <h2>Resumen de Remitos</h2>

            <div className="input-container">
                <label htmlFor="model-select">Seleccionar Remito:</label>
                <select value={selectedId} style={{fontSize: "16px"}} onChange={handleSelect}>
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
                        <TablaRemito remito={remito}/>
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
                {selectedId && (
                    <Button onClick={handlePrintManual}>
                        Imprimir
                    </Button>
                )}
            </ButtonContainer>
            <div style={{position: "absolute", top: "-9999px", left: "-9999px"}}>
                <div ref={remitoRef}>
                    {datos && <RemitoDocumento datos={datos}/>}
                </div>

            </div>
        </PageContainer>
    );
};

export default ResumenColada;
