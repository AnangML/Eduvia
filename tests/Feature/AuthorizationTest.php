<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_super_admin_can_access_protected_settings_route(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $response = $this->actingAs($admin)->get('/settings');

        $response->assertStatus(200);
        $response->assertJson(['status' => 'authorized']);
    }

    public function test_non_super_admin_gets_forbidden_status_on_protected_settings(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $response = $this->actingAs($student)->get('/settings');

        $response->assertStatus(403);
    }

    public function test_guest_is_redirected_to_login_on_protected_routes(): void
    {
        $response = $this->get('/settings');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_access_dashboard(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }
}
