import BigNumber from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { useGlobal } from '../../hooks/useGlobal';
import { NON_BREAKING_SPACE } from '../../utils/constants';

export interface AmountProps {
    amount: BigNumber | undefined;
    showZero?: boolean;
}

export const Amount: FC<AmountProps> = ({ amount, showZero }) => {
    const { minDecimals = 0 } = useGlobal();

    const value = useMemo(() => {
        if (!amount) return NON_BREAKING_SPACE;
        if (amount.isGreaterThan(0)) {
            const formatTo = amount?.decimalPlaces() || 0 < minDecimals ? minDecimals : amount.decimalPlaces();
            return amount.toFormat(formatTo || 0);
        } else {
            return showZero ? '0' : NON_BREAKING_SPACE;
        }
    }, [amount, minDecimals, showZero]);

    return <span>{value}</span>;
};
