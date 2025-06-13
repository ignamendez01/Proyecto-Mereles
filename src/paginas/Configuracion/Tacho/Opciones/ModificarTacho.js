import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from '../../Common/Tabla';
import Modal from "../../Common/Modal";
import axios from "axios";
import {useWebSocketTachos} from "../../../../components/hooks/useWebSocketTachos";

const API_URL = process.env.REACT_APP_API_URL;

const ModificarTacho = () => {
    const [tachos, setTachos] = useState([]);
    const [selectedTacho, setSelectedTacho] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchTachosActivos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/tachos/activos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setTachos(response.data))
            .catch(error => console.error("Error al obtener tachos:", error));
    };

    useEffect(() => {
        fetchTachosActivos();
    }, []);

    useWebSocketTachos(fetchTachosActivos);

    useEffect(() => {
        if (selectedTacho) {
            const tachoEncontrado = tachos.find(m => m.id === selectedTacho.id);
            if (tachoEncontrado) {
                setSelectedTacho(tachoEncontrado);
            } else {
                setSelectedTacho(null);
            }
        }
    }, [tachos])

    const handleSelectChange = (event) => {
        const tacho = tachos.find(m => m.id === parseInt(event.target.value));
        if (tacho && tacho.id) {
            setSelectedTacho(tacho);
        } else {
            setSelectedTacho(null);
        }
    };

    const handleEditClick = () => {
        if (selectedTacho) {
            setIsModalOpen(true);
        }
    };

    const handleSubmitEdit = (tachoData) => {
        const updatedTachoData = { ...tachoData, id: selectedTacho.id };
        setIsModalOpen(false);
        setIsLoading(true);
        const token = localStorage.getItem("token");

        try {
            const formData = new FormData();
            formData.append("descripcion", updatedTachoData.descripcion);
            formData.append("peso", updatedTachoData.peso);

            if (updatedTachoData.imagen instanceof File) {
                formData.append("imagen", updatedTachoData.imagen);
            }

            axios.put(`${API_URL}/tachos/${selectedTacho.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    setSelectedTacho(updatedTachoData);
                    setIsLoading(false);
                    fetchTachosActivos();
                })
                .catch((error) => {
                    console.error("Error al actualizar el tacho:", error);
                });

        } catch (error) {
            console.error("Error al actualizar el tacho:", error);
        }
    };

    return (
        <PageContainer>
            <h2>Modificación de Tachos</h2>
            <div className="input-container">
                <label htmlFor="tacho-select">Seleccionar Tacho:</label>
                <select
                    id="tacho-select"
                    style={{ fontSize: "16px" }}
                    onChange={handleSelectChange}
                    value={selectedTacho ? selectedTacho.id : ""}
                >
                    <option value="">Seleccione un tacho</option>
                    {tachos.length > 0 ? (
                        tachos.map((tacho) => (
                            <option key={tacho.id} value={tacho.id}>
                                {tacho.id} - {tacho.descripcion}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay tachos disponibles</option>
                    )}
                </select>
            </div>

            {selectedTacho && (
                <Tabla object={selectedTacho} />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isLoading}>Volver</Button>
                {selectedTacho && (
                    <Button onClick={handleEditClick} disabled={isLoading}>
                        {isLoading ? "Modificando..." : "Modificar"}
                    </Button>
                )}
            </ButtonContainer>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitEdit}
                data={selectedTacho}
                title="Editar Tacho"
            />
        </PageContainer>
    );
};

export default ModificarTacho;
