import { Table, Th, Td } from "../../../components/TableStyles";
import {Button, ButtonContainer, PageContainer} from "../../../components/Styles";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useWebSocketPesajes} from "../../../components/hooks/useWebSocketPesajes";

const API_URL = process.env.REACT_APP_API_URL;

const ResumenPesaje = () => {
    const navigate = useNavigate();

    const [pesajes, setPesajes] = useState([]);

    const fetchRemitos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/pesajes`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setPesajes(response.data))
            .catch(error => console.error("Error al obtener remitos:", error));
    };

    useEffect(() => {
        fetchRemitos();
    }, []);

    useWebSocketPesajes(fetchRemitos);

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
                            <Td>{remito.pesoTotal + remito.tachoPeso}</Td>
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
            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>
                    Volver
                </Button>
            </ButtonContainer>
        </PageContainer>
);
};

export default ResumenPesaje;

