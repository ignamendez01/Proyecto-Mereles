import { useData } from "../../../context/DataContext";
import { Table, Th, Td } from "../../../components/TableStyles";
import { PageContainer} from "../../../components/Styles";
import React from "react";

const ResumenPesaje = () => {
    const { state } = useData();

    return (
        <PageContainer>
            <h2>Resumen de Pesaje</h2>
            <Table>
                <thead>
                <tr>
                    <Th>Remito n°</Th>
                    <Th>Peso Total (kg)</Th>
                    <Th>Estado</Th>
                </tr>
                </thead>
                <tbody>
                {state.pesajes.map((remito) => (
                    <tr key={remito.id}>
                        <Td>{remito.id}</Td>
                        <Td>{remito.pesoTotal}</Td>
                        <Td>
                            {remito.isDeployed ? "Egresado" : remito.isPesado ? "Pesado" : "Ingresó"}
                        </Td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </PageContainer>
    );
};

export default ResumenPesaje;

