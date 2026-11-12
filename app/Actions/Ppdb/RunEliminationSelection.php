<?php

namespace App\Actions\Ppdb;

use App\Actions\Audit\RecordAuditLog;
use App\Models\PpdbApplicant;
use App\Models\PpdbPeriod;
use App\Models\PpdbTrack;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RunEliminationSelection
{
    public function __construct(
        protected RecordAuditLog $auditLogger,
    ) {}

    /**
     * @return array{
     *     total_processed: int,
     *     accepted_count: int,
     *     waiting_list_count: int,
     *     rejected_count: int,
     * }
     */
    public function execute(
        PpdbPeriod $period,
        ?PpdbTrack $track = null,
        ?int $departmentId = null,
        ?User $actor = null
    ): array {
        return DB::transaction(function () use ($period, $track, $departmentId, $actor) {
            $tracksToProcess = $track ? collect([$track]) : $period->tracks;

            $totalProcessed = 0;
            $acceptedTotal = 0;
            $waitingTotal = 0;
            $rejectedTotal = 0;

            foreach ($tracksToProcess as $currentTrack) {
                $query = PpdbApplicant::where('period_id', $period->id)
                    ->where('track_id', $currentTrack->id)
                    ->where('verification_status', 'verified');

                if ($departmentId) {
                    $query->where('department_id', $departmentId);
                }

                // Sorting based on elimination priority:
                // 1. Final score DESC (Zone Score * 100 + Average Report Score)
                // 2. Distance zone score DESC
                // 3. Average report score DESC
                // 4. Earliest registration date ASC
                $applicants = $query
                    ->orderByDesc('final_score')
                    ->orderByDesc('distance_zone_score')
                    ->orderByDesc('average_report_score')
                    ->orderBy('created_at', 'asc')
                    ->get();

                $quota = $currentTrack->quota > 0 ? $currentTrack->quota : 30;
                $waitingLimit = max(5, (int) round($quota * 0.2)); // 20% waiting list

                $rank = 1;
                foreach ($applicants as $applicant) {
                    $oldValues = $applicant->toArray();

                    if ($rank <= $quota) {
                        $selectionStatus = 'accepted';
                        $acceptedTotal++;
                    } elseif ($rank <= ($quota + $waitingLimit)) {
                        $selectionStatus = 'waiting_list';
                        $waitingTotal++;
                    } else {
                        $selectionStatus = 'rejected';
                        $rejectedTotal++;
                    }

                    $applicant->update([
                        'ranking' => $rank,
                        'selection_status' => $selectionStatus,
                    ]);

                    $totalProcessed++;
                    $rank++;

                    if ($actor) {
                        $this->auditLogger->execute(
                            model: $applicant,
                            event: 'selection_evaluated',
                            oldValues: $oldValues,
                            newValues: $applicant->fresh()->toArray(),
                            userId: $actor->id
                        );
                    }
                }
            }

            return [
                'total_processed' => $totalProcessed,
                'accepted_count' => $acceptedTotal,
                'waiting_list_count' => $waitingTotal,
                'rejected_count' => $rejectedTotal,
            ];
        });
    }
}
