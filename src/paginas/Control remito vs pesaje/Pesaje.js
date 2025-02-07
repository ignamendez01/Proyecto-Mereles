import {useState} from "react";
import Ingreso from "./Opciones/Ingreso";
import Egreso from "./Opciones/Egreso";
import ResumenPesaje from "./Opciones/ResumenPesaje";
import Navbar from "../../components/NavBar";

const Pesaje = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const renderPage = () => {
        switch (selectedOption) {
            case "option1":
                return <Ingreso />;
            case "option2":
                return <Egreso />;
            case "option3":
                return <ResumenPesaje />;
            default:
                return null;
        }
    };

    return (
        <div style={{paddingTop: "8vh", paddingLeft: "1vh"}}>
            <Navbar/>
            <select style={{fontSize: "20px"}} onChange={(e) => setSelectedOption(e.target.value)} defaultValue="">
                <option value="" disabled>REMITO VS. PESAJE</option>
                <option value="option1">INGRESO</option>
                <option value="option2">EGRESO</option>
                <option value="option3">RESUMEN</option>
            </select>
            <div>
                {renderPage()}
            </div>
        </div>
    )
        ;
};

export default Pesaje
