import React, {useMemo, useState} from "react";
import { Table, Th, Td } from "../../../components/TableStyles";

const VistaRemito = ({ remitos }) => {
    const remitosEliminados = remitos.filter(r => r.activo === false);

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [ubicacion, setUbicacion] = useState("TODOS"); // "TODOS", "FABRICA", "PRODUCCION"
    const [pesoMin, setPesoMin] = useState("");
    const [pesoMax, setPesoMax] = useState("");

    const filtrarRemitos = useMemo(() => {
        return remitos.filter(remito => {
            // Filtro por ubicación
            if (ubicacion === "FABRICA" && remito.enviado) return false;
            if (ubicacion === "PRODUCCION" && !remito.enviado) return false;

            // Filtro por peso
            if (pesoMin && remito.pesoTotal < parseFloat(pesoMin)) return false;
            if (pesoMax && remito.pesoTotal > parseFloat(pesoMax)) return false;

            // Filtro por fecha
            const fechasColadas = remito.coladas?.map(c => new Date(c.fecha));
            if (fechasColadas?.length > 0) {
                const primera = new Date(Math.min(...fechasColadas));
                const ultima = new Date(Math.max(...fechasColadas));

                if (fechaInicio && primera < new Date(fechaInicio)) return false;
                if (fechaFin && ultima > new Date(fechaFin)) return false;
            }

            return true;
        });
    }, [remitos, fechaInicio, fechaFin, ubicacion, pesoMin, pesoMax]);

    return (
        <div>
            <h2>Filtros</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div>
                    <label>Fecha inicio: </label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                </div>
                <div>
                    <label>Fecha fin: </label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                </div>
                <div>
                    <label>Ubicación: </label>
                    <select value={ubicacion} onChange={e => setUbicacion(e.target.value)}>
                        <option value="TODOS">Todos</option>
                        <option value="FABRICA">Fábrica</option>
                        <option value="PRODUCCION">Producción</option>
                    </select>
                </div>
                <div>
                    <label>Peso mínimo: </label>
                    <input type="number" step="0.01" value={pesoMin} onChange={e => setPesoMin(e.target.value)} />
                </div>
                <div>
                    <label>Peso máximo: </label>
                    <input type="number" step="0.01" value={pesoMax} onChange={e => setPesoMax(e.target.value)} />
                </div>
            </div>

            <h2>Remitos Creados</h2>
            <Table>
                <thead>
                <tr>
                    <Th>ID</Th>
                    <Th>Peso Total</Th>
                    <Th>ID Tacho</Th>
                    <Th>Ubicación</Th>
                    <Th>Cantidad de Coladas</Th>
                </tr>
                </thead>
                <tbody>
                {filtrarRemitos.map(remito => (
                    <tr key={remito.id}>
                        <Td>{remito.id}</Td>
                        <Td>{remito.pesoTotal} kg</Td>
                        <Td>{remito.tachoId}</Td>
                        <Td>{remito.enviado ? "Producción" : "Fábrica"}</Td>
                        <Td>{remito.coladas?.length ?? 0}</Td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {remitosEliminados.length > 0 && (
                <>
                    <h2 style={{ marginTop: "40px" }}>Remitos dados de baja</h2>
                    <Table>
                        <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Peso Total</Th>
                            <Th>ID Tacho</Th>
                            <Th>Cantidad de Coladas</Th>
                        </tr>
                        </thead>
                        <tbody>
                        {remitosEliminados.map(remito => (
                            <tr key={remito.id}>
                                <Td>{remito.id}</Td>
                                <Td>{remito.pesoTotal} kg</Td>
                                <Td>{remito.tachoId}</Td>
                                <Td>{remito.coladas?.length ?? 0}</Td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default VistaRemito;
