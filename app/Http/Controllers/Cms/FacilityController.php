<?php

namespace App\Http\Controllers\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Actions\Cms\SaveFacility;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\FacilityRequest;
use App\Models\Facility;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function index(): Response
    {
        $facilities = Facility::orderBy('order', 'asc')->paginate(10);

        return Inertia::render('Cms/Facilities/Index', [
            'facilities' => $facilities,
        ]);
    }

    public function store(FacilityRequest $request, SaveFacility $action): RedirectResponse
    {
        $action->execute($request->validated(), null, $request->user());

        return back()->with('success', 'Fasilitas berhasil ditambahkan.');
    }

    public function update(FacilityRequest $request, Facility $facility, SaveFacility $action): RedirectResponse
    {
        $action->execute($request->validated(), $facility, $request->user());

        return back()->with('success', 'Fasilitas berhasil diperbarui.');
    }

    public function destroy(Request $request, Facility $facility): RedirectResponse
    {
        $oldData = $facility->toArray();
        $facility->delete();

        if ($request->user()) {
            app(RecordAuditLog::class)->execute(
                model: $facility,
                event: 'deleted',
                oldValues: $oldData,
                newValues: [],
                userId: $request->user()->id
            );
        }

        return back()->with('success', 'Fasilitas berhasil dihapus.');
    }
}
