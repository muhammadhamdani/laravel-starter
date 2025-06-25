<?php

namespace App\Http\Controllers\Admin\Core;

use App\Models\Role;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = [];

        return Inertia::render('admin/core/roles/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::all();

        $data = [
            'permissions' => $permissions
        ];

        return Inertia::render('admin/core/roles/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
        ]);

        $role->permissions()->sync($request->permissions);

        if ($request->saveBack) {
            return redirect()->route('roles.index')->with('success', 'Role created successfully');
        }

        return redirect()->back()->with('success', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $findData = Role::with(['permissions'])->find($role->id);

        $data = [
            'role' => $findData,
        ];

        return Inertia::render('admin/core/roles/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::all();

        $findData = Role::with(['permissions'])->find($role->id);

        $data = [
            'role' => $findData,
            'permissions' => $permissions
        ];

        return Inertia::render('admin/core/roles/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update([
            'name' => $request->name,
        ]);

        $role->permissions()->sync($request->permissions);

        if ($request->saveBack) {
            return redirect()->route('roles.index')->with('success', 'Role updated successfully');
        }

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully');
    }

    public function manageAccessRole()
    {
        $roles = Role::all();
        $permissions = Permission::all();

        $data = [
            'roles' => $roles,
            'permissions' => $permissions
        ];

        return Inertia::render('admin/core/roles/access', $data);
    }

    public function assignAccessRole(Request $request)
    {
        $role = Role::find($request->role_id);
        $role->permissions()->sync($request->permissions);

        return redirect()->route('roles.access')->with('success', 'Role permissions updated successfully');
    }

    public function getData(Request $request)
    {
        $perPage = $request->input('perPage', null);
        $page = $request->input('page', null);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = Role::query()
            ->latest()
            ->when($globalSearch, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->orderBy($orderBy, $orderDirection);

        if ($perPage) {
            $data = $query->paginate($perPage, ['*'], 'page', $page);
        } else {
            $data = $query->get();
        }

        return response()->json($data);
    }
}
