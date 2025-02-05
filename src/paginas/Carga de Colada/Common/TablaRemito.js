import React from "react";
import styled from "styled-components";
import { Edit, Delete } from "@mui/icons-material";

export const Table = styled.table`
    margin-top: 20px;
    border-collapse: collapse;
    width: 80%;
`;

export const Th = styled.th`
    border: 1px solid black;
    padding: 8px;
    background-color: lightgray;
`;

export const Td = styled.td`
    border: 1px solid black;
    padding: 8px;
    text-align: center;
`;

export const Img = styled.img`
    width: 50px;
    height: 50px;
`;

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

const TablaRemito = ({ remitos,
                         handleEditRemito,
                         handleDeleteRemito }) => {
    const data = Array.isArray(remitos) ? remitos : [remitos];

    const totalPesoTotal = data.reduce((acc, remito) => acc + (remito.pesoTotal || 0), 0);

    return (
        <Table>
            <thead>
            <tr>
                <Th>Modelo pieza</Th>
                <Th>Imágen</Th>
                <Th>Cantidad</Th>
                <Th>Peso pieza (kg)</Th>
                <Th>Total KG</Th>
                <Th>Colada n°</Th>
                <Th>Fecha</Th>
                <Th>Editar</Th>
                <Th>Eliminar</Th>
            </tr>
            </thead>
            <tbody>
            {data.map((remito, index) => (
                <tr key={index}>
                    <Td>{remito.modelId}</Td>
                    <Td>
                        <Img src={remito.imagen} alt="Modelo"/>
                    </Td>
                    <Td>{remito.cantidad}</Td>
                    <Td>{remito.peso}</Td>
                    <Td>{remito.pesoTotal}</Td>
                    <Td>{remito.colada}</Td>
                    <Td>{remito.fecha}</Td>
                    <Td>
                        <IconButton onClick={() => handleEditRemito(remito)}>
                            <Edit/>
                        </IconButton>
                    </Td>
                    <Td>
                        <IconButton onClick={() => handleDeleteRemito(remito)}>
                            <Delete/>
                        </IconButton>
                    </Td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <TdFooter colSpan={3}></TdFooter>
                <TdFooter>Total Remito</TdFooter>
                <TdFooterTotal>{totalPesoTotal}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={3}></TdFooter>
            </tr>
            </tfoot>
        </Table>
    );
};

export default TablaRemito;
