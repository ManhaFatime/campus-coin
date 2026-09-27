import { apiRequest } from "./api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
  academic_year?: string | null;
  monthly_allowance?: number;
  monthly_savings_goal?: number;
  created_at?: string;
};

type AuthData = {
  user: AuthUser;
};

export const authService = {
  login(email: string, password: string) {
    return apiRequest<AuthData>("/auth/login.php", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  adminLogin(email: string, password: string) {
    return apiRequest<AuthData>("/auth/admin-login.php", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  register(data: {
    name: string;
    email: string;
    password: string;
    academic_year: string;
  }) {
    return apiRequest<AuthData>("/auth/register.php", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        monthly_allowance: 0,
        monthly_savings_goal: 0,
      }),
    });
  },

  me() {
    return apiRequest<AuthData>("/auth/me.php");
  },

  logout() {
    return apiRequest("/auth/logout.php", {
      method: "POST",
    });
  },

  forgotPassword(email: string) {
    return apiRequest<{ development_reset_token?: string }>(
      "/auth/forgot-password.php",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
    );
  },
};