import { DataTableComponent, DataTableProvider } from '@/components/partials/dataTables';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { renderRowDate, renderRowHeader } from '@/utils/material-table';
import { Head, router } from '@inertiajs/react';
import { BadgeCheckIcon, BadgeXIcon } from 'lucide-react';

export default function ListPage() {
    const columns = [
        {
            header: (info: any) => renderRowHeader(info, 'Name'),
            accessorKey: 'name',
        },
        {
            header: (info: any) => renderRowHeader(info, 'Email'),
            accessorKey: 'email',
        },
        {
            header: (info: any) => renderRowHeader(info, 'Verified'),
            accessorKey: 'email_verified_at',
            cell: (info: any) => renderRowVerify(info),
        },
        {
            header: (info: any) => renderRowHeader(info, 'Created At'),
            accessorKey: 'created_at',
            cell: (info: any) => renderRowDate(info.getValue()),
        },
        {
            header: (info: any) => renderRowHeader(info, 'Updated At'),
            accessorKey: 'updated_at',
            cell: (info: any) => renderRowDate(info.getValue()),
        },
    ];

    const renderRowVerify = (info: any) => {
        const handleVerify = (id: number) => {
            router.put(
                route('users.verify', id),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // router.reload({ only: ['flash'] });
                        router.reload();
                        router.visit(route('users.index'));
                    },
                },
            );
        };

        return info.getValue() ? (
            <Badge className="bg-blue-500 text-white dark:bg-blue-600" variant="default" color="success">
                <BadgeCheckIcon />
                Verified
            </Badge>
        ) : (
            <Badge className="cursor-pointer" onClick={() => handleVerify(info.row.original.id)} variant="destructive" color="danger">
                <BadgeXIcon />
                Not Verified
            </Badge>
        );
    };

    const formatDataForExport = (data: any) => {
        return data.map((item: any, i: number) => ({
            No: i + 1,
            Name: item.name,
            Email: item.email,
            'Created At': item.created_at,
            'Updated At': item.updated_at,
        }));
    };

    return (
        <AppLayout>
            <Head title="Users List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex min-h-[100vh] flex-1 flex-col space-y-4 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTableProvider fetchDataUrl={'users.data'} columns={columns} formatDataForExport={formatDataForExport}>
                        <DataTableComponent createRouteUrl="users.create" />
                    </DataTableProvider>
                </div>
            </div>
        </AppLayout>
    );
}
