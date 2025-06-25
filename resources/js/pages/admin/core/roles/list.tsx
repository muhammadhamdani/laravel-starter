import { DataTableComponent, DataTableProvider } from '@/components/partials/dataTables';
import AppLayout from '@/layouts/app-layout';
import { renderRowDate, renderRowHeader } from '@/utils/material-table';
import { Head } from '@inertiajs/react';

export default function ListPage() {
    const columns = [
        {
            header: (info: any) => renderRowHeader(info, 'Name'),
            accessorKey: 'name',
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

    const formatDataForExport = (data: any) => {
        return data.map((item: any, i: number) => ({
            No: i + 1,
            Name: item.name,
            'Created At': item.created_at,
            'Updated At': item.updated_at,
        }));
    };

    return (
        <AppLayout>
            <Head title="Roles List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex min-h-[100vh] flex-1 flex-col space-y-4 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTableProvider fetchDataUrl={'roles.data'} columns={columns} formatDataForExport={formatDataForExport}>
                        <DataTableComponent createRouteUrl="roles.create" />
                    </DataTableProvider>
                </div>
            </div>
        </AppLayout>
    );
}
