<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Video;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class SuperAdminController extends Controller
{
    public function __construct(
        protected Video $video,
        protected User $user,
        protected Listing $listing
    ) {
    }

    public function superAdmin(): Response
    {
        $users = $this->user
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->select('users.*', 'model_has_roles.role_id')
            ->get()
            ->map(function ($user) {
                return [
                    ...$user->toArray(),
                    'role_id' => $user->role_id ?? 3,
                ];
            });

        return Inertia::render('SuperAdmin', [
            'videos' => $this->video->with(['violations' => fn($q) => $q->select('violations.id')])
                ->get()
                ->map(fn($video) => [
                    ...$video->toArray(),
                    'violations' => $video->violations->pluck('id'),
                    'moderated_by' => $video->moderated_by,
                ]),
            'listings' => $this->listing->all(),
            'users' => $users,
            'currentModerator' => auth()->user(),
        ]);
    }

    public function updateStatus(Request $request, Video $video): RedirectResponse
    {
        $moderatedBy = $request->has('moderated_by')
            ? $request->input('moderated_by')
            : auth()->id();

        $video->update([
            'is_approved' => $request->is_approved,
            'moderated_by' => $moderatedBy,
            'updated_at' => now()
        ]);

        $video->violations()->sync($request->violations);

        return back()->with([
            'success' => 'Status updated',
            'videos' => $this->video->with(['violations' => fn($q) => $q->select('violations.id')])
                ->get()
                ->map(fn($video) => [
                    ...$video->toArray(),
                    'violations' => $video->violations->pluck('id'),
                    'moderated_by' => $video->moderated_by,
                ])
        ]);
    }
}