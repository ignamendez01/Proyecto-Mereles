import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import { Button } from "../../../components/Styles"
import notImage from "../../../resources/No_Image_Available.jpg"
import axios from "axios";
import {useWebSocketModelos} from "../../../components/hooks/useWebSocketModelos";

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

const API_URL = process.env.REACT_APP_API_URL;

const ColadaModal = ({ isOpen, onClose, onSubmit, coladaData, localId, title }) => {
    const [fecha, setFecha] = useState("");
    const [colada, setColada] = useState("");
    const [modeloId, setModeloId] = useState("");
    const [imagen, setImagen] = useState(null);
    const [cantidad, setCantidad] = useState("");
    const [peso, setPeso] = useState("");
    const [pesoTotal, setPesoTotal] = useState("");
    const [coladaId, setColadaId] = useState(localId);
    const [id, setId] = useState(null);

    const [modelos, setModelos] = useState([]);

    const imagenPorDefecto = notImage;

    const fetchModelosActivos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/modelos/activos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setModelos(response.data))
            .catch(error => console.error("Error al obtener modelos:", error));
    };

    useEffect(() => {
        fetchModelosActivos();
    }, []);

    useWebSocketModelos(fetchModelosActivos);

    useEffect(() => {
        if (coladaData) {
            setFecha(coladaData.fecha);
            setColada(coladaData.colada);
            setCantidad(coladaData.cantidad);
            setColadaId(coladaData.coladaId);
            setId(coladaData.id);
            setModeloId(coladaData.modeloId);
            setPeso(coladaData.peso);
            setPesoTotal(coladaData.pesoTotal);
            setImagen(coladaData.imagen || imagenPorDefecto);
        } else {
            resetForm();
        }
    }, [coladaData]);

    useEffect(() => {
        if (modeloId){
            const modelo = modelos.find((modelo) => modelo.id === modeloId);
            if (modelo){
                setPeso(modelo.peso);
                if (cantidad) {
                    setPesoTotal(modelo.peso * cantidad);
                }
                setImagen(modelo.imagen);
            }else if(coladaData){
                setModeloId(coladaData.modeloId);
                setPeso(coladaData.peso);
                setPesoTotal(coladaData.pesoTotal);
                setImagen(coladaData.imagen);
            }else{
                setModeloId("");
                setPeso("");
                setPesoTotal("");
                setImagen(imagenPorDefecto);
            }
        }else if(coladaData){
            setModeloId(coladaData.modeloId);
            setPeso(coladaData.peso);
            setPesoTotal(coladaData.pesoTotal);
            setImagen(coladaData.imagen);
        }else{
            setModeloId("");
            setPeso("");
            setPesoTotal("");
            setImagen(imagenPorDefecto);
        }
    }, [modelos]);

    useEffect(() => {
        setColadaId(localId);
    }, [localId]);

    const handleSelectChange = (event) => {
        const model = modelos.find(m => m.id === parseInt(event.target.value));
        if (model && model.id) {
            setImagen(model.imagen);
            setModeloId(model.id);
            setPeso(model.peso);
            if (cantidad) {
                setPesoTotal(model.peso * cantidad);
            }
        } else {
            setImagen(imagenPorDefecto);
            setModeloId(null);
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
        if (!fecha || !colada || !cantidad || !modeloId || imagen === imagenPorDefecto) return;
        let newModel;
        if (id){
            newModel = { fecha, colada, modeloId, imagen, cantidad, peso, pesoTotal, coladaId, id };
        }else{
            newModel = { fecha, colada, modeloId, imagen, cantidad, peso, pesoTotal, coladaId };
        }
        onSubmit(newModel);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFecha("");
        setColada("");
        setModeloId("");
        setCantidad("");
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

    const isDisabled = !fecha || !colada || !cantidad || !modeloId || imagen === imagenPorDefecto;

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
                        <select style={{fontSize: "16px"}} value={modeloId || ""}
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


