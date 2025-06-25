import { useForm, usePage } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { ButtonComponent } from '../partials/button-component';
import InputTextComponent from '../partials/input-components';

export const RoleForm = ({ dataId }: { dataId?: number }) => {
    const { role, permissions } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        saveBack: 'false',
        name: role?.name || '',
        permissions: role?.permissions.map((permission: any) => permission.id) || [],
    });

    // transformData
    transform((data) => ({
        ...data,
    }));

    const groupedPermissions = Object.values(
        permissions.reduce((acc: any, permission: any) => {
            const match = permission.name.match(/^(view|create|update|delete)-(.*)$/);
            if (!match) return acc;

            const subject = match[2];

            if (!acc[subject]) {
                acc[subject] = {
                    group: subject,
                    permissions: [],
                };
            }

            acc[subject].permissions.push(permission);

            return acc;
        }, {}),
    );

    const togglePermission = (id: number) => {
        const currentPermissions = data.permissions || [];
        const newPermissions = currentPermissions.includes(id) ? currentPermissions.filter((x: any) => x !== id) : [...currentPermissions, id];

        setData('permissions', newPermissions);
    };

    const toggleAllInGroup = (group: any) => {
        const groupIds = group.permissions.map((p: any) => p.id);
        const isAllChecked = groupIds.every((id: any) => data.permissions.includes(id));

        const newPermissions = isAllChecked
            ? data.permissions.filter((id: any) => !groupIds.includes(id))
            : [...new Set([...data.permissions, ...groupIds])];

        setData('permissions', newPermissions);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (dataId) {
            put(route('roles.update', dataId), {
                onSuccess: () => {
                    toast.success('Role berhasil diubah');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat mengubah role');
                },
            });
        } else {
            post(route('roles.store'), {
                onSuccess: () => {
                    toast.success('Role berhasil ditambahkan');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menambahkan role');
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
            </div>
            <div className="flex flex-col space-y-4">
                <label className="text-sm font-semibold">Access Role</label>
                <div className="grid grid-cols-3 gap-4">
                    {groupedPermissions.map((group: any) => {
                        const groupIds = group.permissions.map((p: any) => p.id);
                        const allChecked = groupIds.every((id: any) => data.permissions.includes(id));

                        return (
                            <div key={group.group} className="rounded border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-base font-semibold capitalize">{group.group.replace(/[-_]/g, ' ')}</h3>
                                    <button type="button" onClick={() => toggleAllInGroup(group)} className="text-sm text-blue-600 hover:underline">
                                        {allChecked ? 'Uncheck All' : 'Check All'}
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {group.permissions.map((permission: any) => (
                                        <label key={permission.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes(permission.id)}
                                                onChange={() => togglePermission(permission.id)}
                                            />
                                            <span>{permission.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <ButtonComponent
                    buttonText="Save"
                    addonLeft={SaveIcon}
                    buttonType="submit"
                    isProcessing={processing}
                    onClick={() => setData('saveBack', 'true')}
                />
            </div>
        </form>
    );
};
