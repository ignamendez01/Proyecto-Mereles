import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./paginas/LogIn/LogIn";
import Home from "./paginas/Home";
import Configuracion from "./paginas/Configuracion/Configuracion";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/home" element={<Home />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </Router>
      </DataProvider>
  );
}

export default App;
