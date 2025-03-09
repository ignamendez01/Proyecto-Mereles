import { Table, Th, Td } from "../../../components/TableStyles";
import { PageContainer} from "../../../components/Styles";
import React, {useEffect, useState} from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ResumenPesaje = () => {
    const [pesajes, setPesajes] = useState([]);
    const [pesosTachos, setPesosTachos] = useState({});

    useEffect(() => {
        const fetchRemitos = () => {
            axios.get(`${API_URL}/pesajes`)
                .then(response => {
                    setPesajes(response.data);
                })
                .catch(error => console.error("Error al obtener remitos:", error));
        };

        fetchRemitos();
        const interval = setInterval(fetchRemitos, 1000);

        return () => clearInterval(interval);
    }, []);

    const getPesoOfTacho = (tachoId) => {
        if (pesosTachos[tachoId] !== undefined) {
            return pesosTachos[tachoId];
        }

        axios.get(`${API_URL}/tachos/${tachoId}`)
            .then(response => {
                setPesosTachos(prev => ({
                    ...prev,
                    [tachoId]: response.data.peso
                }));
            })
            .catch(error => console.error(`Error al obtener el peso del tacho ${tachoId}:`, error));

        return 0;
    };

    return (
        <PageContainer>
            <h2>Resumen de Pesaje</h2>
            {pesajes.length > 0 ? (
                <Table>
                    <thead>
                    <tr>
                        <Th>Remito n°</Th>
                        <Th>Peso Total (kg)</Th>
                        <Th>Estado</Th>
                    </tr>
                    </thead>
                    <tbody>
                    {pesajes.map((remito) => (
                        <tr key={remito.id}>
                            <Td>{remito.id}</Td>
                            <Td>{remito.pesoTotal + getPesoOfTacho(remito.tachoId)}</Td>
                            <Td>
                                {remito.egresado ? "Egresado" : remito.pesado ? "Pesado" : "Ingresó"}
                            </Td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : (
                <p>No hay remitos para mostrar.</p>
            )}
        </PageContainer>
    );
};

export default ResumenPesaje;

