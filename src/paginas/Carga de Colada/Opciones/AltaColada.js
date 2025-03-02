import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, ButtonContainer, PageContainer} from '../../../components/Styles';
import TablaColada from "../Common/TablaColada";
import ColadaModal, {Img} from "../Common/ColadaModal";
import notImage from "../../../resources/No_Image_Available.jpg";
import axios from "axios";

const API_URL = "https://backend-mereles.onrender.com/remitos";

const AltaColada = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [coladas, setColadas] = useState([]);
    const [selectedColada, setSelectedColada] = useState(null);
    const [coladaId, setColadaId] = useState(1);

    const [selectedTacho, setSelectedTacho] = useState(null);
    const [tachoId, setTachoId] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [tachos, setTachos] = useState([]);
    const navigate = useNavigate();

    const imagenPorDefecto = notImage;
    const [imagen, setImagen] = useState(imagenPorDefecto);
    const prevTachosRef = useRef([]);

    useEffect(() => {
        const fetchTachosActivos = () => {
            axios.get("https://backend-mereles.onrender.com/tachos/activos")
                .then(response => {
                    const nuevosTachos = response.data;

                    if (JSON.stringify(prevTachosRef.current) !== JSON.stringify(nuevosTachos)) {
                        setTachos(response.data);
                        prevTachosRef.current = nuevosTachos;
                    }
                })
                .catch(error => console.error("Error al obtener tachos:", error));
        };

        fetchTachosActivos();
        const interval = setInterval(fetchTachosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

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

    const handleSelectChange = (event) => {
        const tacho = tachos.find(t => t.id === parseInt(event.target.value));
        if (tacho && tacho.id) {
            setSelectedTacho(tacho);
            setImagen(tacho.imagen);
            setTachoId(tacho.id);
        } else {
            setSelectedTacho(null);
            setImagen(imagenPorDefecto);
            setTachoId(null);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true)
        const pesoTotal = coladas.reduce((total, colada) => total + colada.pesoTotal, 0);
        const nuevoRemito = { coladas, pesoTotal, tachoId};

        axios.post(`${API_URL}/generar`, nuevoRemito)
            .then(() => {
                setColadaId(1);
                setColadas([]);
                setTachoId("")
                setSelectedTacho(null)
                setImagen(imagenPorDefecto)
                setIsGenerating(false)
            })
            .catch(error => console.error("Error al crear remito:", error));
    };

    const handleDeploy = () => {
        setIsSending(true)
        const pesoTotal = coladas.reduce((total, colada) => total + colada.pesoTotal, 0);
        const nuevoRemito = { coladas, pesoTotal, tachoId };
        const remitoAPesar = { coladas, pesoTotal, tachoId };

        axios.post(`${API_URL}/enviar`, nuevoRemito)
            .then(() => {
                axios.post("https://backend-mereles.onrender.com/pesajes/crear", remitoAPesar )
                    .then(() => {
                        setColadaId(1);
                        setColadas([]);
                        setTachoId("")
                        setSelectedTacho(null)
                        setImagen(imagenPorDefecto)
                        setIsSending(false)
                    })
                    .catch(error => {
                        console.error("Error al enviar remito a pesar:", error);
                    });
            })
            .catch(error => {
                console.error("Error al enviar remito:", error);
            });
    };

    return (
        <PageContainer>
            <h2>Alta de Remitos</h2>
            <Button onClick={() => setIsModalOpen(true)} disabled={isSending || isGenerating}>
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
                        <label>Tacho:</label>
                        <div style={{display: "flex", gap: "2vh", alignItems: "center"}}>
                            <select style={{fontSize: "16px"}} value={selectedTacho?.id || ""}
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
                <Button onClick={() => navigate("/home")} disabled={isSending || isGenerating}>
                    Volver
                </Button>
                <Button
                    onClick={handleGenerate}
                    disabled={coladas.length === 0 || !tachoId || isSending || isGenerating}>
                    {isGenerating ? "Generando..." : "Generar"}
                </Button>
                <Button
                    onClick={handleDeploy}
                    disabled={coladas.length === 0 || !tachoId || isSending || isGenerating}>
                    {isSending ? "Enviando..." : "Enviar a producción"}
                </Button>
            </ButtonContainer>
        </PageContainer>
    )
        ;
};

export default AltaColada;
