<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Teacher;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SchoolProfileSeeder;
use Database\Seeders\SettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SettingSeeder::class);
        $this->seed(SchoolProfileSeeder::class);
    }

    public function test_public_home_page_renders_successfully(): void
    {
        $response = $this->get(route('home'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->has('profile.school_name')
            ->has('posts')
            ->has('facilities')
            ->has('stats')
        );
    }

    public function test_public_about_page_renders_successfully(): void
    {
        $response = $this->get(route('public.about'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/About')
            ->has('profile.school_vision')
            ->has('profile.school_mission')
        );
    }

    public function test_public_facilities_page_lists_active_facilities(): void
    {
        $response = $this->get(route('public.facilities'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Facilities/Index')
            ->has('facilities')
        );
    }

    public function test_public_teachers_page_only_lists_public_teachers(): void
    {
        $publicTeacher = Teacher::create([
            'name' => 'Guru Publik',
            'nip' => '198001012005011001',
            'gender' => 'L',
            'employment_status' => 'PNS',
            'is_active' => true,
            'is_public' => true,
        ]);

        $privateTeacher = Teacher::create([
            'name' => 'Guru Privat',
            'nip' => '198001012005011002',
            'gender' => 'L',
            'employment_status' => 'PNS',
            'is_active' => true,
            'is_public' => false,
        ]);

        $response = $this->get(route('public.teachers'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Teachers/Index')
            ->where('teachers.data', fn ($teachers) => collect($teachers)->contains('id', $publicTeacher->id)
                && ! collect($teachers)->contains('id', $privateTeacher->id))
        );
    }

    public function test_public_galleries_page_renders_albums(): void
    {
        $response = $this->get(route('public.galleries'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Galleries/Index')
            ->has('albums.data')
        );
    }

    public function test_public_posts_index_and_category_filter(): void
    {
        $response = $this->get(route('public.posts.index', ['category' => 'news']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Posts/Index')
            ->where('filters.category', 'news')
            ->has('posts.data')
        );
    }

    public function test_public_post_detail_renders_and_increments_views(): void
    {
        $post = Post::published()->first();
        $initialViews = $post->views_count;

        $response = $this->get(route('public.posts.show', $post->slug));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Posts/Show')
            ->where('post.id', $post->id)
        );

        $this->assertEquals($initialViews + 1, $post->fresh()->views_count);
    }

    public function test_draft_post_cannot_be_viewed_by_public(): void
    {
        $draft = Post::create([
            'title' => 'Draft Rahasia',
            'slug' => 'draft-rahasia',
            'category' => 'news',
            'content' => 'Belum boleh terbit',
            'status' => 'draft',
        ]);

        $response = $this->get(route('public.posts.show', $draft->slug));

        $response->assertStatus(404);
    }

    public function test_guest_can_submit_contact_form(): void
    {
        $payload = [
            'name' => 'Wali Calon Siswa',
            'email' => 'wali@gmail.com',
            'phone' => '08123456789',
            'subject' => 'Tanya Jadwal PPDB',
            'message' => 'Kapan pendaftaran gelombang kedua dibuka?',
        ];

        $response = $this->post(route('public.contact.submit'), $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('contact_messages', [
            'email' => 'wali@gmail.com',
            'subject' => 'Tanya Jadwal PPDB',
            'is_read' => false,
        ]);
    }

    public function test_contact_form_validates_required_fields(): void
    {
        $response = $this->post(route('public.contact.submit'), [
            'name' => '',
            'email' => 'not-an-email',
            'subject' => '',
            'message' => '',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    }
}
