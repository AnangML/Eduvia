<?php

namespace App\Actions\Ppdb;

use App\Actions\Audit\RecordAuditLog;
use App\Models\PpdbApplicant;
use App\Models\User;

class VerifyApplicant
{
    public function __construct(
        protected CalculateZoneScore $calculator,
        protected RecordAuditLog $auditLogger,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(PpdbApplicant $applicant, array $data, User $actor): PpdbApplicant
    {
        $oldValues = $applicant->toArray();

        $status = $data['verification_status']; // verified, needs_revision, rejected
        $notes = $data['verification_notes'] ?? null;

        $updates = [
            'verification_status' => $status,
            'verification_notes' => $notes,
            'verified_by' => $actor->id,
            'verified_at' => now(),
        ];

        // If report score or distance score was corrected during verification
        if (isset($data['average_report_score']) || isset($data['distance_zone_score'])) {
            $averageReport = isset($data['average_report_score'])
                ? (float) $data['average_report_score']
                : (float) $applicant->average_report_score;

            $zoneScore = isset($data['distance_zone_score'])
                ? (int) $data['distance_zone_score']
                : (int) $applicant->distance_zone_score;

            $updates['average_report_score'] = $averageReport;
            $updates['distance_zone_score'] = $zoneScore;
            $updates['final_score'] = round(($zoneScore * 100) + $averageReport, 2);
        }

        $applicant->update($updates);

        $this->auditLogger->execute(
            model: $applicant,
            event: 'verified',
            oldValues: $oldValues,
            newValues: $applicant->fresh()->toArray(),
            userId: $actor->id
        );

        return $applicant;
    }
}
