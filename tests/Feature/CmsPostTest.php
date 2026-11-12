<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CmsPostTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SettingSeeder::class);

        $this->admin = User::create([
            'name' => 'Admin Humas',
            'email' => 'admin@eduvia.test',
            'username' => 'adminhumas',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->admin->assignRole('admin');

        $this->student = User::create([
            'name' => 'Siswa Belajar',
            'email' => 'siswa@eduvia.test',
            'username' => 'siswabelajar',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->student->assignRole('student');
    }

    public function test_guest_is_redirected_from_cms(): void
    {
        $response = $this->get(route('cms.posts.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_unauthorized_user_cannot_access_cms(): void
    {
        $response = $this->actingAs($this->student)->get(route('cms.posts.index'));

        $response->assertStatus(403);
    }

    public function test_admin_can_view_cms_posts(): void
    {
        Post::create([
            'title' => 'Berita Pembuka',
            'slug' => 'berita-pembuka',
            'category' => 'news',
            'content' => 'Isi berita pembuka',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->get(route('cms.posts.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Cms/Posts/Index')
            ->has('posts.data')
        );
    }

    public function test_admin_can_create_post_with_auto_slug_and_audit(): void
    {
        $payload = [
            'title' => 'Inovasi Panel Surya SMK Eduvia',
            'category' => 'news',
            'content' => 'Siswa jurusan teknik berhasil menciptakan panel surya portabel.',
            'excerpt' => 'Inovasi energi terbarukan siswa sekolah.',
            'status' => 'published',
        ];

        $response = $this->actingAs($this->admin)->post(route('cms.posts.store'), $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('posts', [
            'title' => 'Inovasi Panel Surya SMK Eduvia',
            'slug' => 'inovasi-panel-surya-smk-eduvia',
            'category' => 'news',
            'status' => 'published',
            'author_id' => $this->admin->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'event' => 'created',
            'auditable_type' => Post::class,
        ]);
    }

    public function test_admin_can_update_post(): void
    {
        $post = Post::create([
            'title' => 'Judul Sebelum Revisi',
            'slug' => 'judul-sebelum-revisi',
            'category' => 'announcement',
            'content' => 'Konten lama',
            'status' => 'draft',
        ]);

        $payload = [
            'title' => 'Judul Sesudah Revisi',
            'category' => 'announcement',
            'content' => 'Konten baru yang disempurnakan',
            'excerpt' => 'Ringkasan baru',
            'status' => 'published',
        ];

        $response = $this->actingAs($this->admin)->put(route('cms.posts.update', $post->id), $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Judul Sesudah Revisi',
            'slug' => 'judul-sesudah-revisi',
            'status' => 'published',
        ]);
    }

    public function test_admin_can_soft_delete_post(): void
    {
        $post = Post::create([
            'title' => 'Konten yang Akan Dihapus',
            'slug' => 'konten-yang-akan-dihapus',
            'category' => 'news',
            'content' => 'Isi artikel',
            'status' => 'published',
        ]);

        $response = $this->actingAs($this->admin)->delete(route('cms.posts.destroy', $post->id));

        $response->assertSessionHas('success');
        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }
}
