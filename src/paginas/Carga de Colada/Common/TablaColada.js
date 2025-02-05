import React from "react";
import styled from "styled-components";

export const Table = styled.table`
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
    max-width: 1200px;
`;

export const Th = styled.th`
    border: 1px solid black;
    padding: 12px;
    background-color: lightgray;
    text-align: center;
    min-width: 100px;
`;

export const Td = styled.td`
    border: 1px solid black;
    padding: 12px;
    text-align: center;
    min-width: 100px;
`;

export const Img = styled.img`
    width: 60px;
    height: 60px;
`;

export const TdFooter = styled(Td)`
    border: none;
`;

export const TdFooterTotal = styled(Td)`
    border: 1px solid black;
    font-weight: bold;
    background-color: #f8f8f8;
`;

const TablaColada = ({ remitos }) => {
    const data = Array.isArray(remitos) ? remitos : [remitos];

    const totalPesoTotal = data.reduce((acc, remito) => acc + (remito.pesoTotal || 0), 0);

    return (
        <Table>
            <thead>
            <tr>
                <Th>Remito n°</Th>
                <Th>Modelo pieza</Th>
                <Th>Imágen</Th>
                <Th>Cantidad</Th>
                <Th>Peso pieza</Th>
                <Th>Total KG</Th>
                <Th>Colada n°</Th>
                <Th>Fecha</Th>
            </tr>
            </thead>
            <tbody>
            {data.map((remito) => (
                <tr key={remito.groupId}>
                    <Td>{remito.groupId}</Td>
                    <Td>{remito.modelId}</Td>
                    <Td>
                        <Img src={remito.imagen} alt="Modelo"/>
                    </Td>
                    <Td>{remito.cantidad}</Td>
                    <Td>{remito.peso}</Td>
                    <Td>{remito.pesoTotal}</Td>
                    <Td>{remito.colada}</Td>
                    <Td>{remito.fecha}</Td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <TdFooter colSpan={4}></TdFooter>
                <TdFooter>Total Remito</TdFooter>
                <TdFooterTotal>{totalPesoTotal}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={2}></TdFooter>
            </tr>
            </tfoot>
        </Table>
    );
};

export default TablaColada;
