import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import classNames from 'classnames';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.href === page.url} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export const MainNavigation = ({ items = [] }: { items: any[] }) => {
    const { url, props }: any = usePage();
    const permissions: string[] = props.auth?.permissions || [];
    const roles: string[] = props.auth?.roles || [];

    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    const normalizePath = (path: string) => '/' + path.replace(/^\/+|\/+$/g, '');
    const currentPath = normalizePath(url);

    const getPathname = (href: string) => {
        if (!href) return '';
        try {
            return normalizePath(new URL(href, window.location.origin).pathname);
        } catch {
            return normalizePath(href);
        }
    };

    const hasPermission = (permission: string) => permissions.includes(permission);

    const hasRole = (requiredRoles: string[]) =>
        roles.includes('Administrators') || requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role));

    const filterMenuByPermissions = (menus: any[]): any[] => {
        return menus
            .map((item) => {
                const requiredRoles: string[] = item.roles ?? [];

                if (requiredRoles.length > 0 && !hasRole(requiredRoles)) return null;
                if (item.permission && !hasPermission(item.permission)) return null;

                const filteredChildren = Array.isArray(item.children) ? filterMenuByPermissions(item.children) : [];

                if (!item.href && filteredChildren.length === 0) return null;

                return {
                    ...item,
                    children: filteredChildren,
                };
            })
            .filter(Boolean);
    };

    const filteredItems = useMemo(() => {
        return filterMenuByPermissions(items);
    }, [items, permissions, roles]);

    const getMenuKey = (item: any, parents: string[] = []) => {
        return [...parents, item.title].join(' > ');
    };

    const hasExactMatchingChild = (children: any[]): boolean => {
        return children?.some((child) => {
            const childPath = getPathname(child.href || '');

            // cocokkan exact atau prefix match
            const isMatch = currentPath === childPath || currentPath.startsWith(childPath + '/');

            return isMatch || (child.children?.length && hasExactMatchingChild(child.children));
        });
    };

    useEffect(() => {
        const newOpenMenus: { [key: string]: boolean } = {};

        const traverse = (menus: any[], parents: string[] = []) => {
            menus.forEach((item) => {
                const hasMatchChild = hasExactMatchingChild(item.children || []);

                if (hasMatchChild) {
                    [...parents, item.title].forEach((_, idx, arr) => {
                        const key = getMenuKey({ title: arr[idx] }, arr.slice(0, idx));
                        newOpenMenus[key] = true;
                    });
                }

                if (item.children?.length) {
                    traverse(item.children, [...parents, item.title]);
                }
            });
        };

        traverse(filteredItems);
        setOpenMenus(newOpenMenus);
    }, [currentPath, filteredItems]);

    const toggleMenu = (key: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const renderMenuItems = (menuItems: any[], level = 0, parents: string[] = []) => {
        return menuItems.map((item) => {
            const itemPath = getPathname(item.href || '');
            const isActive = currentPath === itemPath;
            const hasChildren = !!item.children?.length;
            const menuKey = getMenuKey(item, parents);
            const isOpen = openMenus[menuKey] || false;

            return (
                <SidebarMenuItem
                    key={menuKey}
                    className={classNames({
                        'pl-1': level === 1,
                        'pl-2': level === 2,
                        'pl-3': level >= 3,
                    })}
                >
                    <div className="flex w-full items-center justify-between">
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={{ children: item.title }}
                            onClick={(e) => {
                                if (hasChildren) {
                                    e.preventDefault();
                                    toggleMenu(menuKey);
                                }
                            }}
                        >
                            <Link href={item.href || '#'} prefetch>
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                <span className="flex-1 truncate text-left">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>

                        {hasChildren && (
                            <button onClick={() => toggleMenu(menuKey)} className="ml-2 focus:outline-none">
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                        )}
                    </div>

                    {hasChildren && isOpen && (
                        <SidebarMenu className="mt-1 ml-2">{renderMenuItems(item.children, level + 1, [...parents, item.title])}</SidebarMenu>
                    )}
                </SidebarMenuItem>
            );
        });
    };

    return (
        <>
            {filteredItems.map((group) => (
                <SidebarGroup key={group.title} className="px-2">
                    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    <SidebarMenu>{renderMenuItems(group.children || [], 0, [group.title])}</SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
};
