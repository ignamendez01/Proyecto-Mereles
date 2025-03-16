import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ButtonContainer, PageContainer, Button} from "../../../components/Styles";
import TablaRemito from "../Common/TablaRemito";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const BajaColada = () => {
    const navigate = useNavigate();

    const [remitos, setRemitos] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [selectedRemito, setSelectedRemito] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const prevRemitosRef = useRef([]);

    useEffect(() => {
        const fetchRemitosLocales = () => {
            axios.get(`${API_URL}/remitos/locales`)
                .then(response => {
                    const nuevosRemitos = response.data;

                    if (JSON.stringify(prevRemitosRef.current) !== JSON.stringify(nuevosRemitos)) {
                        setRemitos(response.data);
                        prevRemitosRef.current = nuevosRemitos;
                    }
                })
                .catch(error => console.error("Error al obtener remitos:", error));
        };

        fetchRemitosLocales();
        const interval = setInterval(fetchRemitosLocales, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedRemito) {
            const tachoEncontrado = remitos.find(m => m.id === selectedRemito.id);
            if (tachoEncontrado) {
                setSelectedRemito(tachoEncontrado);
                setSelectedId(tachoEncontrado.id);
            } else {
                setSelectedRemito(null);
                setSelectedId("");
            }
        }
    }, [remitos])

    const handleSelect = (e) => {
        const remito = remitos.find(r => r.id === parseInt(e.target.value));

        if (!remito) {
            setSelectedRemito(null);
            setSelectedId("");
        } else {
            setSelectedRemito(remito);
            setSelectedId(remito.id);
        }
    };

    const handleEliminar = () => {
        if (!selectedId) return;
        setIsLoading(true);

        axios.patch(`${API_URL}/remitos/${selectedId}/desactivar`)
            .then(() => {
                setSelectedId("");
                setSelectedRemito(null)
                setIsLoading(false)
            })
            .catch(error => console.error("Error al eliminar remito:", error));
    };

    return (
        <PageContainer>
            <h2>Baja de Remitos</h2>
            <div className="input-container">
                <label htmlFor="remito-select">Seleccionar Remito:</label>
                <select id="remito-select" style={{ fontSize: "16px" }} defaultValue="" onChange={handleSelect}>
                    <option value="">Seleccionar remito</option>
                    {remitos.length > 0 ? (
                        remitos.map((remito) => (
                            <option key={remito.id} value={remito.id}>
                                Remito n°: {remito.id}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay remitos disponibles</option>
                    )}
                </select>
            </div>

            {selectedRemito && (
                <div key={selectedRemito.id}>
                    <TablaRemito remito={selectedRemito}/>
                </div>
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isLoading}>
                    Volver
                </Button>
                <Button onClick={handleEliminar} disabled={!selectedId || isLoading}>
                    {isLoading ? "Eliminando..." : "Eliminar"}
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default BajaColada
