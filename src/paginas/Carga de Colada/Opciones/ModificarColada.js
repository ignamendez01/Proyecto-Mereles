import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
//import {useData} from "../../../context/DataContext";
import {ButtonContainer, PageContainer, Button} from "../../../components/Styles";
import TablaColada from "../Common/TablaColada";
import ColadaModal, {Img} from "../Common/ColadaModal";
import axios from "axios";

//const API_URL = "http://localhost:8080/remitos";
const API_URL = "https://backend-mereles.onrender.com/remitos";

const ModificarColada = () => {
    const navigate = useNavigate();
    //const { state, dispatch } = useData();

    //const remitos = state.remitos.filter(remito => remito.isActive);
    const [remitos, setRemitos] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [selectedColada, setSelectedColada] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTachoId, setSelectedTachoId] = useState("");
    const [localColadas, setLocalColadas] = useState([]);
    const [imagen, setImagen] = useState(null);

    const remitoIds = remitos.map(remito => remito.id);
    const [tachos, setTachos] = useState([]);
    //const tachos = state.tachos.filter(tacho => tacho.isActive);

    useEffect(() => {
        const fetchRemitosActivos = () => {
            axios.get(`${API_URL}/activos`)
                .then(response => {
                    setRemitos(response.data);
                })
                .catch(error => console.error("Error al obtener remitos:", error));
        };

        fetchRemitosActivos();
        const interval = setInterval(fetchRemitosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchTachosActivos = () => {
            axios.get("https://backend-mereles.onrender.com/tachos/activos")
                .then(response => {
                    setTachos(response.data);
                })
                .catch(error => console.error("Error al obtener tachos:", error));
        };

        fetchTachosActivos();
        const interval = setInterval(fetchTachosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSelect = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);

        if (!newId) {
            setSelectedTachoId("");
            setLocalColadas([]);
        } else {
            const remitoSeleccionado = remitos.find(remito => remito.id === parseInt(newId));
            const coladasConId = remitoSeleccionado.coladas.map((colada, index) => ({
                ...colada,
                coladaId: index+1,
            }));
            setLocalColadas(coladasConId);
            const tachoSeleccionado = tachos.find(tacho => tacho.id === parseInt(remitoSeleccionado.tachoId));
            setSelectedTachoId(tachoSeleccionado.id);
            setImagen(tachoSeleccionado.imagen);
        }
    };

    const handleSaveColada = (updatedColada) => {

        setLocalColadas(prevColadas => {
            const newColadas = prevColadas.map(colada =>
                colada.coladaId === selectedColada.coladaId
                    ? { ...updatedColada, coladaId: selectedColada.coladaId }
                    : colada
            );

            return [...newColadas];
        });

        setIsEditModalOpen(false);
    };

    const handleDeleteColada = (deletedColada) => {
        setLocalColadas(prevColadas => {
            return prevColadas
                .filter((c) => c.coladaId !== deletedColada.coladaId)
                .map((c) =>
                    c.coladaId > deletedColada.coladaId
                        ? {...c, coladaId: c.coladaId - 1}
                        : c
                );
        });
    };

    const handleUpdateRemito = () => {
        if (!selectedId) {
            console.error("No se ha seleccionado un remito para actualizar.");
            return;
        }

        const pesoTotal = localColadas.reduce((total, colada) => total + colada.pesoTotal, 0);

        const remitoUpdateDTO = {
            coladas: localColadas,
            pesoTotal: pesoTotal,
            tachoId: selectedTachoId
        };

        axios.put(`${API_URL}/${selectedId}/actualizar`, remitoUpdateDTO)
            .then(() => {
                setSelectedId("");
                setLocalColadas([]);
                setSelectedTachoId("");
            })
            .catch(error => console.error("Error al editar remito:", error));
    };


    /*const handleUpdateRemito = () => {
        const updatedRemito = {
            ...remitos.find(remito => remito.id === parseInt(selectedId)),
            tachoId: selectedTachoId,
            coladas: localColadas,
        };

        dispatch({ type: "UPDATE_REMITO", payload: updatedRemito });
        setSelectedId("");
        setLocalColadas([])
    };

     */

    function handleSelectTacho(e) {
        const tachoSeleccionado = tachos.find(tacho => tacho.id === parseInt(e.target.value));
        setSelectedTachoId(tachoSeleccionado.id);
        setImagen(tachoSeleccionado.imagen);
    }

    const handleEditColada = (colada) => {
        setSelectedColada(colada);
        setIsEditModalOpen(true);
    };

    return (
        <PageContainer>
            <h2>Editar Remitos</h2>

            <div className="input-container">
                <label htmlFor="remito-select">Seleccionar Remito:</label>
                <select style={{ fontSize: "16px" }} value={selectedId} onChange={handleSelect}>
                    <option value="">Seleccionar remito</option>
                    {remitoIds.length > 0 ? (
                        remitoIds.map((id) => (
                            <option key={id} value={id}>
                                Remito n°: {id}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay remitos disponibles</option>
                    )}
                </select>
            </div>

            {selectedId && (
                <div className="input-container">
                    <label htmlFor="tacho-select">Seleccionar Tacho:</label>
                    <div style={{ display: "flex", gap: "2vh", alignItems: "center" }}>
                        <select
                            style={{ fontSize: "16px" }}
                            value={selectedTachoId}
                            onChange={handleSelectTacho}
                        >
                            {tachos.map((tacho) => (
                                <option key={tacho.id} value={tacho.id}>
                                    Tacho n°: {tacho.id}
                                </option>
                            ))}
                        </select>
                        <Img src={imagen} alt="Vista previa"/>
                    </div>
                </div>
            )}

            {localColadas.length > 0 && (
                <div>
                    <TablaColada
                        coladas={localColadas}
                        handleEditRemito={handleEditColada}
                        handleDeleteRemito={handleDeleteColada}
                    />
                </div>
            )}

            {selectedColada && isEditModalOpen && (
                <ColadaModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleSaveColada}
                    coladaData={selectedColada}
                    title="Editar Colada"
                />
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
                <Button onClick={handleUpdateRemito} disabled={!selectedId}>Actualizar Remito</Button>
            </ButtonContainer>
        </PageContainer>
    );
};

export default ModificarColada;
