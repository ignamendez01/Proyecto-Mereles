import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, ButtonContainer, PageContainer} from '../../../components/Styles';
import TablaColada from "../Common/TablaColada";
import ColadaModal, {Img} from "../Common/ColadaModal";
import notImage from "../../../resources/No_Image_Available.jpg";

import axios from "axios";
import {useWebSocketTachos} from "../../../components/hooks/useWebSocketTachos";

const API_URL = process.env.REACT_APP_API_URL;

const AltaColada = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [coladas, setColadas] = useState([]);
    const [selectedColada, setSelectedColada] = useState(null);
    const [coladaId, setColadaId] = useState(1);

    const [tachos, setTachos] = useState([]);
    const [selectedTacho, setSelectedTacho] = useState(null);
    const [tachoId, setTachoId] = useState("");
    const [tachoPeso, setTachoPeso] = useState("");
    const imagenPorDefecto = notImage;
    const [imagen, setImagen] = useState(imagenPorDefecto);

    const [isGenerating, setIsGenerating] = useState(false);

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
            const tachoEncontrado = tachos.find(t => t.id === selectedTacho.id);
            if (tachoEncontrado) {
                setSelectedTacho(tachoEncontrado);
                setImagen(tachoEncontrado.imagen);
                setTachoId(tachoEncontrado.id);
                setTachoPeso(tachoEncontrado.peso)
            } else {
                setSelectedTacho(null);
                setImagen(imagenPorDefecto);
                setTachoId(null);
                setTachoPeso(null)
            }
        }
    }, [tachos])

    const handleSelectChange = (event) => {
        const tacho = tachos.find(t => t.id === parseInt(event.target.value));
        if (tacho && tacho.id) {
            setSelectedTacho(tacho);
            setImagen(tacho.imagen);
            setTachoId(tacho.id);
            setTachoPeso(tacho.peso)
        } else {
            setSelectedTacho(null);
            setImagen(imagenPorDefecto);
            setTachoId(null);
            setTachoPeso(null)
        }
    };

    const handleCreateColada = (newColada) => {
        setColadas([...coladas, newColada]);
        const newColadaId = coladaId + 1;
        setColadaId(newColadaId);
        setIsModalOpen(false);
    };

    const handleEditColada = (colada) => {
        setSelectedColada(colada);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedColada) => {
        const updatedColadas = coladas.map((colada) =>
            colada === selectedColada ? updatedColada : colada
        );

        setColadas(updatedColadas);
        setIsEditModalOpen(false);
        setSelectedColada(null);
    };

    const handleDeleteColada = (colada) => {
        setColadas((prevColadas) => {
            return prevColadas
                .filter((c) => c.coladaId !== colada.coladaId)
                .map((c) =>
                    c.coladaId > colada.coladaId
                        ? {...c, coladaId: c.coladaId - 1}
                        : c
                );
        });

        setColadaId((prevId) => prevId - 1);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        const pesoTotal = coladas.reduce((total, colada) => total + colada.pesoTotal, 0);
        const nuevoRemito = { coladas, pesoTotal, tachoId, tachoPeso };
        const token = localStorage.getItem("token");

        axios.post(`${API_URL}/remitos/generar`, nuevoRemito, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setColadaId(1);
                setColadas([]);
                setTachoId("");
                setTachoPeso("");
                setSelectedTacho(null);
                setImagen(imagenPorDefecto);
                setIsGenerating(false);
            })
            .catch(error => console.error("Error al crear remito:", error));
    };

    return (
        <PageContainer>
            <h2>Alta de Remitos</h2>
            <Button onClick={() => setIsModalOpen(true)} disabled={isGenerating}>
                Agregar Colada
            </Button>

            <ColadaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateColada}
                remitoData={null}
                localId={coladaId}
                title="Crear Colada"
            />

            <ColadaModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleSaveEdit}
                coladaData={selectedColada}
                title="Editar Colada"
            />

            {coladas.length > 0 && (
                <div>
                    <div className="input-container">
                        <label htmlFor="tacho-select">Tacho:</label>
                        <div style={{display: "flex", gap: "2vh", alignItems: "center"}}>
                            <select id="tacho-select" style={{fontSize: "16px"}} defaultValue=""
                                    onChange={handleSelectChange}>
                                <option value="">Selecciona un tacho</option>
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
                            <Img src={imagen} alt="Vista previa"/>
                        </div>
                    </div>

                    <TablaColada
                        coladas={coladas}
                        handleEditRemito={handleEditColada}
                        handleDeleteRemito={handleDeleteColada}
                    />
                </div>
            )
            }

            <ButtonContainer>
                <Button onClick={() => navigate("/home")} disabled={isGenerating}>
                    Volver
                </Button>
                <Button
                    onClick={handleGenerate}
                    disabled={coladas.length === 0 || !tachoId || isGenerating}>
                    {isGenerating ? "Generando..." : "Generar"}
                </Button>
            </ButtonContainer>

        </PageContainer>
    )
        ;
};

export default AltaColada;
