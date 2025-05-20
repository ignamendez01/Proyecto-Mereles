import {useEffect, useState} from "react";
import AltaCatalogo from "./Opciones/AltaCatalogo";
import BajaCatalogo from "./Opciones/BajaCatalogo";
import ModificarCatalogo from "./Opciones/ModificarCatalogo";
import ResumenCatalogo from "./Opciones/ResumenCatalogo";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";

const Catalogo = () => {
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
                return <AltaCatalogo />;
            case "option2":
                return <BajaCatalogo />;
            case "option3":
                return <ModificarCatalogo />;
            case "option4":
                return <ResumenCatalogo />;
            default:
                return null;
        }
    };

    return (
        <div>
            <select style={{fontSize: "20px"}} onChange={(e) => setSelectedOption(e.target.value)} defaultValue="">
                <option value="" disabled>Catalogo</option>
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

export default Catalogo;
