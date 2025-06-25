import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import classNames from 'classnames';
import { InfoIcon } from 'lucide-react';
import { createElement } from 'react';
import { Textarea } from '../ui/textarea';

export default function InputTextComponent({
    label,
    errors,
    helperText,
    addonRight,
    addonRightHandler,
    iconClass,
    addonLeft,
    addonLeftHandler,
    className,
    handleOnChange,
    ...props
}: InputProps) {
    return (
        <div className="flex flex-col space-y-3">
            {label && <Label>{label}</Label>}
            <div className="relative">
                {addonLeft && (
                    <button type="button" onClick={addonLeftHandler} className="absolute inset-y-0 left-0 flex items-center px-2">
                        {createElement(addonLeft, { className: 'w-4 h-4' })}
                    </button>
                )}
                <Input
                    onChange={(e: any) => handleOnChange(e.target.value)}
                    className={classNames('', className, addonLeft && 'pl-8', addonRight && 'pr-8')}
                    {...props}
                />
                {addonRight && (
                    <button type="button" onClick={addonRightHandler} className="absolute inset-y-0 right-0 flex items-center px-2">
                        {createElement(addonRight, {
                            className: classNames('w-4 h-4', iconClass),
                        })}
                    </button>
                )}
            </div>
            {helperText && (
                <div className={classNames('flex items-center space-x-2 text-xs', errors && 'text-red-500')}>
                    <InfoIcon className={classNames('h-4 w-4', errors ? 'text-red-500' : 'text-yellow-500')} />
                    <span>{helperText}</span>
                </div>
            )}
        </div>
    );
}

export const InputTextAreaComponent = ({
    label,
    errors,
    helperText,
    addonRight,
    addonRightHandler,
    iconClass,
    addonLeft,
    addonLeftHandler,
    className,
    handleOnChange,
    ...props
}: InputProps) => {
    return (
        <div className="flex flex-col space-y-3">
            {label && <Label>{label}</Label>}
            <div className="relative">
                {addonLeft && (
                    <button type="button" onClick={addonLeftHandler} className="absolute inset-y-0 left-0 flex items-center px-2">
                        {createElement(addonLeft, { className: 'w-4 h-4' })}
                    </button>
                )}
                <Textarea onChange={(e: any) => handleOnChange(e.target.value)} {...props} />
                {addonRight && (
                    <button type="button" onClick={addonRightHandler} className="absolute inset-y-0 right-0 flex items-center px-2">
                        {createElement(addonRight, {
                            className: classNames('w-4 h-4', iconClass),
                        })}
                    </button>
                )}
            </div>
            {helperText && (
                <div className={classNames('flex items-center space-x-2 text-xs', errors && 'text-red-500')}>
                    <InfoIcon className={classNames('h-4 w-4', errors ? 'text-red-500' : 'text-yellow-500')} />
                    <span>{helperText}</span>
                </div>
            )}
        </div>
    );
};

interface InputProps {
    label?: string;
    errors?: any;
    helperText?: string;
    addonRight?: any;
    addonRightHandler?: any;
    iconClass?: string;
    addonLeft?: any;
    addonLeftHandler?: any;
    className?: string;
    handleOnChange: (e: any) => void;
    [key: string]: any;
}
