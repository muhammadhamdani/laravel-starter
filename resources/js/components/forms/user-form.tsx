import { useForm, usePage } from '@inertiajs/react';
import { EyeClosedIcon, EyeIcon, SaveIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { ButtonComponent } from '../partials/button-component';
import InputTextComponent from '../partials/input-components';
import { SelectComponent } from '../partials/select-component';

export const UserForm = ({ dataId }: { dataId?: number }) => {
    const { user, roles } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        saveBack: 'false',
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.roles[0]?.id || '',
    });

    // transformData
    transform((data) => ({
        ...data,
        role: roles?.filter((role: any) => role?.id === parseInt(data?.role))[0]?.name,
    }));

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (dataId) {
            put(route('users.update', dataId), {
                onSuccess: () => {
                    toast.success('User berhasil diubah');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat mengubah user');
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    toast.success('User berhasil ditambahkan');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menambahkan user');
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputTextComponent
                    type="text"
                    label="Name"
                    name="name"
                    value={data.name}
                    handleOnChange={(value: string) => setData('name', value)}
                    errors={errors.name && errors.name}
                    helperText={errors.name && errors.name}
                />
                <InputTextComponent
                    type="email"
                    label="Email"
                    name="email"
                    value={data.email}
                    handleOnChange={(value: string) => setData('email', value)}
                    errors={errors.email && errors.email}
                    helperText={errors.email && errors.email}
                />
                <InputTextComponent
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    name="password"
                    value={data.password}
                    addonRight={showPassword ? EyeClosedIcon : EyeIcon}
                    addonRightHandler={() => setShowPassword(!showPassword)}
                    handleOnChange={(value: string) => setData('password', value)}
                    errors={errors.password && errors.password}
                    helperText={errors.password && errors.password}
                />
                <InputTextComponent
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    label="Password Confirmation"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    addonRight={showPasswordConfirmation ? EyeClosedIcon : EyeIcon}
                    addonRightHandler={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    handleOnChange={(value: string) => setData('password_confirmation', value)}
                    errors={errors.password_confirmation && errors.password_confirmation}
                    helperText={errors.password_confirmation && errors.password_confirmation}
                />
                <SelectComponent
                    label="Role"
                    data={roles.map((role: any) => ({ value: role.id, label: role.name }))}
                    dataSelected={data.role}
                    handleOnChange={(value: any) => setData('role', value)}
                    errors={errors.role && errors.role}
                    helperText={errors.role && errors.role}
                />
            </div>
            <div className="flex justify-end space-x-4">
                <ButtonComponent
                    buttonText="Save"
                    addonLeft={SaveIcon}
                    buttonType="submit"
                    isProcessing={processing}
                    onClick={() => setData('saveBack', 'true')}
                />
                {/* <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Save'}
                </Button> */}
            </div>
        </form>
    );
};
