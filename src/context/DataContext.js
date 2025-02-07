import { createContext, useReducer, useContext } from "react";

const DataContext = createContext();

const initialState = {
    modelos: [],
    remitos: [],
    tachos: [],
    pesajes: [],
    lastModelId: 0,
    lastRemitoId: 1,
    lastTachoId: 0,
    lastPesajeId: 1,
};

const dataReducer = (state, action) => {
    switch (action.type) {
        case "ADD_MODELO":
            const newModelId = state.lastModelId + 1;
            return {
                ...state,
                modelos: [...state.modelos, { ...action.payload, id: newModelId }],
                lastModelId: newModelId,
            };
        case "DESACTIVAR_MODELO":
            return {
                ...state,
                modelos: state.modelos.map((modelo) =>
                    modelo.id === action.payload ? { ...modelo, isActive: false } : modelo
                ),
            };
        case "UPDATE_MODELO":
            return {
                ...state,
                modelos: state.modelos.map((modelo) =>
                    modelo.id === action.payload.id ? { ...modelo, ...action.payload } : modelo
                ),
            };
        case "ADD_TACHO":
            const newTachoId = state.lastTachoId + 1;
            return {
                ...state,
                tachos: [...state.tachos, { ...action.payload, id: newTachoId }],
                lastTachoId: newTachoId,
            };
        case "DESACTIVAR_TACHO":
            return {
                ...state,
                tachos: state.tachos.map((tacho) =>
                    tacho.id === tacho.payload ? { ...tacho, isActive: false } : tacho
                ),
            };
        case "UPDATE_TACHO":
            return {
                ...state,
                tachos: state.tachos.map((tacho) =>
                    tacho.id === action.payload.id ? { ...tacho, ...action.payload } : tacho
                ),
            };
        case "ADD_REMITOS":
            return {
                ...state,
                remitos: [
                    ...state.remitos,
                    {
                        ...action.payload,
                        id: state.lastRemitoId,
                        isActive: true
                    }
                ],
                lastRemitoId: state.lastRemitoId + 1,
            };
        case "DESACTIVAR_REMITO":
            return {
                ...state,
                remitos: state.remitos.map((remito) =>
                    remito.id === action.payload.id ? { ...remito, isActive: false } : remito
                ),
            };
        case "UPDATE_REMITO":
            return {
                ...state,
                remitos: state.remitos.map((remito) =>
                    remito.id === action.payload.id ? { ...action.payload } : remito
                ),
            };
        case "ADD_PESAJE":
            return {
                ...state,
                pesajes: [
                    ...state.pesajes,
                    {
                        ...action.payload,
                        id: state.lastPesajeId,
                        isPesado: false,
                        isDeployed: false,
                    }
                ],
                lastPesajeId: state.lastPesajeId + 1,
            };
        case "PESAR_REMITOS":
            return {
                ...state,
                pesajes: state.pesajes.map((remito) =>
                    remito.id === action.payload ? { ...remito, isPesado: true } : remito
                ),
            };
        case "DEPLOY_REMITO":
            return {
                ...state,
                pesajes: state.pesajes.map((remito) =>
                    remito.id === action.payload ? { ...remito, isDeployed: true } : remito
                ),
            };
        default:
            return state;
    }
};

export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    return useContext(DataContext);
};
