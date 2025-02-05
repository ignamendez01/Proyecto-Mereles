import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import LogIn from './paginas/LogIn/LogIn';
import Home from './paginas/Home';
import Configuracion from './paginas/Configuracion/Configuracion';
import Colada from "./paginas/Carga de Colada/Colada";

function App() {
    return (
        <DataProvider>
            <Router basename="/Proyecto-Mereles">
                <Routes>
                    <Route path="/" element={<LogIn />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/configuracion" element={<Configuracion />} />
                    <Route path="/carga-colada" element={<Colada />} />
                </Routes>
            </Router>
        </DataProvider>
    );
}

export default App;
