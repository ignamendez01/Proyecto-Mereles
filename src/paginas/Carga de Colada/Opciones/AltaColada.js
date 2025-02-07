import React, {useState} from "react";
import {useData} from "../../../context/DataContext";
import {useNavigate} from "react-router-dom";
import {Button, ButtonContainer, PageContainer} from '../../../components/Styles';
import TablaColada from "../Common/TablaColada";
import ColadaModal, {Img} from "../Common/ColadaModal";
import notImage from "../../../resources/No_Image_Available.jpg";

const AltaColada = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [coladas, setColadas] = useState([]);
    const [selectedColada, setSelectedColada] = useState(null);
    const [coladaId, setColadaId] = useState(1);

    const [selectedTacho, setSelectedTacho] = useState(null);
    const [tachoId, setTachoId] = useState("");

    const { state, dispatch } = useData();
    const tachos = state.tachos.filter((m) => m.isActive);
    const navigate = useNavigate();

    const imagenPorDefecto = notImage;
    const [imagen, setImagen] = useState(imagenPorDefecto);

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

    const handleGenerate = () => {
        const pesoTotal = coladas.reduce((total, colada) => total + colada.pesoTotal, 0);

        dispatch({
            type: "ADD_REMITOS",
            payload: { coladas, pesoTotal, tachoId },
        });

        setColadaId(1)
        setColadas([]);
    };

    const handleDeploy = () => {
        const pesoTotal = coladas.reduce((total, colada) => total + colada.pesoTotal, 0);

        dispatch({
            type: "ADD_PESAJE",
            payload: { coladas, pesoTotal, tachoId },
        });

        setColadaId(1)
        setColadas([]);
    };

    return (
        <PageContainer>
            <h2>Alta de Remitos</h2>
            <Button onClick={() => setIsModalOpen(true)}>Agregar Colada</Button>

            <ColadaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateColada}
                remitoData={null}
                id={coladaId}
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
                <Button onClick={() => navigate("/home")}>Volver</Button>
                <Button
                    onClick={handleGenerate}
                    disabled={coladas.length === 0 || !tachoId}>
                    Generar
                </Button>
                <Button
                    onClick={handleDeploy}
                    disabled={coladas.length === 0 || !tachoId}>
                    Enviar a producción
                </Button>
            </ButtonContainer>
        </PageContainer>
    )
        ;
};

export default AltaColada;
