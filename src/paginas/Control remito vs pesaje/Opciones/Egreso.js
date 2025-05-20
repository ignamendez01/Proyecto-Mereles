import React, {useEffect, useState} from "react";
import {Img, Table, Td, Th} from "../../../components/TableStyles";
import {useNavigate} from "react-router-dom";
import {Button, ButtonContainer, PageContainer} from "../../../components/Styles";
import {TdFooter, TdFooterTotal} from "./Ingreso";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const TablaDetallesRemitos = ({ remito, setLoading }) => {
    const [isEgresando, setIsEgresando] = useState(false);
    const totalPeso = remito.pesoTotal;
    const tachoPeso = remito.tachoPeso;

    const handleEgresar = () => {
        setIsEgresando(true);
        setLoading(true);
        const token = localStorage.getItem("token");

        axios.patch(`${API_URL}/pesajes/${remito.id}/egresar`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                axios.patch(`${API_URL}/remitos/${remito.remitoId}/egresar`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(() => {
                        setIsEgresando(false);
                        setLoading(false);
                    })
                    .catch(error => console.error("Error al actualizar remito:", error));
            })
            .catch(error => console.error("Error al egresar remito:", error));
    };

    return (
        <Table>
            <thead>
            <tr>
                <Th>Remito n°</Th>
                <Th>Model de Pieza</Th>
                <Th>Imagen</Th>
                <Th>Cantidad</Th>
                <Th>Peso pieza (kg)</Th>
                <Th>Total (kg)</Th>
                <Th>Peso de Tacho (kg)</Th>
                <Th>Colada n°</Th>
                <Th>Fecha</Th>
                <Th>Egresar</Th>
            </tr>
            </thead>
            <tbody>
            {remito.coladas.map((colada, index) => (
                <tr key={remito.id}>
                    {index === 0 ? (
                        <Td rowSpan={remito.coladas.length}>{remito.id}</Td>
                    ) : null}
                    <Td>{colada.modeloId}</Td>
                    <Td><Img src={colada.imagen} alt="Imagen del remito"/></Td>
                    <Td>{colada.cantidad}</Td>
                    <Td>{colada.peso}</Td>
                    <Td>{colada.pesoTotal}</Td>
                    {index === 0 ? (
                        <Td rowSpan={remito.coladas.length}>{tachoPeso}</Td>
                    ) : null}
                    <Td>{colada.colada}</Td>
                    <Td>{colada.fecha}</Td>
                    {index === 0 ? (
                        <Td rowSpan={remito.coladas.length}>
                            <Button onClick={handleEgresar} disabled={isEgresando}>
                                {isEgresando ? "Egresando..." : "Egresar"}
                            </Button>
                        </Td>
                    ) : null}
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <TdFooter colSpan={4}></TdFooter>
                <TdFooter>Total Remito</TdFooter>
                <TdFooterTotal>{totalPeso}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={3}></TdFooter>
            </tr>
            <tr>
                <TdFooter colSpan={4}></TdFooter>
                <TdFooter>Total Pesaje</TdFooter>
                <TdFooterTotal>{totalPeso + tachoPeso}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={3}></TdFooter>
            </tr>
            </tfoot>
        </Table>
    );
};

const Egreso = () => {
    const navigate = useNavigate();

    const [remitosFiltrados, setRemitosFiltrados] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRemitosPesadosNoEgresados = () => {
            const token = localStorage.getItem("token");

            axios.get(`${API_URL}/pesajes/pesados-no-egresados`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setRemitosFiltrados(response.data);
                })
                .catch(error => console.error("Error al obtener remitos:", error));
        };

        fetchRemitosPesadosNoEgresados();
        const interval = setInterval(fetchRemitosPesadosNoEgresados, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <PageContainer>
            <h2>Grilla de remitos para entregar</h2>
            {remitosFiltrados.length > 0 ? (
                remitosFiltrados.map(remito => (
                    <div key={remito.id}>
                        <TablaDetallesRemitos
                            remito={remito}
                            setLoading={setIsLoading} />
                    </div>
                ))
            ) : (
                <p>No hay remitos listos para entregar.</p>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isLoading}>
                    Volver
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default Egreso
