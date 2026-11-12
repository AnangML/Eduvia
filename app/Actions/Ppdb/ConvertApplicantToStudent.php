<?php

namespace App\Actions\Ppdb;

use App\Actions\Audit\RecordAuditLog;
use App\Actions\Users\CreateUserFromStudent;
use App\Models\Guardian;
use App\Models\PpdbApplicant;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ConvertApplicantToStudent
{
    public function __construct(
        protected CreateUserFromStudent $userCreator,
        protected RecordAuditLog $auditLogger,
    ) {}

    public function execute(PpdbApplicant $applicant, ?User $actor = null): Student
    {
        if ($applicant->converted_to_student_id) {
            return Student::findOrFail($applicant->converted_to_student_id);
        }

        if ($applicant->selection_status !== 'accepted') {
            throw ValidationException::withMessages([
                'applicant' => 'Hanya calon siswa yang dinyatakan "Diterima / Lolos" yang dapat dikonversi menjadi siswa aktif.',
            ]);
        }

        return DB::transaction(function () use ($applicant, $actor) {
            // Generate NIS based on year and sequential number
            $year = now()->format('y'); // e.g. 26
            $nextSeq = (Student::whereYear('created_at', now()->year)->count() + 1);
            $nis = sprintf('%s%04d', $year, $nextSeq);
            while (Student::where('nis', $nis)->exists()) {
                $nextSeq++;
                $nis = sprintf('%s%04d', $year, $nextSeq);
            }

            // Create Student
            $student = Student::create([
                'nisn' => $applicant->nisn,
                'nis' => $nis,
                'nik' => $applicant->nik,
                'full_name' => $applicant->full_name,
                'gender' => $applicant->gender,
                'birth_place' => $applicant->birth_place,
                'birth_date' => $applicant->birth_date,
                'phone_number' => $applicant->phone_number,
                'address' => $applicant->address,
                'status' => 'active',
            ]);

            // Create / link Guardians if provided
            if ($applicant->father_name) {
                $guardian = Guardian::firstOrCreate(
                    [
                        'name' => $applicant->father_name,
                        'phone_number' => $applicant->father_phone ?: $applicant->phone_number,
                    ],
                    [
                        'occupation' => $applicant->father_occupation,
                        'address' => $applicant->address,
                    ]
                );
                $student->guardians()->syncWithoutDetaching([
                    $guardian->id => ['relationship' => 'father', 'is_emergency_contact' => true],
                ]);
            } elseif ($applicant->mother_name) {
                $guardian = Guardian::firstOrCreate(
                    [
                        'name' => $applicant->mother_name,
                        'phone_number' => $applicant->mother_phone ?: $applicant->phone_number,
                    ],
                    [
                        'occupation' => $applicant->mother_occupation,
                        'address' => $applicant->address,
                    ]
                );
                $student->guardians()->syncWithoutDetaching([
                    $guardian->id => ['relationship' => 'mother', 'is_emergency_contact' => true],
                ]);
            } elseif ($applicant->guardian_name) {
                $guardian = Guardian::firstOrCreate(
                    [
                        'name' => $applicant->guardian_name,
                        'phone_number' => $applicant->guardian_phone ?: $applicant->phone_number,
                    ],
                    [
                        'occupation' => $applicant->guardian_occupation,
                        'address' => $applicant->address,
                    ]
                );
                $student->guardians()->syncWithoutDetaching([
                    $guardian->id => ['relationship' => 'guardian', 'is_emergency_contact' => true],
                ]);
            }

            // Generate user login account
            $this->userCreator->execute($student);

            // Update applicant record
            $applicant->update([
                'converted_to_student_id' => $student->id,
                'converted_at' => now(),
                're_registration_status' => 're_registered',
            ]);

            if ($actor) {
                $this->auditLogger->execute(
                    model: $student,
                    event: 'converted_from_ppdb',
                    oldValues: ['ppdb_applicant_id' => $applicant->id],
                    newValues: $student->toArray(),
                    userId: $actor->id
                );
            }

            return $student->fresh(['user', 'guardians']);
        });
    }
}
