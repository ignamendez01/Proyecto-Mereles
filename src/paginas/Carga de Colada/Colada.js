import {useState} from "react";
import AltaColada from "./Opciones/AltaColada";
import BajaColada from "./Opciones/BajaColada";
import ModificarColada from "./Opciones/ModificarColada";
import ResumenColada from "./Opciones/ResumenColada";
import Navbar from "../../components/NavBar";

const Colada = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const renderPage = () => {
        switch (selectedOption) {
            case "option1":
                return <AltaColada />;
            case "option2":
                return <BajaColada />;
            case "option3":
                return <ModificarColada />;
            case "option4":
                return <ResumenColada />;
            default:
                return null;
        }
    };

    return (
        <div style={{paddingTop: "8vh", paddingLeft: "1vh"}}>
            <Navbar/>
            <select style={{fontSize: "20px"}} onChange={(e) => setSelectedOption(e.target.value)} defaultValue="">
                <option value="" disabled>CARGA DE COLADA</option>
                <option value="option1">ALTA</option>
                <option value="option2">BAJA</option>
                <option value="option3">MODIFICAR</option>
                <option value="option4">RESUMEN</option>
            </select>
            <div>
                {renderPage()}
            </div>
        </div>
    )
        ;
};

export default Colada
