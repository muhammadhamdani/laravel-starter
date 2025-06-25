import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import moment from 'moment-timezone';

export default function DetailPage() {
    const { role } = usePage<any>().props;

    const groupedPermissions = Object.values(
        role.permissions.reduce((acc: any, permission: any) => {
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

    return (
        <AppLayout>
            <Head title="Role Detail" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold">
                                Name
                            </Label>
                            <p className="text-sm">{role.name}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="created_at" className="text-sm font-semibold">
                                Created At
                            </Label>
                            <p className="text-sm">{moment(role.created_at).tz('Asia/Jakarta').format('DD MMMM YYYY')}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="updated_at" className="text-sm font-semibold">
                                Updated At
                            </Label>
                            <p className="text-sm">{moment(role.updated_at).tz('Asia/Jakarta').format('DD MMMM YYYY')}</p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 px-4">
                        <label className="text-sm font-semibold">Access Role</label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {groupedPermissions.map((group: any) => {
                                const groupIds = group.permissions.map((p: any) => p.id);
                                const allChecked = groupIds.every((id: any) => role.permissions.some((p: any) => p.id === id));

                                return (
                                    <div key={group.group} className="rounded border p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold capitalize">{group.group.replace(/[-_]/g, ' ')}</h3>
                                        </div>
                                        <div className="space-y-1">
                                            {group.permissions.map((permission: any) => (
                                                <label key={permission.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={role.permissions.some((p: any) => p.id === permission.id)}
                                                        disabled
                                                    />
                                                    <span className="text-sm">{permission.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
