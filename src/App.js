import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import LogIn from './paginas/LogIn/LogIn';
import Home from './paginas/Home';
import Configuracion from './paginas/Configuracion/Configuracion';
import Colada from "./paginas/Carga de Colada/Colada";
import Pesaje from "./paginas/Control remito vs pesaje/Pesaje";

function App() {
    return (
        <DataProvider>
            <Router basename="/Proyecto-Mereles">
                <Routes>
                    <Route path="/" element={<LogIn />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/configuracion" element={<Configuracion />} />
                    <Route path="/carga-colada" element={<Colada />} />
                    <Route path="/control-remito" element={<Pesaje />} />
                </Routes>
            </Router>
        </DataProvider>
    );
}

export default App;
