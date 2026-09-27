import { redirect } from "@tanstack/react-router";
import { authService } from "@/services/authService";

/**
 * Protects pages that are only available to students.
 */
export async function requireStudent() {
  try {
    const response = await authService.me();

    if (response.data.user.role !== "student") {
      throw redirect({
        to: "/login",
      });
    }

    return response.data.user;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "isRedirect" in error
    ) {
      throw error;
    }

    throw redirect({
      to: "/login",
    });
  }
}


/**
 * Protects pages that are only available to administrators.
 */
export async function requireAdmin() {
  try {
    const response = await authService.me();

    if (response.data.user.role !== "admin") {
      throw redirect({
        to: "/admin/login",
      });
    }

    return response.data.user;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "isRedirect" in error
    ) {
      throw error;
    }

    throw redirect({
      to: "/admin/login",
    });
  }
}