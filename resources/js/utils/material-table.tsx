import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export const renderRowDate = (value: any) => {
    const date = new Date(value);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export const renderRowDateTime = (value: any) => {
    const date = new Date(value);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const renderRowHeader = (info: any, title: string) => {
    const isSorted = info.column.getIsSorted(); // 'asc', 'desc' atau false
    const columnId = info.column.id;

    const renderSortIcon = () => {
        if (isSorted === 'asc') return <ChevronUpIcon className="h-5 w-5" />;
        if (isSorted === 'desc') return <ChevronDownIcon className="h-5 w-5" />;

        if (!isSorted && columnId === 'id') {
            return <ChevronDownIcon className="text-muted-foreground h-5 w-5" />;
        }

        return <ChevronsUpDownIcon className="text-muted-foreground h-5 w-5" />;
    };

    return (
        <div className="flex cursor-pointer flex-row items-center justify-between space-x-4 px-3" onClick={info.column.getToggleSortingHandler()}>
            <span>{title}</span>
            {renderSortIcon()}
        </div>
    );
};

export const renderRowAction = (info: any, fetchData: () => void) => {
    const [openModal, setOpenModal] = useState(false);

    const { url } = usePage<SharedData>();

    const data = info.row.original;

    const handleActionDelete = (id: number) => {
        setOpenModal(true);
    };

    const handleDelete = (id: number, url: string) => {
        router.delete(`${url}/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenModal(false);
                fetchData();
                router.reload({ only: ['flash'] });
            },
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.visit(`${url}/${data.id}`)}>Detail</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.visit(`${url}/${data.id}/edit`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleActionDelete(data.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {openModal && (
                <Dialog open={openModal} onOpenChange={(open) => setOpenModal(open)}>
                    <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
                    <DialogContent className="">
                        <DialogTitle className="text-xl font-semibold">Confirm Deletion</DialogTitle>
                        <DialogDescription className="mt-2">
                            Are you sure you want to delete this item? This action cannot be undone.
                        </DialogDescription>
                        <div className="mt-4 flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => setOpenModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handleDelete(data.id, url)}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};
