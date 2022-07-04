import { useContext } from 'react';
import { GlobalContext } from '../components/context/GlobalProvider';
import { Confirmations, paymentMethod, Digits } from '../types';

interface GlobalContextState {
    itemId: string;
    paymentMethod: paymentMethod;
    storeAddress: string;
    link: URL;
    requiredConfirmations?: Confirmations;
    minDecimals?: Digits;
}
export function useGlobal(): GlobalContextState {
    return useContext(GlobalContext);
}
