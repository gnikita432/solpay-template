import { ReactNode, createContext, FC } from 'react';
import { Confirmations, Digits, paymentMethod } from '../../types';
// Holds app global state shared across component

export interface ConfigProviderProps {
    children: ReactNode;
    itemId: string;
    paymentMethod: paymentMethod;
    storeAddress: string;
    link: URL;
    requiredConfirmations?: Confirmations;
    minDecimals?: Digits;
}

export const GlobalContext = createContext<ConfigProviderProps>({} as ConfigProviderProps);

export const GlobalProvider: FC<ConfigProviderProps> = ({
    children,
    itemId,
    paymentMethod,
    storeAddress,
    link,
    requiredConfirmations = 1,
    minDecimals = 0,
}) => {
    return (
        <GlobalContext.Provider
            value={{
                children,
                paymentMethod,
                itemId,
                storeAddress,
                link,
                requiredConfirmations,
                minDecimals,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
