import React from "react";
import {Table, Th, Td, Img} from "../../../components/TableStyles";

const VistaTacho = ({ tachos, remitos }) => {
    const tachosEliminados = tachos.filter((t) => t.activo === false);

    const contarRemitosPorTacho = (tachoId) => {
        return remitos.filter(remito => remito.tachoId === tachoId).length;
    };

    return (
        <div>
            <h2>Uso de Tachos</h2>
            <Table>
                <thead>
                <tr>
                    <Th>ID</Th>
                    <Th>Descripción</Th>
                    <Th>Veces Usado</Th>
                </tr>
                </thead>
                <tbody>
                {tachos.map(tacho => (
                    <tr key={tacho.id}>
                        <Td>{tacho.id}</Td>
                        <Td>{tacho.descripcion}</Td>
                        <Td>{contarRemitosPorTacho(tacho.id)}</Td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {tachosEliminados.length > 0 && (
                <>
                    <h2 style={{ marginTop: "40px" }}>Tachos dados de baja</h2>
                    <Table>
                        <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Descripción</Th>
                            <Th>Peso</Th>
                            <Th>Imagen</Th>
                        </tr>
                        </thead>
                        <tbody>
                        {tachosEliminados.map(tacho => (
                            <tr key={tacho.id}>
                                <Td>{tacho.id}</Td>
                                <Td>{tacho.descripcion}</Td>
                                <Td>{tacho.peso}</Td>
                                <Td>{tacho.imagen && <Img src={tacho.imagen} alt="tacho" />}</Td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default VistaTacho;
