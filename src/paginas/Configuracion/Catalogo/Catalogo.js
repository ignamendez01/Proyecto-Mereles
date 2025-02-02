import {useState} from "react";
import AltaCatalogo from "./Opciones/AltaCatalogo";
import BajaCatalogo from "./Opciones/BajaCatalogo";
import ModificarCatalogo from "./Opciones/ModificarCatalogo";
import ResumenCatalogo from "./Opciones/ResumenCatalogo";

const Catalogo = () => {
    const [selectedOption, setSelectedOption] = useState(null);

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
