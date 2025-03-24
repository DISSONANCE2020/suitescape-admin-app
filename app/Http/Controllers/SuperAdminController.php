<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Video;
use App\Models\Listing;
use App\Models\Booking;
use App\Models\User;
use App\Models\ActiveSessions;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class SuperAdminController extends Controller
{
    public function __construct(
        protected Video $video,
        protected User $user,
        protected Listing $listing,
        protected Booking $booking,
        protected ActiveSessions $activeSessions
    ) {
    }

    public function superAdmin(): Response
    {
        $users = $this->user
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->select('users.*', 'model_has_roles.role_id')
            ->get()
            ->map(fn($user) => [
                    ...$user->toArray(),
                    'role_id' => $user->role_id ?? 3,
            ]);

            $videos = $this->video->with(['violations' => fn($q) => $q->select('violations.id')])
            ->get()
            ->map(fn($video) => [
                ...$video->toArray(),
                'violations' => $video->violations->pluck('id'),
                'moderated_by' => $video->moderated_by,
            ]);

        return Inertia::render('SuperAdmin', [
            'videos' => $videos,
            'listings' => $this->listing->all(),
            'bookings' => $this->booking->all(),
            'users' => $users,
            'activeSessions' => $this->activeSessions->all(),
            'currentModerator' => auth()->user(),
        ]);
    }

    public function updateStatus(Request $request, Video $video): RedirectResponse
    {
        $moderatedBy = $request->input('moderated_by', auth()->id());

        $video->update([
            'is_approved' => $request->is_approved,
            'moderated_by' => $moderatedBy,
            'updated_at' => now()
        ]);

        $video->violations()->sync($request->violations);

        return back()->with([
            'success' => 'Status updated',
            'videos' => $this->video
                ->with(['violations' => fn($q) => $q->select('violations.id')])
                ->get()
                ->map(fn($video) => [
                    ...$video->toArray(),
                    'violations' => $video->violations->pluck('id'),
                    'moderated_by' => $video->moderated_by,
                ])
        ]);
    }
}