import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "./CatalogStyles"
import notImage from "../resources/No_Image_Available.jpg"

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

const CatalogoModal = ({ isOpen, onClose, onSubmit, modelData, title }) => {
    const [numero, setNumero] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [peso, setPeso] = useState("");
    const [imagen, setImagen] = useState(null);

    const imagenPorDefecto = notImage;

    useEffect(() => {
        if (modelData) {
            setNumero(modelData.numero);
            setDescripcion(modelData.descripcion);
            setPeso(modelData.peso);
            setImagen(modelData.imagen || imagenPorDefecto);
        } else {
            resetForm();
        }
    }, [modelData]);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const nuevaImagen = URL.createObjectURL(e.target.files[0]);
            setImagen(nuevaImagen);
        }
    };

    const handleSubmit = () => {
        if (!numero || !descripcion || !peso || !imagen) return;
        const newModel = { numero, descripcion, peso, imagen };
        onSubmit(newModel);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setNumero("");
        setDescripcion("");
        setPeso("");
        setImagen(imagenPorDefecto);
    };

    const closeModal = () => {
        resetForm()
        onClose()
    };

    const isDisabled = !numero || !descripcion || !peso || !imagen;

    return (
        isOpen && (
            <ModalOverlay>
                <ModalContent>
                    <h2>{title}</h2>
                    <div className="input-container">
                        <label>ID:</label>
                        <Input
                            type="number"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Descripción:</label>
                        <Input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Peso:</label>
                        <Input
                            type="number"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Imagen:</label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <Img src={imagen} alt="Vista previa"/>

                    <Button onClick={handleSubmit} disabled={isDisabled}>Aceptar</Button>
                    <Button onClick={closeModal}>Cerrar</Button>
                </ModalContent>
            </ModalOverlay>
        )
    );
};

export default CatalogoModal;


