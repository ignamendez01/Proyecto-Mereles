import React from "react";
import {Table, Td, Th} from "../../../components/TableStyles";

const VistaUsuarios = ({ usuarios }) => {
    const usuariosPorPermiso = (permiso) =>
        usuarios.filter((u) => u.permiso === permiso);

    return (
        <div>
            {usuariosPorPermiso("ADMIN").length > 0 && (
                <>
                    <h2>Usuarios ADMIN</h2>
                    <Table>
                        <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuariosPorPermiso("ADMIN").map((u) => (
                            <tr key={u.id}>
                                <Td>{u.id}</Td>
                                <Td>{u.nombre}</Td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}

            {usuariosPorPermiso("FABRICA_A").length > 0 && (
                <>
                    <h2>Usuarios FABRICA A</h2>
                    <Table>
                        <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuariosPorPermiso("FABRICA_A").map((u) => (
                            <tr key={u.id}>
                                <Td>{u.id}</Td>
                                <Td>{u.nombre}</Td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}

            {usuariosPorPermiso("FABRICA_B").length > 0 && (
                <>
                    <h2>Usuarios FABRICA B</h2>
                    <Table>
                        <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuariosPorPermiso("FABRICA_B").map((u) => (
                            <tr key={u.id}>
                                <Td>{u.id}</Td>
                                <Td>{u.nombre}</Td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default VistaUsuarios;
