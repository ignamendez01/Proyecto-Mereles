import { createContext, useReducer, useContext } from "react";

const DataContext = createContext();

const initialState = {
    items: [],
};

const dataReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            return { ...state, items: [...state.items, action.payload] };
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };
        case "DESACTIVATE_ITEM":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.numero === action.payload ? { ...item, isActive: false } : item
                ),
            };
        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.numero === action.originalNumero
                        ? { ...item, ...action.payload }
                        : item
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
