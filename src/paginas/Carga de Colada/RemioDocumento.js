import React from 'react';
import warning from "../../images/Warning.jpg"

const RemitoDocumento = ({ datos }) => {
    return (
        <div style={{padding: "40px", fontFamily: "Arial", fontSize: "12px"}}>
            {/* Encabezado */}
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
                {/* Logo con borde */}
                <div style={{
                    width: "40%",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100px"
                }}>
                    <img src={warning} alt="Logo" height="60"/>
                </div>

                {/* Advertencia */}
                <div style={{
                    width: "20%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <img src={warning} alt="Advertencia" height="50" />
                </div>

                {/* Título y datos */}
                <div style={{
                    width: "35%",
                    border: "1px solid black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    <div style={{
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "5px"
                    }}>
                        Movimiento de Mercadería
                    </div>
                    <div style={{fontSize: "16px", fontWeight: "bold", textAlign: "center", margin: "8px 0"}}>
                        Nº: {datos.numero}
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", padding: "0 10px 10px"}}>
                        <div style={{fontSize: "12px", textAlign: "left"}}>
                            CUIT: 30-12345678-9<br/>
                            F. Fundación: 12/08/2000
                        </div>
                        <table border="1" cellPadding="3" style={{fontSize: "12px", textAlign: "center"}}>
                            <thead>
                            <tr>
                                <th colSpan={3}>Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {(() => {
                                    const [day, month, year] = datos.fecha.split('/');
                                    return (
                                        <>
                                            <td>{day}</td>
                                            <td>{month}</td>
                                            <td>{year}</td>
                                        </>
                                    );
                                })()}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* Cliente y proveedor */}
            <div style={{border: "1px solid black", padding: "10px", marginBottom: "10px", fontSize: "13px"}}>
                <div><strong>CLIENTE y/o PROVEEDOR:</strong> &nbsp;{datos.cliente}</div>
                <div><strong>DOMICILIO:</strong> &nbsp;{datos.domicilio}</div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                        <strong>IVA:</strong>&nbsp;
                        {[
                            "Responsable Inscripto",
                            "Responsable No Inscripto",
                            "No Responsable",
                            "Monotributista",
                            "Exento",
                            "Consumidor Final",
                            "SNC"
                        ].map((cond, i) => (
                            <span key={i} style={{marginRight: "12px"}}>
                                {cond} [{datos.iva === cond ? "x" : " "}]
                            </span>
                        ))}
                    </div>
                    <div>
                        <strong>C.U.I.T :</strong> &nbsp;{datos.cuit}
                    </div>
                </div>
            </div>


            {/* Transportista */}
            <div style={{border: "1px solid black", padding: "10px", marginBottom: "10px", fontSize: "13px"}}>
                <div style={{display: "flex", alignItems: "flex-start"}}>
                    <div style={{flex: 1, fontWeight: "bold", fontSize: "16px"}}>
                        Datos del Transportista
                    </div>
                    <div style={{flex: 2, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <div>
                            <strong>Nombre o Razón Social:</strong> &nbsp;{datos.transportistaNombre}
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>
                                <strong>Domicilio:</strong> &nbsp;{datos.transportistaDomicilio}
                            </div>
                            <div>
                                <strong>C.U.I.L :</strong> &nbsp;{datos.cuil}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Línea intermedia */}
            <div style={{display: "flex", marginTop: "10px", padding: "10px"}}>
                <div style={{border: "1px solid black", height: "35px", flex: 1, padding: "5px"}}>
                    <strong>Pesada Nº</strong>
                </div>
                <div style={{border: "1px solid black", height: "35px", flex: 2, padding: "5px"}}>

                </div>
                <div style={{border: "1px solid black", height: "35px", flex: 1.5, padding: "5px"}}>
                    <strong>Nuestro Nº Prov.</strong>
                </div>
                <div style={{border: "1px solid black", height: "35px", flex: 1.5, padding: "5px"}}>
                    <strong>Productor</strong>
                </div>
                <div style={{border: "1px solid black", height: "35px", flex: 2, padding: "5px"}}>
                </div>
            </div>

            {/* Tabla de ítems */}
            <table width="100%" border="1" cellPadding="5" style={{borderCollapse: "collapse"}}>
                <thead>
                <tr>
                    <th>Nota de Pedido</th>
                    <th>Orden Fabric.</th>
                    <th>Cant.</th>
                    <th>Denominación</th>
                    <th>Orden de Compra</th>
                    <th>KGS</th>
                    <th>Observaciones</th>
                </tr>
                </thead>
                <tbody>
                {datos.items.map((item, index) => (
                    <tr key={index}>
                        <td>{item.notaPedido}</td>
                        <td>{item.ordenFabric}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.denominacion}</td>
                        <td>{item.ordenCompra}</td>
                        <td>{item.kgs}</td>
                        <td>{item.observaciones}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pie de firma y totales */}
            <div style={{display: "flex", marginTop: "10px"}}>
                <div style={{border: "1px solid black", height: "60px", flex: 2, padding: "5px"}}>
                    <strong>Firma del receptor y/o sello:</strong>
                </div>
                <div style={{border: "1px solid black", height: "60px", flex: 1, padding: "5px"}}>
                    <strong>Aclaración Firma:</strong>
                </div>
                <div style={{border: "1px solid black", height: "60px", flex: 0.6, padding: "5px"}}>
                    <strong>Total KGRS:</strong>
                    <br/>
                    {datos.items.reduce((acc, i) => acc + (i.kgs * i.cantidad), 0).toFixed(2)}
                </div>
                <div style={{border: "1px solid black", height: "60px", flex: 0.6, padding: "5px"}}>
                    <strong>Fecha de recepción:</strong>
                    <table border="1" cellPadding={20}
                           style={{marginTop: "5px", width: "100%", fontSize: "11px", borderCollapse: "collapse"}}>
                        <tbody>
                        <tr>
                            <td style={{textAlign: "center"}}></td>
                            <td style={{textAlign: "center"}}></td>
                            <td style={{textAlign: "center"}}></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RemitoDocumento;
