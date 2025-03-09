import React, {useEffect, useState} from "react";
import { Table, Th, Td, Img } from "../../../components/TableStyles";
import {Button, ButtonContainer, PageContainer} from "../../../components/Styles";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const IconButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
        background-color: dimgray;
    }
    &:disabled {
        background-color: lightgray;
        cursor: not-allowed;
    }
`;

export const TdFooter = styled(Td)`
    border: none;
`;

export const TdFooterTotal = styled(Td)`
    border: 1px solid black;
`;

const TablaRemitosAgrupados = ({ pesajes, selectedRemito, setSelectedRemito }) => (
    <Table>
        <thead>
        <tr>
            <Th>Remito ID</Th>
            <Th>Peso Total (kg)</Th>
            <Th>Seleccionar</Th>
        </tr>
        </thead>
        <tbody>
        {pesajes.map((remito) => (
            <tr key={remito.id}>
                <Td>{remito.id}</Td>
                <Td>{remito.pesoTotal}</Td>
                <Td>
                    <IconButton
                        onClick={() => setSelectedRemito(remito)}
                        disabled={selectedRemito?.id === remito.id}
                    >
                        <CheckBoxOutlinedIcon />
                    </IconButton>
                </Td>
            </tr>
        ))}
        </tbody>
    </Table>
);

const TablaDetallesRemitos = ({remito}) => {
    console.log(remito)
    const totalPeso = remito.pesoTotal;
    const [pesoTacho, setPesoTacho] = useState(null);

    axios.get(`${API_URL}/tachos/${remito.tachoId}`)
        .then(response => {
            const tacho = response.data;
            setPesoTacho(tacho.peso);
        })
        .catch(error => console.error("Error al obtener tacho:", error));

    return (
        <Table>
            <thead>
            <tr>
                <Th>Colada ID</Th>
                <Th>Modelo</Th>
                <Th>Imagen</Th>
                <Th>Cantidad</Th>
                <Th>Peso pieza (kg)</Th>
                <Th>Total (kg)</Th>
                <Th>Peso de Tacho (kg)</Th>
                <Th>Fecha</Th>
            </tr>
            </thead>
            <tbody>
            {remito.coladas.map((colada, index) => (
                <tr key={remito.id}>
                    {index === 0 ? (
                        <Td rowSpan={remito.coladas.length}>{remito.id}</Td>
                    ) : null}
                    <Td>{colada.modeloId}</Td>
                    <Td><Img src={colada.imagen} alt="Imagen de colada" /></Td>
                    <Td>{colada.cantidad}</Td>
                    <Td>{colada.peso}</Td>
                    <Td>{colada.pesoTotal}</Td>
                    {index === 0 ? (
                        <Td rowSpan={remito.coladas.length}>{pesoTacho}</Td>
                    ) : null}
                    <Td>{colada.fecha}</Td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <TdFooter colSpan={4}></TdFooter>
                <TdFooter>Total Remito</TdFooter>
                <TdFooterTotal>{totalPeso}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={2}></TdFooter>
            </tr>
            <tr>
                <TdFooter colSpan={4}></TdFooter>
                <TdFooter>Total Pesaje</TdFooter>
                <TdFooterTotal>{totalPeso + pesoTacho}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={2}></TdFooter>
            </tr>
            </tfoot>
        </Table>
    );
};

const Ingreso = () => {
    const navigate = useNavigate();
    const [selectedRemito, setSelectedRemito] = useState(null);
    const [pesajes, setPesajes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRemitosNoPesados = () => {
            axios.get(`${API_URL}/pesajes/no-pesados`)
                .then(response => {
                    setPesajes(response.data)
                })
                .catch(error => console.error("Error al obtener remitos:", error));
        };

        fetchRemitosNoPesados();
        const interval = setInterval(fetchRemitosNoPesados, 1000);

        return () => clearInterval(interval);
    }, []);

    function handlePesar() {
        setIsLoading(true);
        axios.patch(`${API_URL}/pesajes/${selectedRemito.id}/pesar`)
            .then(() => {
                setSelectedRemito(null);
                setIsLoading(false);
            })
            .catch(error => console.error("Error al eliminar remito:", error));
    }

    return (
        <PageContainer>
            <h2>Ingreso para control de pesaje</h2>
            {pesajes.length > 0 ? (
                <TablaRemitosAgrupados
                    pesajes={pesajes}
                    selectedRemito={selectedRemito}
                    setSelectedRemito={setSelectedRemito}
                />
            ) : (
                <p>No hay remitos activos.</p>
            )}

            {selectedRemito && (
                <div key={selectedRemito.id}>
                    <h2>Grilla de remitos para pesaje</h2>
                    <TablaDetallesRemitos remito={selectedRemito}/>
                </div>
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isLoading}>
                    Volver
                </Button>
                <Button
                    onClick={handlePesar}
                    disabled={!selectedRemito || isLoading}>
                    {isLoading ? "Pesando..." : "Pesar"}
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default Ingreso;
