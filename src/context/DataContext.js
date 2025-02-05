import { createContext, useReducer, useContext } from "react";

const DataContext = createContext();

const initialState = {
    modelos: [],
    remitos: [],
    lastModelId: 0,
    lastGroupId: 0,
    lastRemitoId: 1,
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
        case "REMOVE_MODELO":
            return {
                ...state,
                modelos: state.modelos.filter((modelo) => modelo.id !== action.payload),
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
        case "ADD_REMITOS":
            return {
                ...state,
                remitos: [...state.remitos, ...action.payload.remitos],
                lastRemitoId: action.payload.lastRemitoId,
                lastGroupId: action.payload.lastGroupId,
            };
        case "REMOVE_REMITO":
            return {
                ...state,
                remitos: state.remitos.filter((remito) => remito.id !== action.payload),
            };
        case "UPDATE_REMITO":
            return {
                ...state,
                remitos: state.remitos.map((remito) =>
                    remito.id === action.payload.id ? { ...remito, ...action.payload } : remito
                ),
            };
        case "DESACTIVAR_REMITOS":
            return {
                ...state,
                remitos: action.payload,
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
