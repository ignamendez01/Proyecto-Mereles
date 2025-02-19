import React from "react";
import styled from "styled-components";
import { Edit, Delete } from "@mui/icons-material";
import { Table, Th, Td, Img } from "../../../components/TableStyles"

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
    font-weight: bold;
    background-color: #f8f8f8;
`;

const TablaColada = ({ coladas,
                         handleEditRemito,
                         handleDeleteRemito }) => {
    const data = Array.isArray(coladas) ? coladas : [coladas];

    const totalPesoTotal = data.reduce((acc, colada) => acc + (colada.pesoTotal || 0), 0);

    return (
        <Table>
            <thead>
            <tr>
                <Th>Número</Th>
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
            {data.map((colada, index) => (
                <tr key={index}>
                    <Td>{colada.coladaId}</Td>
                    <Td>{colada.modeloId}</Td>
                    <Td>
                        <Img src={colada.imagen} alt="Modelo"/>
                    </Td>
                    <Td>{colada.cantidad}</Td>
                    <Td>{colada.peso}</Td>
                    <Td>{colada.pesoTotal}</Td>
                    <Td>{colada.colada}</Td>
                    <Td>{colada.fecha}</Td>
                    <Td>
                        <IconButton onClick={() => handleEditRemito(colada)}>
                            <Edit/>
                        </IconButton>
                    </Td>
                    <Td>
                        <IconButton onClick={() => handleDeleteRemito(colada)}>
                            <Delete/>
                        </IconButton>
                    </Td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <TdFooter colSpan={4}></TdFooter>
                <TdFooter>Total Remito</TdFooter>
                <TdFooterTotal>{totalPesoTotal}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={3}></TdFooter>
            </tr>
            </tfoot>
        </Table>
    );
};

export default TablaColada;
