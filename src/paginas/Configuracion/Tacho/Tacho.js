import {useEffect, useState} from "react";
import AltaTacho from "./Opciones/AltaTacho";
import BajaTacho from "./Opciones/BajaTacho";
import ModificarTacho from "./Opciones/ModificarTacho";
import ResumenTacho from "./Opciones/ResumenTacho";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";

const Tacho = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const permiso = decoded.permiso;
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (permiso !== "ADMIN" && permiso !== "FABRICA_A") {
            navigate("/home");
        }
    }, [permiso, navigate]);

    const renderPage = () => {
        switch (selectedOption) {
            case "option1":
                return <AltaTacho />;
            case "option2":
                return <BajaTacho />;
            case "option3":
                return <ModificarTacho />;
            case "option4":
                return <ResumenTacho />;
            default:
                return null;
        }
    };

    return (
        <div>
            <select style={{fontSize: "20px"}} onChange={(e) => setSelectedOption(e.target.value)} defaultValue="">
                <option value="" disabled>Tacho</option>
                <option value="option1">ALTA</option>
                <option value="option2">BAJA</option>
                <option value="option3">MODIFICAR</option>
                <option value="option4">RESUMEN</option>
            </select>
            <div>
                {renderPage()}
            </div>
        </div>
    );
};

export default Tacho;
