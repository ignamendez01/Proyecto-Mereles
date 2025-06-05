import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavbarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #BFBFBF;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const Button = styled.button`
    border: black solid 1px;
    background: none;
    cursor: pointer;
    padding: 0 55px;
    height: 45px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background: lightgray;
    }
`;

const HomeDropdown = styled.div`
    margin-left: 1px;
    position: absolute;
    top: 48px;
    background: white;
    box-shadow: 10px 4px 6px rgba(0, 0, 0, 0.1);
    display: ${(props) => (props.show ? "block" : "none")};
    padding: 0;
`;

const DropdownButton = styled(Link)`
    display: block;
    width: 100%;
    padding: 8px 10px;
    border: black solid 1px;
    background: white;
    cursor: pointer;
    text-align: left;
    margin: 0;
    text-decoration: none;
    color: black;

    &:hover {
        background: lightgray;
    }
`;

const NotificationButton = styled.button`
    display: flex;
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 5vh;
    align-items: center;
    font-size: 30px;
    padding: 8px;
`;

const NotificationBadge = styled.span`
    background: red;
    color: white;
    font-size: 12px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
`;

const menuItems = [
    { name: "CARGA DE COLADA", path: "/carga-colada" },
    { name: "CONTROL REMITO VS PESAJE", path: "/control-remito" },
    { name: "FACTURACIÓN Y OTROS", path: "/home" },
    { name: "COBROS", path: "/home" },
    { name: "REPORTES", path: "/home" },
    { name: "ESTADISTICAS", path: "/estadisticas" },
    { name: "CONFIGURACIÓN", path: "/configuracion" },
];

const Navbar = () => {
    const notif = 17;
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    return (
        <NavbarContainer>
            <div>
                <Button onClick={() => setShowDropdown(!showDropdown)}>MENÚ</Button>
                <HomeDropdown ref={dropdownRef} show={showDropdown}>
                    {menuItems.map((item, index) => (
                        <DropdownButton key={index} to={item.path}>
                            {item.name}
                        </DropdownButton>
                    ))}
                </HomeDropdown>
            </div>

            <NotificationButton>
                <FaBell />
                {notif > 0 && <NotificationBadge>{notif}</NotificationBadge>}
            </NotificationButton>
        </NavbarContainer>
    );
};

export default Navbar;
