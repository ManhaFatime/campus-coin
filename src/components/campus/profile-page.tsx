import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Shield,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { apiRequest } from "@/services/api";

import {
  FontSizeControl,
  PageHeader,
  Panel,
  PanelHeading,
  ThemeToggle,
} from "./shared";

import { notice } from "./alerts";

type ProfileData = {
  id: number;
  role: "student" | "admin";
  name: string;
  email: string;
  profile_image_url: string | null;
  academic_year: string | null;
  monthly_allowance: number | string;
  monthly_savings_goal: number | string;
  created_at: string;
};

type UploadResponse = {
  success: boolean;
  message: string;
  data: {
    profile_image_url?: string | null;
  };
};

function initials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "CC";
  }

  const firstPart = parts[0] ?? "";
  const lastPart = parts.at(-1) ?? "";

  if (parts.length === 1) {
    return firstPart
      .slice(0, 2)
      .toUpperCase();
  }

  return `${firstPart[0] ?? ""}${lastPart[0] ?? ""}`.toUpperCase();
}

function notifyShell(profile: ProfileData) {
  window.dispatchEvent(
    new CustomEvent(
      "campuscoin:profile-updated",
      {
        detail: {
          name: profile.name,
          profile_image_url:
            profile.profile_image_url,
        },
      },
    ),
  );
}

export function ProfilePage({
  admin = false,
}: {
  admin?: boolean;
}) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [profile, setProfile] =
    useState<ProfileData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  async function loadProfile() {
    try {
      setLoading(true);

      const response =
        await apiRequest<{
          profile: ProfileData;
        }>("/profile/get.php");

      setProfile(
        response.data.profile,
      );

      return response.data.profile;
    } catch (error) {
      await notice(
        "Profile unavailable",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function saveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!profile || saving) {
      return;
    }

    const form =
      new FormData(
        event.currentTarget,
      );

    const name =
      String(
        form.get("name") || "",
      ).trim();

    if (name.length < 2) {
      await notice(
        "Name required",
        "Please enter your full name.",
        "warning",
      );
      return;
    }

    try {
      setSaving(true);

      const payload =
        profile.role === "admin"
          ? {
              name,
            }
          : {
              name,
              academic_year:
                String(
                  form.get(
                    "academic_year",
                  ) || "",
                ).trim(),
              monthly_allowance:
                Number(
                  form.get(
                    "monthly_allowance",
                  ) || 0,
                ),
              monthly_savings_goal:
                Number(
                  form.get(
                    "monthly_savings_goal",
                  ) || 0,
                ),
            };

      const response =
        await apiRequest<{
          profile: ProfileData;
        }>("/profile/update.php", {
          method: "POST",
          body: JSON.stringify(
            payload,
          ),
        });

      setProfile(
        response.data.profile,
      );

      notifyShell(
        response.data.profile,
      );

      await notice(
        "Profile updated",
        "Your profile details have been saved.",
        "success",
      );
    } catch (error) {
      await notice(
        "Unable to update profile",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file || !profile) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      await notice(
        "Unsupported image",
        "Please choose a JPG, PNG, or WebP image.",
        "warning",
      );
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      await notice(
        "Image too large",
        "Profile images must be 3 MB or smaller.",
        "warning",
      );
      return;
    }

    try {
      setUploading(true);

      const body =
        new FormData();

      body.append(
        "profile_image",
        file,
      );

      const httpResponse =
        await fetch(
          "/api/profile/upload-image.php",
          {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
            body,
          },
        );

      const result =
        (await httpResponse.json()) as UploadResponse;

      if (
        !httpResponse.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Profile image could not be uploaded.",
        );
      }

      const nextProfile = {
        ...profile,
        profile_image_url:
          result.data
            .profile_image_url ??
          null,
      };

      setProfile(nextProfile);
      notifyShell(nextProfile);

      await notice(
        "Photo updated",
        "Your new profile photo is now visible across Campus Coin.",
        "success",
      );
    } catch (error) {
      await notice(
        "Upload failed",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isAdmin =
    profile.role === "admin" ||
    admin;

  return (
    <div>
      <PageHeader
        title={
          isAdmin
            ? "Admin Profile"
            : "My Profile"
        }
        subtitle={
          isAdmin
            ? "Manage your administrator identity and profile photo."
            : "Manage your student identity, profile photo, and money preferences."
        }
      />

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative">
              <div className="relative flex size-40 items-center justify-center overflow-hidden rounded-[36px] border border-white/70 bg-sage text-4xl font-extrabold text-primary shadow-[0_22px_55px_rgba(37,78,53,0.16)] ring-1 ring-primary/10 dark:border-primary/20 dark:bg-primary/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
                <span>
                  {initials(
                    profile.name,
                  )}
                </span>

                {profile.profile_image_url && (
                  <img
                    src={
                      profile.profile_image_url
                    }
                    alt={`${profile.name} profile`}
                    className="absolute inset-0 size-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                )}
              </div>

              <button
                type="button"
                disabled={uploading}
                onClick={() =>
                  inputRef.current?.click()
                }
                className="absolute -bottom-2 -right-2 flex size-12 items-center justify-center rounded-2xl border border-white/70 bg-primary text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 dark:border-primary/30"
                aria-label="Change profile photo"
                title="Change profile photo"
              >
                {uploading ? (
                  <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Camera size={19} />
                )}
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={uploadPhoto}
            />

            <h2 className="mt-5 text-xl font-extrabold tracking-[-0.03em]">
              {profile.name}
            </h2>

            <p className="mt-1 max-w-full truncate text-sm text-muted-foreground">
              {profile.email}
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary">
              {isAdmin ? (
                <Shield size={12} />
              ) : (
                <UserRound size={12} />
              )}
              {isAdmin
                ? "Administrator"
                : "Student account"}
            </span>

            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="mt-5 w-full gap-2"
              onClick={() =>
                inputRef.current?.click()
              }
            >
              <ImagePlus size={16} />
              {uploading
                ? "Uploading..."
                : profile.profile_image_url
                  ? "Change Photo"
                  : "Upload Photo"}
            </Button>

            <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
              JPG, PNG, or WebP · Maximum 3 MB. Your photo will appear in the sidebar, header, and other profile areas.
            </p>
          </div>
        </Panel>

        <Panel>
          <PanelHeading
            title="Profile Information"
            action={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
                <CheckCircle2 size={12} />
                Account active
              </span>
            }
          />

          <form
            onSubmit={saveProfile}
            className="grid gap-4 sm:grid-cols-2"
          >
            <label className="text-sm font-semibold">
              Full Name
              <Input
                name="name"
                defaultValue={
                  profile.name
                }
                required
                maxLength={100}
                className="mt-2 h-11"
              />
            </label>

            <label className="text-sm font-semibold">
              Email
              <Input
                value={profile.email}
                readOnly
                className="mt-2 h-11 bg-muted/60"
              />
            </label>

            {!isAdmin && (
              <>
                <label className="text-sm font-semibold">
                  Academic Year
                  <Input
                    name="academic_year"
                    defaultValue={
                      profile.academic_year ??
                      ""
                    }
                    placeholder="e.g. Second Year"
                    className="mt-2 h-11"
                  />
                </label>

                <label className="text-sm font-semibold">
                  Monthly Allowance
                  <Input
                    name="monthly_allowance"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      Number(
                        profile.monthly_allowance,
                      )
                    }
                    className="mt-2 h-11"
                  />
                </label>

                <label className="text-sm font-semibold sm:col-span-2">
                  Monthly Savings Goal
                  <Input
                    name="monthly_savings_goal"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      Number(
                        profile.monthly_savings_goal,
                      )
                    }
                    className="mt-2 h-11"
                  />
                </label>
              </>
            )}

            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="premium-btn min-w-36"
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </Button>

              <p className="text-[11px] text-muted-foreground">
                Email changes are disabled for account security.
              </p>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}

export function SettingsOnlyPage() {
  const [passwordOpen, setPasswordOpen] =
    useState(false);

  const [savingPassword, setSavingPassword] =
    useState(false);

  async function changePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form =
      new FormData(
        event.currentTarget,
      );

    try {
      setSavingPassword(true);

      await apiRequest(
        "/profile/change-password.php",
        {
          method: "POST",
          body: JSON.stringify({
            current_password:
              String(
                form.get(
                  "current_password",
                ) || "",
              ),
            new_password:
              String(
                form.get(
                  "new_password",
                ) || "",
              ),
          }),
        },
      );

      setPasswordOpen(false);

      await new Promise<void>(
        (resolve) => {
          window.setTimeout(
            resolve,
            80,
          );
        },
      );

      await notice(
        "Password changed",
        "Your password has been updated successfully.",
        "success",
      );
    } catch (error) {
      await notice(
        "Unable to change password",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage appearance, accessibility, and account security."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel>
          <PanelHeading title="Appearance & Accessibility" />

          <div className="space-y-6">
            <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
              <p className="text-sm font-bold">
                Theme
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Switch between the Campus Coin light and dark workspace.
              </p>
              <div className="mt-4">
                <ThemeToggle />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
              <p className="text-sm font-bold">
                Text size
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Adjust interface text size for easier reading.
              </p>
              <div className="mt-4">
                <FontSizeControl />
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Security" />

          <div className="rounded-2xl border border-border/70 bg-background/35 p-5">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield size={19} />
            </span>

            <h3 className="mt-4 text-sm font-bold">
              Account password
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Use your current password to securely choose a new password.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={() =>
                setPasswordOpen(true)
              }
            >
              Change Password
            </Button>
          </div>
        </Panel>
      </div>

      <Dialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      >
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={changePassword}
            className="space-y-4"
          >
            <Input
              name="current_password"
              type="password"
              placeholder="Current password"
              required
            />

            <Input
              name="new_password"
              type="password"
              placeholder="New password"
              minLength={8}
              required
            />

            <Button
              type="submit"
              disabled={savingPassword}
              className="w-full"
            >
              {savingPassword
                ? "Updating..."
                : "Change Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
