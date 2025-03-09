import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import { Button } from "../../../components/Styles"
import notImage from "../../../resources/No_Image_Available.jpg"
import axios from "axios";

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
    const [selectedModel, setSelectedModel] = useState(null);
    const [modeloId, setModeloId] = useState("");
    const [imagen, setImagen] = useState(null);
    const [cantidad, setCantidad] = useState("");
    const [peso, setPeso] = useState("");
    const [pesoTotal, setPesoTotal] = useState("");
    const [coladaId, setColadaId] = useState(localId);
    const [id, setId] = useState(null);

    const [modelos, setModelos] = useState([]);

    const imagenPorDefecto = notImage;

    const prevModelosRef = useRef([]);

    useEffect(() => {
        const fetchModelosActivos = () => {
            axios.get(`${API_URL}/modelos/activos`)
                .then(response => {
                    const nuevosModelos = response.data;

                    if (JSON.stringify(prevModelosRef.current) !== JSON.stringify(nuevosModelos)) {
                        setModelos(nuevosModelos);
                        prevModelosRef.current = nuevosModelos;
                    }
                })
                .catch(error => console.error("Error al obtener modelos:", error));
        };

        fetchModelosActivos();
        const interval = setInterval(fetchModelosActivos, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (coladaData) {
            setFecha(coladaData.fecha);
            setColada(coladaData.colada);
            setModeloId(coladaData.modeloId);
            setPesoTotal(coladaData.pesoTotal);
            setCantidad(coladaData.cantidad);
            setPeso(coladaData.peso);
            setColadaId(coladaData.coladaId);
            setId(coladaData.id);
            if (modelos.length > 0) {
                const foundModel = modelos.find(model => model.id === coladaData.modeloId);
                if(foundModel){
                    setSelectedModel(foundModel);
                    setImagen(coladaData.imagen);
                }else{
                    setSelectedModel(null);
                    setImagen(imagenPorDefecto);
                }
            } else {
                setSelectedModel(null);
                setImagen(imagenPorDefecto);
            }
        } else {
            resetForm();
        }
    }, [coladaData, modelos]);



    useEffect(() => {
        setColadaId(localId);
    }, [localId]);

    const handleSelectChange = (event) => {
        const model = modelos.find(m => m.id === parseInt(event.target.value));
        if (model && model.id) {
            setSelectedModel(model);
            setImagen(model.imagen);
            setModeloId(model.id);
            setPeso(model.peso);
            if (cantidad) {
                setPesoTotal(model.peso * cantidad);
            }
        } else {
            setSelectedModel(null);
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
        if (!fecha || !colada || !cantidad || !selectedModel || imagen === imagenPorDefecto) return;
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


