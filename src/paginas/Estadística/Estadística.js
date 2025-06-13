import {useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Button, ButtonContainer, PageContainer} from "../../components/Styles";
import Navbar from "../../components/NavBar";
import {jwtDecode} from "jwt-decode";
import VistaUsuarios from "./vistas/VistaUsuario";
import VistaModelo from "./vistas/VistaModelo";
import VistaTacho from "./vistas/VistaTacho";
import VistaRemito from "./vistas/VistaRemito";
import {useWebSocketModelos} from "../../components/hooks/useWebSocketModelos";
import {useWebSocketTachos} from "../../components/hooks/useWebSocketTachos";
import {useWebSocketRemitos} from "../../components/hooks/useWebSocketRemitos";
import {useWebSocketUsuarios} from "../../components/hooks/useWebSocketUsuarios";

const API_URL = process.env.REACT_APP_API_URL;

const card = {
    display: "inline-block",
    background: "#fff",
    padding: "20px",
    marginRight: "15px",
    borderRadius: "8px",
    minWidth: "150px",
    borderBlockColor: "black",
    border: "1px solid black",
    textAlign: "center",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)"
}

const Estadistica = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [tachos, setTachos] = useState([]);
    const [remitos, setRemitos] = useState([]);
    const [vista, setVista] = useState("");

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const permiso = decoded.permiso;

    useEffect(() => {
        if (permiso !== "ADMIN") {
            navigate("/home");
        }
    }, [permiso, navigate]);

    const fetchUsuarios = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    useWebSocketUsuarios(fetchUsuarios);

    const fetchModelos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/modelos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setModelos(response.data))
            .catch(error => console.error("Error al obtener modelos:", error));
    };

    useEffect(() => {
        fetchModelos();
    }, []);

    useWebSocketModelos(fetchModelos);

    const fetchTachos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/tachos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setTachos(response.data))
            .catch(error => console.error("Error al obtener tachos:", error));
    };

    useEffect(() => {
        fetchTachos();
    }, []);

    useWebSocketTachos(fetchTachos);

    const fetchRemitos = () => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/remitos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setRemitos(response.data))
            .catch(error => console.error("Error al obtener remitos:", error));
    };

    useEffect(() => {
        fetchRemitos();
    }, []);

    useWebSocketRemitos(fetchRemitos);

    const calcularTotalKg = (remitos) => {
        let total = 0;
        remitos.forEach(remito => {
            total += remito.pesoTotal || 0;
        });
        return total.toFixed(3);
    };

    const contarColadas = (remitos) => {
        let total = 0;
        remitos.forEach(remito => {
            total += remito.coladas?.length || 0;
        });
        return total;
    };

    return (
        <PageContainer style={{paddingTop: "9vh"}}>
            <Navbar/>
            <div style={{marginBottom: "30px"}}>
                <div style={card}><h3>Usuarios</h3><p>{usuarios.length}</p></div>
                <div style={card}><h3>Modelos</h3><p>{modelos.length}</p></div>
                <div style={card}><h3>Tachos</h3><p>{tachos.length}</p></div>
                <div style={card}><h3>Remitos</h3><p>{remitos.length}</p></div>
                <div style={card}><h3>Total KG</h3><p>{calcularTotalKg(remitos)} kg</p></div>
                <div style={card}><h3>Coladas Creadas</h3><p>{contarColadas(remitos)}</p></div>
            </div>

            <div className="selector">
                <label><input type="radio" name="vista" value="usuario" onChange={() => setVista("usuario")}
                              checked={vista === "usuario"}/> Usuario</label>
                <label><input type="radio" name="vista" value="modelo" onChange={() => setVista("modelo")}
                              checked={vista === "modelo"}/> Modelo</label>
                <label><input type="radio" name="vista" value="tacho" onChange={() => setVista("tacho")}
                              checked={vista === "tacho"}/> Tacho</label>
                <label><input type="radio" name="vista" value="remito" onChange={() => setVista("remito")}
                              checked={vista === "remito"}/> Remito</label>
            </div>

            {vista === "usuario" && (
                <VistaUsuarios usuarios={usuarios}/>
            )}

            {vista === "modelo" && (
                <VistaModelo modelos={modelos} remitos={remitos} />
            )}

            {vista === "tacho" && (
                <VistaTacho tachos={tachos} remitos={remitos} />
            )}

            {vista === "remito" && (
                <VistaRemito remitos={remitos} />
            )}


            <ButtonContainer>
                <Button
                    onClick={() => navigate("/home")}
                >
                    Volver
                </Button>
            </ButtonContainer>
        </PageContainer>
    );
}

export default Estadistica;
