import { ReactNode, createContext, FC } from 'react';
import { Confirmations, Digits, paymentMethod } from '../../types';
// Holds app global state shared across component

export interface ConfigProviderProps {
    children: ReactNode;
    itemId: string;
    paymentMethod: paymentMethod;
    storeAddress: string;
    link: URL;
    claimLink: URL;
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
    claimLink,
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
                claimLink,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
