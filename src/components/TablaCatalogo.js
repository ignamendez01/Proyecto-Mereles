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

const TablaCatalogo = ({ modelos,
                           showEdit = false,
                           showDelete = false,
                           handleEditModel,
                           handleDeleteModel }) => {
    const data = Array.isArray(modelos) ? modelos : [modelos];

    return (
        <Table>
            <thead>
            <tr>
                <Th>ID</Th>
                <Th>Descripción</Th>
                <Th>Peso</Th>
                <Th>Imagen</Th>
                {showEdit && <Th>Editar</Th>}
                {showDelete && <Th>Eliminar</Th>}
            </tr>
            </thead>
            <tbody>
            {data.map((modelo) => (
                <tr key={modelo.numero}>
                    <Td>{modelo.numero}</Td>
                    <Td>{modelo.descripcion}</Td>
                    <Td>{modelo.peso} kg</Td>
                    <Td>
                        <Img src={modelo.imagen} alt="Modelo" />
                    </Td>
                    {showEdit && (
                        <Td>
                            <IconButton onClick={() => handleEditModel(modelo)}>
                                <Edit />
                            </IconButton>
                        </Td>
                    )}
                    {showDelete && (
                        <Td>
                            <IconButton onClick={() => handleDeleteModel(modelo)}>
                                <Delete />
                            </IconButton>
                        </Td>
                    )}
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default TablaCatalogo;

