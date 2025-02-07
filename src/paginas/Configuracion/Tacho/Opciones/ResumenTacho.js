import React from "react";
import { useData } from "../../../../context/DataContext";
import {PageContainer, ButtonContainer, Button} from '../../../../components/Styles';
import Tabla from "../../Common/Tabla";
import {useNavigate} from "react-router-dom";

const ResumenTacho = () => {
    const { state } = useData();
    const navigate = useNavigate();

    const tachosActivos = state.tachos.filter((tacho) => tacho.isActive);

    return (
        <PageContainer>
            <h2>Resumen de Tachos</h2>

            {tachosActivos.length > 0 ? (
                <Tabla object={tachosActivos} />
            ) : (
                <p>No hay tachos activos para mostrar.</p>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/home")}>Volver</Button>
            </ButtonContainer>

        </PageContainer>
    );
};

export default ResumenTacho;
