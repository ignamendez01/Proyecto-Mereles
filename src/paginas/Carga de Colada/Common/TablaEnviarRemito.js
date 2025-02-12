import React from "react";
import styled from "styled-components";
import { Table, Th, Td, Img } from "../../../components/TableStyles"
import {Button} from "../../../components/Styles";

export const TdFooter = styled(Td)`
    border: none;
`;

export const TdFooterTotal = styled(Td)`
    border: 1px solid black;
    font-weight: bold;
    background-color: #f8f8f8;
`;

const TablaEnviarRemito = ({ remito, handleEnviarRemito }) => {

    if (!remito || !remito.coladas || remito.coladas.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }

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
                <Th>Enviar</Th>
            </tr>
            </thead>
            <tbody>
            {remito.coladas.map((colada, index) => (
                <tr key={colada.colada}>
                    <Td>{remito.id}</Td>
                    <Td>{colada.modelId}</Td>
                    <Td>
                        <Img src={colada.imagen} alt="Modelo" />
                    </Td>
                    <Td>{colada.cantidad}</Td>
                    <Td>{colada.peso}</Td>
                    <Td>{colada.pesoTotal}</Td>
                    <Td>{colada.colada}</Td>
                    <Td>{colada.fecha}</Td>
                    {index === 0 ? (
                        <Td rowSpan={remito.coladas.length}>
                            <Button
                                onClick={() => handleEnviarRemito(remito)}
                                disabled={remito.enviado}>
                                Enviar
                            </Button>
                        </Td>
                    ) : null}
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <TdFooter colSpan={4}></TdFooter>
                <TdFooter>Total Remito</TdFooter>
                <TdFooterTotal>{remito.pesoTotal}</TdFooterTotal>
                <TdFooter>kg</TdFooter>
                <TdFooter colSpan={2}></TdFooter>
            </tr>
            </tfoot>
        </Table>
    );
};


export default TablaEnviarRemito;
