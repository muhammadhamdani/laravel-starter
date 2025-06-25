<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

// Dashboard (root)
Breadcrumbs::for('dashboard', function (BreadcrumbTrail $trail) {
    $trail->push('Admin', route('dashboard'));
});

// Users
Breadcrumbs::for(
    'users.index',
    fn($trail) =>
    $trail->parent('dashboard')->push('Users', route('users.index'))
);

Breadcrumbs::for(
    'users.create',
    fn($trail) =>
    $trail->parent('users.index')->push('Create', route('users.create'))
);

Breadcrumbs::for(
    'users.show',
    fn($trail, $user) =>
    $trail->parent('users.index')->push($user->name, route('users.show', $user))
);

Breadcrumbs::for(
    'users.edit',
    fn($trail, $user) =>
    $trail->parent('users.show', $user)->push('Edit', route('users.edit', $user))
);

Breadcrumbs::for(
    'users.data',
    fn($trail) =>
    $trail->parent('users.index')->push('Users Data', route('users.data'))
);

// Permissions
Breadcrumbs::for(
    'permissions.index',
    fn($trail) =>
    $trail->parent('dashboard')->push('Permissions', route('permissions.index'))
);

Breadcrumbs::for(
    'permissions.create',
    fn($trail) =>
    $trail->parent('permissions.index')->push('Create', route('permissions.create'))
);

Breadcrumbs::for(
    'permissions.show',
    fn($trail, $permission) =>
    $trail->parent('permissions.index')->push($permission->name, route('permissions.show', $permission))
);

Breadcrumbs::for(
    'permissions.edit',
    fn($trail, $permission) =>
    $trail->parent('permissions.show', $permission)->push('Edit', route('permissions.edit', $permission))
);

Breadcrumbs::for(
    'permissions.data',
    fn($trail) =>
    $trail->parent('permissions.index')->push('Permissions Data', route('permissions.data'))
);

// Roles
Breadcrumbs::for(
    'roles.index',
    fn($trail) =>
    $trail->parent('dashboard')->push('Roles', route('roles.index'))
);

Breadcrumbs::for(
    'roles.create',
    fn($trail) =>
    $trail->parent('roles.index')->push('Create', route('roles.create'))
);

Breadcrumbs::for(
    'roles.show',
    fn($trail, $permission) =>
    $trail->parent('roles.index')->push($permission->name, route('roles.show', $permission))
);

Breadcrumbs::for(
    'roles.edit',
    fn($trail, $permission) =>
    $trail->parent('roles.show', $permission)->push('Edit', route('roles.edit', $permission))
);

Breadcrumbs::for(
    'roles.data',
    fn($trail) =>
    $trail->parent('roles.index')->push('roles Data', route('roles.data'))
);

Breadcrumbs::for(
    'roles.access',
    fn($trail) =>
    $trail->parent('roles.index')->push('Roles Access', route('roles.access'))
);
