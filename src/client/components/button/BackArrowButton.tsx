import React, { FC, HTMLAttributes, ReactNode } from 'react';
import { BackIcon } from '../images/BackIcon';
import css from './BackArrowButton.module.css';

export interface BackArrowButtonProps {
    children: ReactNode;
    onClick: HTMLAttributes<HTMLButtonElement>['onClick'];
}

export const BackArrowButton: FC<BackArrowButtonProps> = ({ children, onClick }) => {
    return (
        <button className={css.button} type="button" onClick={onClick}>
            <BackIcon />
            {children}
        </button>
    );
};
