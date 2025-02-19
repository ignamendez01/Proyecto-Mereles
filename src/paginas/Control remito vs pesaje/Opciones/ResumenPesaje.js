//import { useData } from "../../../context/DataContext";
import { Table, Th, Td } from "../../../components/TableStyles";
import { PageContainer} from "../../../components/Styles";
import React, {useEffect, useState} from "react";
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/pesajes";

const ResumenPesaje = () => {
    //const { state } = useData();
    //const pesajes = state.pesajes
    const [pesajes, setPesajes] = useState([]);

    useEffect(() => {
        const fetchRemitos = () => {
            axios.get(`${API_URL}`)
                .then(response => {
                    setPesajes(response.data);
                })
                .catch(error => console.error("Error al obtener remitos:", error));
        };

        fetchRemitos();
        const interval = setInterval(fetchRemitos, 1000);

        return () => clearInterval(interval);
    }, []);

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
                            <Td>{remito.pesoTotal}</Td>
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

