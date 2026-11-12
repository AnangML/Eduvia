<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\Facility;
use App\Models\Gallery;
use App\Models\GalleryAlbum;
use App\Models\Setting;
use App\Models\Teacher;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CmsProfileTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SettingSeeder::class);

        $this->admin = User::create([
            'name' => 'Admin Sekolah',
            'email' => 'admin@eduvia.test',
            'username' => 'adminsekolah',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $this->admin->assignRole('admin');
    }

    public function test_admin_can_view_and_update_school_profile(): void
    {
        $response = $this->actingAs($this->admin)->get(route('cms.school-profile.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Cms/SchoolProfile/Index')
            ->has('profile.school_name')
        );

        $updateData = [
            'school_name' => 'SMK Eduvia Unggulan Baru',
            'school_tagline' => 'Motto Terkini Masa Depan',
            'school_vision' => 'Visi masa depan yang terukur',
            'school_mission' => "1. Misi kesatu\n2. Misi kedua",
            'school_address' => 'Jl. Merdeka No. 1',
            'school_phone' => '021-123456',
            'school_email' => 'sekolah@eduvia.sch.id',
        ];

        $putResponse = $this->actingAs($this->admin)->put(route('cms.school-profile.update'), $updateData);

        $putResponse->assertSessionHas('success');
        $this->assertEquals('SMK Eduvia Unggulan Baru', Setting::get('school_name'));
        $this->assertEquals('Motto Terkini Masa Depan', Setting::get('school_tagline'));
    }

    public function test_admin_can_manage_facilities(): void
    {
        // 1. Create Facility
        $createResponse = $this->actingAs($this->admin)->post(route('cms.facilities.store'), [
            'name' => 'Laboratorium Robotika',
            'description' => 'Fasilitas pembelajaran robotik dan IoT.',
            'order' => 1,
            'is_active' => true,
        ]);

        $createResponse->assertSessionHas('success');
        $this->assertDatabaseHas('facilities', [
            'name' => 'Laboratorium Robotika',
            'slug' => 'laboratorium-robotika',
        ]);

        $facility = Facility::where('slug', 'laboratorium-robotika')->first();

        // 2. Update Facility
        $updateResponse = $this->actingAs($this->admin)->put(route('cms.facilities.update', $facility->id), [
            'name' => 'Laboratorium Robotika & AI',
            'description' => 'Fasilitas IoT dan kecerdasan buatan.',
            'order' => 2,
            'is_active' => true,
        ]);

        $updateResponse->assertSessionHas('success');
        $this->assertDatabaseHas('facilities', [
            'id' => $facility->id,
            'name' => 'Laboratorium Robotika & AI',
        ]);

        // 3. Delete Facility
        $deleteResponse = $this->actingAs($this->admin)->delete(route('cms.facilities.destroy', $facility->id));

        $deleteResponse->assertSessionHas('success');
        $this->assertDatabaseMissing('facilities', ['id' => $facility->id]);
    }

    public function test_admin_can_manage_gallery_albums(): void
    {
        // 1. Create Album
        $createResponse = $this->actingAs($this->admin)->post(route('cms.galleries.store'), [
            'title' => 'Lomba Futsal Antar Sekolah',
            'description' => 'Turnamen futsal piala kemerdekaan.',
            'order' => 1,
            'is_active' => true,
        ]);

        $createResponse->assertSessionHas('success');
        $this->assertDatabaseHas('gallery_albums', [
            'title' => 'Lomba Futsal Antar Sekolah',
            'slug' => 'lomba-futsal-antar-sekolah',
        ]);

        $album = GalleryAlbum::where('slug', 'lomba-futsal-antar-sekolah')->first();

        // 2. Add Photo to Album
        $addPhotoResponse = $this->actingAs($this->admin)->put(route('cms.galleries.update', $album->id), [
            'title' => $album->title,
            'photos' => [
                [
                    'image_path' => 'https://example.com/futsal.jpg',
                    'title' => 'Gol Kemenangan',
                    'caption' => 'Momen terciptanya gol penentu.',
                ],
            ],
        ]);

        $addPhotoResponse->assertSessionHas('success');
        $this->assertDatabaseHas('galleries', [
            'album_id' => $album->id,
            'title' => 'Gol Kemenangan',
        ]);

        $photo = Gallery::where('album_id', $album->id)->first();

        // 3. Delete Photo
        $deletePhotoResponse = $this->actingAs($this->admin)->delete(route('cms.galleries.photos.destroy', $photo->id));
        $deletePhotoResponse->assertSessionHas('success');
        $this->assertDatabaseMissing('galleries', ['id' => $photo->id]);

        // 4. Delete Album
        $deleteAlbumResponse = $this->actingAs($this->admin)->delete(route('cms.galleries.destroy', $album->id));
        $deleteAlbumResponse->assertSessionHas('success');
        $this->assertDatabaseMissing('gallery_albums', ['id' => $album->id]);
    }

    public function test_admin_can_view_and_mark_messages_as_read(): void
    {
        $message = ContactMessage::create([
            'name' => 'Penanya Umum',
            'email' => 'tanya@gmail.com',
            'subject' => 'Pertanyaan Kerjasama Magang',
            'message' => 'Apakah perusahaan kami bisa mengajukan kemitraan magang?',
            'is_read' => false,
        ]);

        $indexResponse = $this->actingAs($this->admin)->get(route('cms.messages.index'));

        $indexResponse->assertStatus(200);
        $indexResponse->assertInertia(fn (Assert $page) => $page
            ->component('Cms/Messages/Index')
            ->has('messages.data')
        );

        $readResponse = $this->actingAs($this->admin)->post(route('cms.messages.read', $message->id));

        $readResponse->assertSessionHas('success');
        $this->assertTrue($message->fresh()->is_read);
        $this->assertNotNull($message->fresh()->read_at);
    }

    public function test_admin_can_toggle_teacher_public_visibility(): void
    {
        $teacher = Teacher::create([
            'name' => 'Drs. Hendro Wibowo',
            'nip' => '197501012000011001',
            'gender' => 'L',
            'employment_status' => 'PNS',
            'is_active' => true,
            'is_public' => false,
        ]);

        $this->assertFalse($teacher->is_public);

        // Toggle to true
        $response1 = $this->actingAs($this->admin)->post(route('academic.teachers.toggle-public', $teacher->id));
        $response1->assertSessionHas('success');
        $this->assertTrue($teacher->fresh()->is_public);

        // Toggle back to false
        $response2 = $this->actingAs($this->admin)->post(route('academic.teachers.toggle-public', $teacher->id));
        $response2->assertSessionHas('success');
        $this->assertFalse($teacher->fresh()->is_public);
    }
}
