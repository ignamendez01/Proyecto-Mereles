import React from "react";
import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from "../../Common/Tabla";
import {useNavigate} from "react-router-dom";

const ResumenCatalogo = () => {
    const { state } = useData();
    const navigate = useNavigate();

    const modelosActivos = state.modelos.filter((modelo) => modelo.isActive);

    return (
        <PageContainer>
            <h2>Resumen del Catálogo</h2>

            {modelosActivos.length > 0 ? (
                <Tabla object={modelosActivos} />
            ) : (
                <p>No hay modelos activos para mostrar.</p>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default ResumenCatalogo;
