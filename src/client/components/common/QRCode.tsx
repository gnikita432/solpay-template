import { createQROptions } from '@solana/pay';
import QRCodeStyling from '@solana/qr-code-styling';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import css from './QRCode.module.css';

interface IQRCode {
    url: URL;
}
export const QRCode: FC<IQRCode> = ({ url }) => {
    const [size, setSize] = useState(() =>
        typeof window === 'undefined' ? 400 : Math.min(window.screen.availWidth - 48, 400)
    );
    const { theme } = useTheme();
    useEffect(() => {
        const listener = () => setSize(Math.min(window.screen.availWidth - 48, 400));

        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, []);

    const color = theme == 'dark' ? '#ffff' : '#2a2a2a';
    const options = useMemo(() => createQROptions(url, size, 'transparent', color), [url, size, color]);

    const qr = useMemo(() => new QRCodeStyling(), []);
    useEffect(() => qr.update(options), [qr, options]);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            qr.append(ref.current);
        }
    }, [ref, qr]);

    return <div ref={ref} className={css.root} />;
};
