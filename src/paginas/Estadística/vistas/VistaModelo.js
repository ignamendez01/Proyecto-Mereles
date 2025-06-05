import React from "react";
import {Table, Th, Td, Img} from "../../../components/TableStyles";

const VistaModelo = ({ modelos, remitos }) => {
    const resumenPorModelo = modelos.map((modelo) => {
        let totalUnidades = 0;
        let totalKilos = 0;

        remitos.forEach((remito) => {
            remito.coladas?.forEach((colada) => {
                if (colada.modeloId === modelo.id) {
                    const unidades = colada.cantidad || 0;
                    const pesoUnitario = modelo.peso || 0;

                    totalUnidades += unidades;
                    totalKilos += unidades * pesoUnitario;
                }
            });
        });

        return {
            ...modelo,
            totalUnidades,
            totalKilos: totalKilos.toFixed(2)
        };
    });

    const modelosBaja = modelos.filter((m) => m.activo === false);

    return (
        <div>
            <h2>Kilos y unidades por modelo</h2>
            <Table>
                <thead>
                <tr>
                    <Th>ID</Th>
                    <Th>Descripción</Th>
                    <Th>Unidades</Th>
                    <Th>Total KG</Th>
                </tr>
                </thead>
                <tbody>
                {resumenPorModelo.map((m) => (
                    <tr key={m.id}>
                        <Td>{m.id}</Td>
                        <Td>{m.descripcion}</Td>
                        <Td>{m.totalUnidades}</Td>
                        <Td>{m.totalKilos}</Td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {modelosBaja.length > 0 && (
                <>
                    <h2>Modelos dados de baja</h2>
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
                        {modelosBaja.map((m) => (
                            <tr key={m.id}>
                                <Td>{m.id}</Td>
                                <Td>{m.descripcion}</Td>
                                <Td>{m.peso}</Td>
                                <Td>
                                    {m.imagen && (
                                        <Img src={m.imagen} alt="modelo" width={40} />
                                    )}
                                </Td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default VistaModelo;
