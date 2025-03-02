import React from "react";
import { Table, Th, Td, Img } from "../../../components/TableStyles"

const Tabla = ({ object }) => {
    const data = Array.isArray(object) ? object : [object];

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
                        <Img src={modelo.imagen instanceof File ? URL.createObjectURL(modelo.imagen) : modelo.imagen} alt="Vista previa" />
                    </Td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default Tabla;

