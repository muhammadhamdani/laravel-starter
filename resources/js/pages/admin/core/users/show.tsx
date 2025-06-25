import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import moment from 'moment-timezone';

export default function DetailPage() {
    const { user } = usePage<any>().props;

    return (
        <AppLayout>
            <Head title="User Detail" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="name" className="text-sm font-semibold">
                                Name
                            </label>
                            <p className="text-sm">{user?.name}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold">
                                Email
                            </label>
                            <p className="text-sm">{user?.email}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="role" className="text-sm font-semibold">
                                Role
                            </label>
                            <p className="text-sm">{user?.roles[0]?.name || '-'}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold">
                                Created At
                            </label>
                            <p className="text-sm">{moment(user.created_at).tz('Asia/Jakarta').format('DD MMMM YYYY')}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold">
                                Updated At
                            </label>
                            <p className="text-sm">{moment(user.updated_at).tz('Asia/Jakarta').format('DD MMMM YYYY')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
