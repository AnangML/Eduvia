<?php

namespace App\Actions\Ppdb;

use App\Models\Setting;

class CalculateZoneScore
{
    /**
     * @return array{zone_score: int, final_score: float}
     */
    public function execute(?string $province, ?string $city, ?string $district, float $averageReportScore = 0.0): array
    {
        $schoolProvince = mb_strtolower(trim(Setting::where('key', 'school_province')->value('value') ?? 'DKI Jakarta'));
        $schoolCity = mb_strtolower(trim(Setting::where('key', 'school_city')->value('value') ?? 'Jakarta Selatan'));
        $schoolDistrict = mb_strtolower(trim(Setting::where('key', 'school_district')->value('value') ?? 'Kebayoran Baru'));

        $applicantProvince = mb_strtolower(trim($province ?? ''));
        $applicantCity = mb_strtolower(trim($city ?? ''));
        $applicantDistrict = mb_strtolower(trim($district ?? ''));

        $zoneScore = 0;

        // Check if district matches (Satu Kelurahan / Kecamatan)
        if (! empty($applicantDistrict) && (str_contains($applicantDistrict, $schoolDistrict) || str_contains($schoolDistrict, $applicantDistrict))) {
            $zoneScore = 3;
        } elseif (! empty($applicantCity) && (str_contains($applicantCity, $schoolCity) || str_contains($schoolCity, $applicantCity))) {
            $zoneScore = 2; // Satu Kota / Kabupaten
        } elseif (! empty($applicantProvince) && (str_contains($applicantProvince, $schoolProvince) || str_contains($schoolProvince, $applicantProvince))) {
            $zoneScore = 1; // Satu Provinsi
        }

        // Final score formula: (Zone Score * 100) + Average Report Score
        $finalScore = round(($zoneScore * 100) + $averageReportScore, 2);

        return [
            'zone_score' => $zoneScore,
            'final_score' => $finalScore,
        ];
    }
}
