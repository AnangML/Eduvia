export interface User {
    id: number;
    name: string;
    email: string;
    username?: string;
    phone_number?: string;
    avatar_url?: string;
    email_verified_at?: string;
    roles?: string[];
    permissions?: string[];
}

export interface SchoolInfo {
    name: string;
    level: string;
    tagline?: string;
    logo?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    school?: SchoolInfo;
    flash?: {
        success?: string;
        error?: string;
    };
};
