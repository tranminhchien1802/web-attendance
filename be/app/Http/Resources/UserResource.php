<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => (string) $this->id,
            'userCode'    => $this->user_code,
            'fullName'    => $this->name,
            'email'       => $this->email,
            'role'        => $this->role === User::ROLE_LECTURER ? 'teacher' : $this->role,
            'phone'       => $this->phone,
            'gender'      => $this->gender,
            'avatar'      => $this->avatar,
            'isActive'    => (bool) $this->is_active,
            'facultyId'   => $this->faculty_id,
            'facultyCode' => $this->faculty?->faculty_code,
            'faculty'     => $this->faculty?->name,
            'department'  => null,
            'major'       => null,
        ];
    }
}