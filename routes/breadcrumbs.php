<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

Breadcrumbs::for('home', function (BreadcrumbTrail $trail) {
    $trail->push('Home', route('home'));
});

require __DIR__ . '/breadcrumbs/auth-breadcrumbs.php';
require __DIR__ . '/breadcrumbs/admin-breadcrumbs.php';
