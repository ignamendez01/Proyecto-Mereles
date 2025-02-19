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

const TablaCrear = ({ object,
                           handleEdit,
                           handleDelete }) => {
    const data = Array.isArray(object) ? object : [object];

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
            {data.map((object, index) => (
                <tr key={index}>
                    <Td>{object.descripcion}</Td>
                    <Td>{object.peso}</Td>
                    <Td>
                        {/*<Img src={object.imagen} alt="Vista previa"/>*/}
                        <Img src={object.imagen instanceof File ? URL.createObjectURL(object.imagen) : object.imagen} alt="Vista previa" />
                    </Td>
                    <Td>
                        <IconButton onClick={() => handleEdit(object)}>
                            <Edit />
                        </IconButton>
                    </Td>
                    <Td>
                        <IconButton onClick={() => handleDelete(object)}>
                            <Delete />
                        </IconButton>
                    </Td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default TablaCrear;
