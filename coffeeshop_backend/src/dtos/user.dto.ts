export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Sprint 3: profile update — any subset of fields + optional new avatar filename.
export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  avatar?: string; // filename produced by multer
}

// Sprint 3: password change verified against the current password.
export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

// Shape sent back to the client — never includes the password hash.
export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  avatar: string | null; // full proxied URL or null
  createdAt: Date;
  updatedAt: Date;
}
