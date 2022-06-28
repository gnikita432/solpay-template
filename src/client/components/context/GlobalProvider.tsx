import { ReactNode, createContext, FC } from 'react';
// Holds app global state shared across component

export interface ConfigProviderProps {
    children: ReactNode;
    itemId: string;
    paymentMethod: 'QRCod' | 'Wallet';
}

export const GlobalContext = createContext<ConfigProviderProps>({} as ConfigProviderProps);

export const GlobalProvider: FC<ConfigProviderProps> = ({ children, itemId, paymentMethod }) => {
    return (
        <GlobalContext.Provider
            value={{
                children,
                paymentMethod,
                itemId,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
