import { createContext, useReducer, useContext } from "react";

const DataContext = createContext();

const initialState = {
    items: [],
    lastId: 0,
};

const dataReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            const newId = state.lastId + 1;
            return {
                ...state,
                items: [...state.items, { ...action.payload, id: newId }],
                lastId: newId,
            };
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };
        case "DESACTIVATE_ITEM":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload ? { ...item, isActive: false } : item
                ),
            };
        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id ? { ...item, ...action.payload } : item
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
