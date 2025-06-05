import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './paginas/LogIn/LogIn';
import Home from './paginas/Home';
import Configuracion from './paginas/Configuracion/Configuracion';
import Colada from "./paginas/Carga de Colada/Colada";
import Pesaje from "./paginas/Control remito vs pesaje/Pesaje";
import ProtectedRoute from "./components/ProtectedRoute";
import Estadistica from "./paginas/Estadística/Estadística";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
                <Route path="/carga-colada" element={<ProtectedRoute><Colada /></ProtectedRoute>} />
                <Route path="/control-remito" element={<ProtectedRoute><Pesaje /></ProtectedRoute>} />
                <Route path="/estadisticas" element={<ProtectedRoute><Estadistica /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
