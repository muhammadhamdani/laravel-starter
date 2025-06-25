import classNames from 'classnames';
import { LoaderCircle } from 'lucide-react';
import { createElement } from 'react';
import { Button } from '../ui/button';

export const ButtonComponent = ({
    buttonText = 'Button',
    buttonType = 'button',
    isProcessing,
    className,
    addonLeft,
    addonRight,
    ...props
}: ButtonProps) => {
    return (
        <Button type={buttonType} disabled={isProcessing} className={classNames('cursor-pointer disabled:cursor-not-allowed', className)} {...props}>
            {addonLeft && createElement(addonLeft, { className: 'w-5 h-5' })}
            <span>{buttonText}</span>
            {addonRight && createElement(addonRight, { className: 'w-5 h-5' })}
            {isProcessing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
        </Button>
    );
};

interface ButtonProps {
    buttonText?: string;
    buttonType?: 'button' | 'submit' | 'reset';
    addonLeft?: any;
    addonRight?: any;
    isProcessing?: boolean;
    className?: string;
    [key: string]: any;
}
