import Navbar from "../../components/NavBar";
import {useEffect, useState} from "react";
import Catalogo from "./Catalogo/Catalogo"
import Tacho from "./Tacho/Tacho";
import Permiso from "./Permiso/Permiso";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";

const Configuracion = () => {
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
                return <Catalogo />;
            case "option2":
                return <Tacho />;
            case "option3":
                return <Permiso />;
            default:
                return null;
        }
    };

    return (
        <div style={{paddingTop: "8vh", paddingLeft: "1vh"}}>
            <Navbar/>
            <select style={{fontSize: "20px"}} onChange={(e) => setSelectedOption(e.target.value)} defaultValue="">
                <option value="" disabled>Configuracion</option>
                <option value="option1">CATALOGO DE PIEZAS</option>
                <option value="option2">PESO DE TACHO</option>
                <option value="option3">PERMISOS</option>
                <option value="option4">USUARIOS</option>
                <option value="option5">VALORES A COBRAR</option>
                <option value="option6">VALORES A PAGAR AL PERSONAL</option>
                <option value="option7">COSTOS ADICIONALES</option>
                <option value="option8">CARGA DE CHEQUES</option>
            </select>
            <div style={{paddingTop: "2vh"}}>
                {renderPage()}
            </div>
        </div>
    );
};

export default Configuracion;
