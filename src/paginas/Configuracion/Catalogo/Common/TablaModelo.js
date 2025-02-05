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

const TablaModelo = ({ modelos,
                           handleEditModel,
                           handleDeleteModel }) => {
    const data = Array.isArray(modelos) ? modelos : [modelos];

    return (
        <Table>
            <thead>
            <tr>
                <Th>Descripción</Th>
                <Th>Peso (kg)</Th>
                <Th>Imagen</Th>
                <Th>Editar</Th>
                <Th>Eliminar</Th>
            </tr>
            </thead>
            <tbody>
            {data.map((modelo, index) => (
                <tr key={index}>
                    <Td>{modelo.descripcion}</Td>
                    <Td>{modelo.peso}</Td>
                    <Td>
                        <Img src={modelo.imagen} alt="Modelo" />
                    </Td>
                    <Td>
                        <IconButton onClick={() => handleEditModel(modelo)}>
                            <Edit />
                        </IconButton>
                    </Td>
                    <Td>
                        <IconButton onClick={() => handleDeleteModel(modelo)}>
                            <Delete />
                        </IconButton>
                    </Td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default TablaModelo;
