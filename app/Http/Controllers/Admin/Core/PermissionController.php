<?php

namespace App\Http\Controllers\Admin\Core;

use App\Models\Role;
use Inertia\Inertia;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = [];

        return Inertia::render('admin/core/permissions/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();

        $data = [
            'roles' => $roles
        ];

        return Inertia::render('admin/core/permissions/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request)
    {
        $permission = Permission::create([
            'name' => $request->name,
        ]);

        if ($request->saveBack) {
            return redirect()->route('permissions.index')->with('success', 'Permission created successfully');
        }

        return redirect()->back()->with('success', 'Permission created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        $findData = Permission::find($permission->id);

        $data = [
            'permission' => $findData,
        ];

        return Inertia::render('admin/core/permissions/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        $findData = Permission::with(['roles'])->find($permission->id);

        $data = [
            'permission' => $findData,
        ];

        return Inertia::render('admin/core/permissions/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $permission->update([
            'name' => $request->name,
        ]);

        if ($request->saveBack) {
            return redirect()->route('permissions.index')->with('success', 'Permission updated successfully');
        }

        return redirect()->back()->with('success', 'Permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(permission $permission)
    {
        $permission->delete();

        return redirect()->route('permissions.index')->with('success', 'permission deleted successfully');
    }

    public function getData(Request $request)
    {
        $perPage = $request->input('perPage', null);
        $page = $request->input('page', null);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = permission::query()
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
