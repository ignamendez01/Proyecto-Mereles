import React from "react";
import styled from "styled-components";

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

const TablaCatalogo = ({ modelos }) => {
    const data = Array.isArray(modelos) ? modelos : [modelos];

    return (
        <Table>
            <thead>
            <tr>
                <Th>ID</Th>
                <Th>Descripción</Th>
                <Th>Peso (kg)</Th>
                <Th>Imagen</Th>
            </tr>
            </thead>
            <tbody>
            {data.map((modelo) => (
                <tr key={modelo.id}>
                    <Td>{modelo.id}</Td>
                    <Td>{modelo.descripcion}</Td>
                    <Td>{modelo.peso}</Td>
                    <Td>
                        <Img src={modelo.imagen} alt="Modelo" />
                    </Td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default TablaCatalogo;

