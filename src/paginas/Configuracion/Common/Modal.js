import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "../../../components/Styles"
import notImage from "../../../resources/No_Image_Available.jpg"

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

const Modal = ({ isOpen, onClose, onSubmit, data, title }) => {
    const [descripcion, setDescripcion] = useState("");
    const [peso, setPeso] = useState("");
    const [imagen, setImagen] = useState(null);

    const imagenPorDefecto = notImage;

    useEffect(() => {
        if (data) {
            setDescripcion(data.descripcion);
            setPeso(data.peso);
            setImagen(data.imagen || imagenPorDefecto);
        } else {
            resetForm();
        }
    }, [data]);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const nuevaImagen = URL.createObjectURL(e.target.files[0]);
            setImagen(nuevaImagen);
        }
    };

    const handleSubmit = () => {
        if (!descripcion || !peso || !imagen) return;
        const newModel = { descripcion, peso, imagen };
        onSubmit(newModel);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setDescripcion("");
        setPeso("");
        setImagen(imagenPorDefecto);
    };

    const closeModal = () => {
        if(data === null){
            resetForm()
        }
        onClose()
    };

    const isDisabled = !descripcion || !peso || imagen === imagenPorDefecto;

    return (
        isOpen && (
            <ModalOverlay>
                <ModalContent>
                    <h2>{title}</h2>
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

export default Modal;


