import React, {useState} from "react";
import { useData } from "../../../context/DataContext";
import { Table, Th, Td, Img } from "../../../components/TableStyles";
import {Button, ButtonContainer, PageContainer} from "../../../components/Styles";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

export const IconButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
        background-color: dimgray;
    }
`;

export const TdFooter = styled(Td)`
    border: none;
`;

export const TdFooterTotal = styled(Td)`
    border: 1px solid black;
`;

const TablaRemitosAgrupados = ({ pesajes, setSelectedGroup }) => (
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
                    <IconButton onClick={() => setSelectedGroup(remito.id)}>
                        <CheckBoxOutlinedIcon />
                    </IconButton>
                </Td>
            </tr>
        ))}
        </tbody>
    </Table>
);

const TablaDetallesRemitos = ({ remito }) => {
    const totalPeso = remito.pesoTotal;
    const { state } = useData();

    const tachos = state.tachos.filter(tacho => tacho.isActive);
    const selectedTacho = tachos.find(tacho => tacho.id === remito.tachoId);
    const pesoTacho = selectedTacho.peso;

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
                    <Td>{colada.modelId}</Td>
                    <Td><Img src={colada.imagen} alt="Imagen de colada" /></Td>
                    <Td>{colada.cantidad}</Td>
                    <Td>{colada.peso}</Td>
                    <Td>{totalPeso}</Td>
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
                <TdFooterTotal>{totalPeso - pesoTacho}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={2}></TdFooter>
            </tr>
            </tfoot>
        </Table>
    );
};

const Ingreso = () => {
    const { state, dispatch } = useData();
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const pesajes = state.pesajes.filter(remito => !remito.isPesado);

    function handlePesar() {
        if (!selectedGroup || !state?.pesajes) return;

        dispatch({ type: "PESAR_REMITOS", payload: selectedGroup });

        setSelectedGroup(null);
    }

    return (
        <PageContainer>
            <h2>Ingreso para control de pesaje</h2>
            {pesajes.length > 0 ? (
                <TablaRemitosAgrupados pesajes={pesajes} setSelectedGroup={setSelectedGroup} />
            ) : (
                <p>No hay remitos activos.</p>
            )}

            {selectedGroup && (
                <div>
                    <h2>Grilla de remitos para pesaje</h2>
                    <TablaDetallesRemitos remito={pesajes.find(remito => remito.id === selectedGroup) || []} />
                </div>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                <Button
                    onClick={handlePesar}
                    disabled={!selectedGroup}>
                    Pesar
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default Ingreso;
