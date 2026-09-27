import { apiRequest } from "./api";

export type ProfileRecord = {
  id: number;
  name: string;
  email: string;
  academic_year: string | null;
  monthly_allowance: number | string;
  monthly_savings_goal: number | string;
  created_at: string;
};

export const profileService = {
  get() {
    return apiRequest<{
      profile: ProfileRecord;
    }>("/profile/get.php");
  },

  update(data: {
    name: string;
    academic_year: string;
    monthly_allowance: number;
    monthly_savings_goal: number;
  }) {
    return apiRequest("/profile/update.php", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  changePassword(data: {
    current_password: string;
    new_password: string;
  }) {
    return apiRequest(
      "/profile/change-password.php",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },
};