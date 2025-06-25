import { useState } from 'react';
import { SelectWithSearchComponent } from '../partials/select-component';

export const ExampleForm = () => {
    const [selectedData, setSelectedData] = useState('');
    const [selectedMultiData, setSelectedMultiData] = useState([]);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4">
                <SelectWithSearchComponent
                    placeholder="Choose option"
                    dataSelected={selectedData}
                    handleOnChange={(value: string) => setSelectedData(value)}
                />
                <SelectWithSearchComponent
                    placeholder="Choose option"
                    dataSelected={selectedMultiData}
                    handleOnChange={(value: any) => setSelectedMultiData(value)}
                    multiple
                />
            </div>
        </div>
    );
};
