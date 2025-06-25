// import classNames from 'classnames';
// import { Check, ChevronsUpDown, InfoIcon } from 'lucide-react';
// import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// import { Button } from '../ui/button';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
// import { Label } from '../ui/label';
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import axios from 'axios';
import classNames from 'classnames';
import { Check, ChevronsUpDown, InfoIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// export const SelectContext = createContext({});

// export const UseSelect = () => useContext(SelectContext);

// export const SelectProvider = ({
//     multiple = false,
//     dataSelected,
//     handleOnChange,
//     children,
// }: {
//     children: ReactNode;
//     multiple?: boolean;
//     handleOnChange?: (value: any) => void;
//     dataSelected?: string | string[];
// }) => {
//     const [selected, setSelected] = useState(dataSelected !== undefined ? dataSelected : multiple ? [] : '');

//     useEffect(() => {
//         handleOnChange?.(selected);
//     }, [selected]);

//     const isSelected = (value: any) => {
//         return multiple ? selected.includes(value) : selected === value;
//     };

//     const contextValue = { selected, setSelected, isSelected, multiple };

//     return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
// };

// export function SelectComponent({ label, data, placeholder = 'Select option...' }: { label?: string; data: any[]; placeholder?: string }) {
//     const [open, setOpen] = useState(false);
//     const { selected, setSelected, isSelected, multiple }: any = UseSelect();

//     const toggleValue = (value: any) => {
//         if (multiple) {
//             const current = selected;
//             const updated = current.includes(value) ? current.filter((v: any) => v !== value) : [...current, value];
//             setSelected(updated);
//         } else {
//             setSelected(value);
//             setOpen(false);
//         }
//     };

//     const displayLabel = multiple
//         ? selected.length
//             ? data
//                   .filter((d: any) => selected.includes(d.value))
//                   .map((d: any) => d.label)
//                   .join(', ')
//             : placeholder
//         : selected
//           ? (data.find((d) => d.value === selected)?.label ?? placeholder)
//           : placeholder;

//     return (
//         <Popover open={open} onOpenChange={setOpen}>
//             <div className="w-ful flex flex-col space-y-3">
//                 {label && <Label>{label}</Label>}
//                 <PopoverTrigger asChild>
//                     <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
//                         {displayLabel}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
//                     </Button>
//                 </PopoverTrigger>
//             </div>
//             <PopoverContent className="w-full p-0">
//                 <Command>
//                     <CommandInput placeholder="Search..." className="h-9" />
//                     <CommandList>
//                         <CommandEmpty>No option found.</CommandEmpty>
//                         <CommandGroup>
//                             {data.map((item: any) => (
//                                 <CommandItem key={item.value} onSelect={() => toggleValue(item.value)} className="cursor-pointer">
//                                     {item.label}
//                                     <Check className={classNames('ml-auto h-4 w-4', isSelected(item.value) ? 'opacity-100' : 'opacity-0')} />
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// }

export const SelectWithSearchComponent = ({
    data = [],
    dataSelected,
    placeholder = 'Select option...',
    handleOnChange,
    label,
    helperText,
    multiple,
    errors,
}: SelectProps) => {
    const [isOpen, setOpen] = useState(false);
    const [resultData, setResultData] = useState(data);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const isSelected = (value: string) => {
        if (multiple && Array.isArray(dataSelected)) {
            return dataSelected.includes(value);
        }
        return dataSelected === value;
    };

    const toggleMultipleValue = (value: string) => {
        if (!Array.isArray(dataSelected)) return handleOnChange?.([value]);
        const exists = dataSelected.includes(value);
        const newValue = exists ? dataSelected.filter((v) => v !== value) : [...dataSelected, value];
        handleOnChange?.(newValue);
    };

    const displayLabel = () => {
        if (multiple && Array.isArray(dataSelected)) {
            const selectedLabels = resultData.filter((d) => dataSelected.includes(d.value)).map((d) => d.label);
            return selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;
        }
        return resultData.find((d) => d.value === dataSelected)?.label ?? placeholder;
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('permissions.data'));
            const results = response.data;
            const formatted = results.map((item: any) => ({
                label: item.name,
                value: item.id.toString(),
            }));
            setResultData(formatted);
        } catch (error) {
            console.error('Failed to fetch options:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // filter data based on label
    const filteredData = resultData.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex flex-col space-y-3">
            {label && <Label>{label}</Label>}
            <Popover open={isOpen} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className={classNames('w-full justify-between', errors && 'border-red-500')}
                    >
                        <span className="truncate">{displayLabel()}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder="Search..." value={searchTerm} onValueChange={(val) => setSearchTerm(val)} className="h-9" />
                        <CommandList>
                            {loading ? (
                                <CommandEmpty className="p-4 text-center text-sm text-gray-500">Loading...</CommandEmpty>
                            ) : filteredData.length === 0 ? (
                                <CommandEmpty>No matching result.</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {filteredData.map((item: any) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.value}
                                            onSelect={(value) => {
                                                if (multiple) {
                                                    toggleMultipleValue(value);
                                                } else {
                                                    handleOnChange?.(value === dataSelected ? '' : value);
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            {item.label}
                                            <Check className={classNames('ml-auto h-4 w-4', isSelected(item.value) ? 'opacity-100' : 'opacity-0')} />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {helperText && (
                <div className={classNames('flex items-center space-x-2 text-xs', errors ? 'text-red-500' : 'text-gray-500')}>
                    <InfoIcon className={classNames('h-4 w-4', errors ? 'text-red-500' : 'text-yellow-500')} />
                    <span>{helperText}</span>
                </div>
            )}
        </div>
    );
};

export const SelectComponent = ({
    data = Array.from({ length: 5 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `${i + 1}`,
    })),
    dataSelected,
    label,
    errors,
    helperText,
    className,
    placeholder = 'Select option...',
    handleOnChange,
    ...props
}: SelectProps) => {
    return (
        <div className="flex flex-col space-y-3">
            {label && <Label>{label}</Label>}
            <Select defaultValue={dataSelected?.toString()} onValueChange={(value) => handleOnChange?.(value)} {...props}>
                <SelectTrigger className={classNames('w-full', className, errors && 'border-red-500')}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {data.map((item) => (
                        <SelectItem key={item.value} value={item.value.toString()}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {helperText && (
                <div className={classNames('flex items-center space-x-2 text-xs', errors ? 'text-red-500' : 'text-gray-500')}>
                    <InfoIcon className={classNames('h-4 w-4', errors ? 'text-red-500' : 'text-yellow-500')} />
                    <span>{helperText}</span>
                </div>
            )}
        </div>
    );
};

interface SelectProps {
    data?: SelectOption[];
    dataSelected?: any;
    label?: string;
    placeholder?: string;
    errors?: any;
    helperText?: string;
    className?: string;
    multiple?: boolean;
    handleOnChange: (value: any) => void;
    [key: string]: any;
}

interface SelectOption {
    label: string;
    value: string | number;
}
