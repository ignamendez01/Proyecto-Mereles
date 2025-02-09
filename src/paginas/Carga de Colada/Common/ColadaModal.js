import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "../../../components/Styles"
import notImage from "../../../resources/No_Image_Available.jpg"
import { useData } from "../../../context/DataContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Img = styled.img`
    width: 85px;
    height: 85px;
`;

const ColadaModal = ({ isOpen, onClose, onSubmit, coladaData, id, title }) => {
    const [fecha, setFecha] = useState("");
    const [colada, setColada] = useState("");
    const [selectedModel, setSelectedModel] = useState(null);
    const [modelId, setModelId] = useState("");
    const [imagen, setImagen] = useState(null);
    const [cantidad, setCantidad] = useState("");
    const [peso, setPeso] = useState("");
    const [pesoTotal, setPesoTotal] = useState("");
    const [coladaId, setColadaId] = useState(id);

    const { state } = useData();
    const modelos = state.modelos.filter((m) => m.isActive);


    const imagenPorDefecto = notImage;

    useEffect(() => {
        if (coladaData) {
            setFecha(coladaData.fecha);
            setColada(coladaData.colada);
            setModelId(coladaData.modelId);
            setPesoTotal(coladaData.peso);
            setCantidad(coladaData.cantidad);
            setPeso(coladaData.peso);
            setImagen(coladaData.imagen || imagenPorDefecto);
            setColadaId(coladaData.coladaId)
            if (coladaData.modelId) {
                const foundModel = modelos.find(model => model.id === coladaData.modelId);
                setSelectedModel(foundModel || null);
            } else {
                setSelectedModel(null);
            }
        } else {
            resetForm();
        }
    }, [coladaData]);

    useEffect(() => {
        setColadaId(id);
    }, [id]);

    const handleSelectChange = (event) => {
        const model = modelos.find(m => m.id === parseInt(event.target.value));
        if (model && model.id) {
            setSelectedModel(model);
            setImagen(model.imagen);
            setModelId(model.id);
            setPeso(model.peso);
            if (cantidad) {
                setPesoTotal(model.peso * cantidad);
            }
        } else {
            setSelectedModel(null);
            setImagen(imagenPorDefecto);
            setModelId(null);
            setPeso(null);
            setPesoTotal(null);
        }
    };

    const handleCantidadChange = (e) => {
        setCantidad(e.target.value)
        if (peso){
            setPesoTotal(peso * e.target.value);
        }
        if (e.target.value === null || e.target.value === "") {
            setPesoTotal(null);
        }
    };

    const handleSubmit = () => {
        if (!fecha || !colada || !cantidad || !selectedModel || imagen === imagenPorDefecto) return;
        const newModel = { fecha, colada, modelId, imagen, cantidad, peso, pesoTotal, coladaId };
        onSubmit(newModel);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFecha("");
        setColada("");
        setModelId("");
        setCantidad("");
        setSelectedModel("");
        setPesoTotal("");
        setPeso("");
        setImagen(imagenPorDefecto);
    };

    const closeModal = () => {
        if(coladaData === null){
            resetForm()
        }
        onClose()
    };

    const isDisabled = !fecha || !colada || !cantidad || !selectedModel || imagen === imagenPorDefecto;

    return (
        isOpen && (
            <ModalOverlay>
                <ModalContent>
                    <h2>{title}</h2>
                    <div className="input-container">
                        <label>Fecha:</label>
                        <Input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Colada:</label>
                        <Input
                            type="number"
                            value={colada}
                            onChange={(e) => setColada(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Modelo:</label>
                        <select style={{fontSize: "16px"}} value={selectedModel?.id || ""}
                                onChange={handleSelectChange}>
                            <option value="">Selecciona un modelo</option>
                            {modelos.length > 0 ? (
                                modelos.map((modelo) => (
                                    <option key={modelo.id} value={modelo.id}>
                                        {modelo.id} - {modelo.descripcion}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No hay modelos disponibles</option>
                            )}
                        </select>
                    </div>
                    <div className="input-container">
                        <label>Imagen:</label>
                        <Img src={imagen} alt="Vista previa"/>
                    </div>
                    <div className="input-container">
                        <label>Cantidad:</label>
                        <Input
                            type="number"
                            value={cantidad}
                            onChange={handleCantidadChange}
                        />
                    </div>
                    <Button onClick={handleSubmit} disabled={isDisabled}>Aceptar</Button>
                    <Button onClick={closeModal}>Cerrar</Button>
                </ModalContent>
            </ModalOverlay>
        )
    );
};

export default ColadaModal;


