import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Users,
  UserCheck,
  ReceiptText,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Ban,
  RotateCcw,
  Megaphone,
  Lightbulb,
  Plus,
  CheckCircle2,
  XCircle,
  Activity,
  CircleDollarSign,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  PageHeader,
  Panel,
  PanelHeading,
  EmptyState,
} from "./shared";

import {
  notice,
  confirmAction,
} from "./alerts";

import {
  adminService,
  type AdminUserRecord,
  type AdminContentRecord,
} from "@/services/adminService";

/* Shared helpers */

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const money = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* Admin dashboard */

export function AdminDashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [summary, setSummary] =
    useState({
      total_users: 0,
      active_users: 0,
      total_transactions: 0,
      new_users_this_month: 0,
    });

  const [growth, setGrowth] =
    useState<
      Array<{
        month: string;
        users: number | string;
      }>
    >([]);

  const [categories, setCategories] =
    useState<
      Array<{
        name: string;
        usage_count: number | string;
        total_amount: number | string;
      }>
    >([]);

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await adminService.dashboard();

        setSummary(
          response.data.summary,
        );

        setGrowth(
          response.data.user_growth,
        );

        setCategories(
          response.data
            .most_used_categories,
        );
      } catch (error) {
        await notice(
          "Admin dashboard unavailable",
          error instanceof Error
            ? error.message
            : "Unable to load administrator data.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="admin-dashboard-premium flex min-h-[460px] items-center justify-center">
        <div className="admin-dashboard-loader text-center">
          <div className="admin-dashboard-loader-ring mx-auto" />

          <p className="mt-4 text-sm font-semibold text-foreground">
            Preparing administrator workspace
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Loading live Campus Coin activity...
          </p>
        </div>
      </div>
    );
  }

  const activeRate =
    Number(summary.total_users) > 0
      ? Math.round(
        (
          Number(summary.active_users) /
          Number(summary.total_users)
        ) *
        100,
      )
      : 0;

  const growthData =
    growth.map((item) => ({
      month: item.month,
      users: Number(
        item.users,
      ),
    }));

  const latestGrowth =
    growthData.at(-1)?.users ??
    0;

  const previousGrowth =
    growthData.at(-2)?.users ??
    0;

  const growthDelta =
    latestGrowth -
    previousGrowth;

  const categoryChart =
    categories
      .filter(
        (item) =>
          Number(
            item.usage_count,
          ) > 0,
      )
      .map((item) => ({
        name: item.name,
        value: Number(
          item.usage_count,
        ),
        amount: Number(
          item.total_amount,
        ),
      }));

  const totalCategoryUsage =
    categoryChart.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.value,
      0,
    );

  const topCategory =
    categoryChart.at(0);

  const cards = [
    {
      label: "Total Users",
      value:
        summary.total_users,
      icon: Users,
      detail:
        "Registered student accounts",
      tone:
        "admin-kpi-green",
    },
    {
      label: "Active Users",
      value:
        summary.active_users,
      icon: UserCheck,
      detail:
        `${activeRate}% of all accounts active`,
      tone:
        "admin-kpi-blue",
    },
    {
      label: "Transactions",
      value:
        summary.total_transactions,
      icon: ReceiptText,
      detail:
        "Recorded platform entries",
      tone:
        "admin-kpi-coral",
    },
    {
      label: "New This Month",
      value:
        summary.new_users_this_month,
      icon: UserPlus,
      detail:
        "New student registrations",
      tone:
        "admin-kpi-violet",
    },
  ];

  return (
    <div className="admin-dashboard-premium">
      <PageHeader
        title="Overview"
        subtitle="Monitor live Campus Coin activity, student growth, transaction volume, and category usage."
        action={
          <div className="admin-live-pill">
            <span className="admin-live-dot" />

            <span>
              Live database
            </span>
          </div>
        }
      />

      {/* Key metrics */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          (card) => (
            <Panel
              key={
                card.label
              }
              className={`admin-kpi-card ${card.tone}`}
            >
              <div className="admin-kpi-glow" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="admin-kpi-icon">
                    <card.icon
                      size={19}
                    />
                  </span>

                  <span className="admin-kpi-status">
                    Live
                  </span>
                </div>

                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {card.label}
                </p>

                <strong className="mt-2 block text-[32px] font-extrabold leading-none tracking-[-0.04em] text-foreground">
                  {Number(
                    card.value,
                  ).toLocaleString()}
                </strong>

                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {card.detail}
                </p>
              </div>
            </Panel>
          ),
        )}
      </section>

      {/* Dashboard analytics */}

      <section className="mt-5 grid items-start gap-5 xl:grid-cols-[1.55fr_0.85fr]">

        {/* User Growth */}

        <Panel className="admin-analytics-panel">
          <PanelHeading
            title="User Growth"
            action={
              <span className="admin-panel-chip">
                Last 6 months
              </span>
            }
          />

          {growthData.length ? (
            <>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <div className="admin-mini-stat">
                  <p>
                    Latest month
                  </p>

                  <strong>
                    {latestGrowth.toLocaleString()}
                  </strong>
                </div>

                <div className="admin-mini-stat">
                  <p>
                    Month change
                  </p>

                  <strong
                    className={
                      growthDelta >=
                        0
                        ? "text-success"
                        : "text-destructive"
                    }
                  >
                    {growthDelta >
                      0
                      ? "+"
                      : ""}
                    {growthDelta.toLocaleString()}
                  </strong>
                </div>

                <div className="admin-mini-stat">
                  <p>
                    Active rate
                  </p>

                  <strong>
                    {activeRate}%
                  </strong>
                </div>
              </div>

              <div className="admin-chart-shell h-[300px] sm:h-[330px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={
                      growthData
                    }
                    margin={{
                      top: 8,
                      right: 8,
                      left: -18,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="adminUserGrowthGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--chart-1)"
                          stopOpacity={
                            0.34
                          }
                        />

                        <stop
                          offset="100%"
                          stopColor="var(--chart-1)"
                          stopOpacity={
                            0.02
                          }
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      vertical={
                        false
                      }
                      stroke="var(--border)"
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={
                        false
                      }
                      tickLine={
                        false
                      }
                      tick={{
                        fontSize:
                          11,
                      }}
                    />

                    <YAxis
                      axisLine={
                        false
                      }
                      tickLine={
                        false
                      }
                      allowDecimals={
                        false
                      }
                      tick={{
                        fontSize:
                          11,
                      }}
                    />

                    <Tooltip
                      formatter={(
                        value,
                      ) => [
                          Number(
                            value,
                          ).toLocaleString(),
                          "Users",
                        ]
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="var(--chart-1)"
                      fill="url(#adminUserGrowthGradient)"
                      strokeWidth={
                        2.5
                      }
                      activeDot={{
                        r: 5,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <EmptyState
              title="No growth data yet"
              description="New student registrations will appear here."
            />
          )}
        </Panel>

        {/* Category Usage */}

        <Panel className="admin-analytics-panel">
          <PanelHeading
            title="Category Usage"
            action={
              topCategory ? (
                <span className="admin-panel-chip">
                  Top · {topCategory.name}
                </span>
              ) : undefined
            }
          />

          {categoryChart.length ? (
            <>
              <div className="admin-donut-shell relative h-[245px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={
                        categoryChart
                      }
                      dataKey="value"
                      nameKey="name"
                      innerRadius={
                        67
                      }
                      outerRadius={
                        92
                      }
                      paddingAngle={
                        3
                      }
                      cornerRadius={
                        6
                      }
                      stroke="none"
                    >
                      {categoryChart.map(
                        (
                          item,
                          index,
                        ) => (
                          <Cell
                            key={
                              item.name
                            }
                            fill={
                              chartColors[
                                index %
                                chartColors.length
                              ]
                            }
                          />
                        ),
                      )}
                    </Pie>

                    <Tooltip
                      formatter={(
                        value,
                        _name,
                        payload,
                      ) => [
                          `${Number(
                            value,
                          ).toLocaleString()} uses`,
                          payload
                            ?.payload
                            ?.name ??
                          "Category",
                        ]
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="admin-donut-center">
                  <strong>
                    {totalCategoryUsage.toLocaleString()}
                  </strong>

                  <span>
                    total uses
                  </span>
                </div>
              </div>

              <div className="admin-category-list">
                {categoryChart
                  .slice(
                    0,
                    5,
                  )
                  .map(
                    (
                      item,
                      index,
                    ) => {
                      const percentage =
                        totalCategoryUsage >
                          0
                          ? Math.round(
                            (
                              item.value /
                              totalCategoryUsage
                            ) *
                            100,
                          )
                          : 0;

                      return (
                        <div
                          key={
                            item.name
                          }
                          className="admin-category-row"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <i
                                className="size-2.5 shrink-0 rounded-full"
                                style={{
                                  background:
                                    chartColors[
                                      index %
                                      chartColors.length
                                    ],
                                }}
                              />

                              <p className="truncate text-sm font-semibold text-foreground">
                                {
                                  item.name
                                }
                              </p>
                            </div>

                            <p className="mt-1 pl-[18px] text-[11px] text-muted-foreground">
                              {money(
                                item.amount,
                              )}{" "}
                              recorded
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <strong className="block text-sm">
                              {item.value.toLocaleString()}
                            </strong>

                            <span className="text-[10px] font-semibold text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    },
                  )}
              </div>
            </>
          ) : (
            <EmptyState
              title="No category usage yet"
              description="Category statistics will appear after students add transactions."
            />
          )}
        </Panel>
      </section>

      {/* Recent users */}

      <section className="admin-recent-users mt-5">
        <AdminUsersPage compact />
      </section>
    </div>
  );
}

/* User management */

export function AdminUsersPage({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [users, setUsers] =
    useState<AdminUserRecord[]>([]);

  const [query, setQuery] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const loadUsers =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await adminService.users(
            compact
              ? ""
              : query.trim(),
            compact
              ? ""
              : status,
          );

        setUsers(
          compact
            ? response.data.users.slice(
                0,
                5,
              )
            : response.data.users,
        );
      } catch (error) {
        await notice(
          "Users unavailable",
          error instanceof Error
            ? error.message
            : "Student accounts could not be loaded.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }, [
      query,
      status,
      compact,
    ]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function toggle(
    user: AdminUserRecord,
  ) {
    const currentlyActive =
      Number(
        user.is_active,
      ) === 1;

    const confirmed =
      await confirmAction(
        currentlyActive
          ? "Disable this student?"
          : "Enable this student?",

        currentlyActive
          ? `${user.name} will no longer be able to sign in.`
          : `${user.name} will regain access to Campus Coin.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await adminService.updateUserStatus(
        user.id,
        !currentlyActive,
      );

      await notice(
        "Status updated",
        currentlyActive
          ? "Student account disabled."
          : "Student account enabled.",
        "success",
      );

      await loadUsers();
    } catch (error) {
      await notice(
        "Unable to update user",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    }
  }

  async function resetPassword(
    user: AdminUserRecord,
  ) {
    const confirmed =
      await confirmAction(
        `Reset ${user.name}'s password?`,
        "A temporary password will be generated.",
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await adminService.resetPassword(
          user.id,
        );

      await notice(
        "Temporary Password",
        `New temporary password: ${response.data.temporary_password}`,
        "success",
      );
    } catch (error) {
      await notice(
        "Password reset failed",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    }
  }

  const activeCount =
    users.filter(
      (user) =>
        Number(
          user.is_active,
        ) === 1,
    ).length;

  const disabledCount =
    users.length -
    activeCount;

  function userInitials(
    name: string,
  ) {
    const parts =
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2);

    const value =
      parts
        .map(
          (part) =>
            part
              .charAt(0)
              .toUpperCase(),
        )
        .join("");

    return value || "CC";
  }

  function userImageUrl(
    user: AdminUserRecord,
  ) {
    return (
      user as AdminUserRecord & {
        profile_image_url?:
          string | null;
      }
    ).profile_image_url ?? null;
  }

  function userAvatar(
    user: AdminUserRecord,
  ) {
    const imageUrl =
      userImageUrl(user);

    return (
      <span className="admin-user-avatar relative overflow-hidden">
        <span>
          {userInitials(
            user.name,
          )}
        </span>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${user.name} profile`}
            className="absolute inset-0 size-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        )}
      </span>
    );
  }

  function joinedLabel(
    value: string,
  ) {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  }

  return (
    <div
      className={`admin-users-premium ${
        compact
          ? "admin-users-compact"
          : ""
      }`}
    >
      {!compact && (
        <PageHeader
          title="User Management"
          subtitle="Search, review, enable, disable, and manage registered student accounts."
          action={
            <div className="admin-live-pill">
              <span className="admin-live-dot" />
              <span>Live accounts</span>
            </div>
          }
        />
      )}

      <Panel className="admin-users-panel overflow-hidden !p-0">
        <div className="admin-users-top p-5 md:p-6">
          <PanelHeading
            title={
              compact
                ? "Recent Users"
                : "All Users"
            }
            action={
              <span className="admin-panel-chip">
                {users.length}{" "}
                {users.length === 1
                  ? "account"
                  : "accounts"}
              </span>
            }
          />

          {!compact && (
            <>
              <div className="admin-users-filters grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                  />

                  <Input
                    value={query}
                    onChange={(event) =>
                      setQuery(
                        event.target.value,
                      )
                    }
                    className="admin-users-search h-11 w-full pl-10"
                    placeholder="Search by name or email..."
                    aria-label="Search users"
                  />
                </div>

                <Select
                  value={
                    status ||
                    "all"
                  }
                  onValueChange={(value) =>
                    setStatus(
                      value === "all"
                        ? ""
                        : value,
                    )
                  }
                >
                  <SelectTrigger
                    aria-label="Filter users by status"
                    className="h-11 w-full"
                  >
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All Status
                    </SelectItem>

                    <SelectItem value="active">
                      Active
                    </SelectItem>

                    <SelectItem value="disabled">
                      Disabled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="admin-users-summary mt-4 grid gap-2 sm:grid-cols-3">
                <div className="admin-user-summary-card">
                  <span className="admin-user-summary-dot admin-user-summary-dot-total" />

                  <div>
                    <p>Visible accounts</p>
                    <strong>
                      {users.length}
                    </strong>
                  </div>
                </div>

                <div className="admin-user-summary-card">
                  <span className="admin-user-summary-dot admin-user-summary-dot-active" />

                  <div>
                    <p>Active</p>
                    <strong className="text-success">
                      {activeCount}
                    </strong>
                  </div>
                </div>

                <div className="admin-user-summary-card">
                  <span className="admin-user-summary-dot admin-user-summary-dot-disabled" />

                  <div>
                    <p>Disabled</p>
                    <strong className="text-destructive">
                      {disabledCount}
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center border-t border-border/60">
            <div className="text-center">
              <div className="admin-dashboard-loader-ring mx-auto !size-9" />

              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                Loading student accounts...
              </p>
            </div>
          </div>
        ) : users.length ? (
          <>
            <div className="admin-users-table-shell hidden border-t border-border/60 md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-5 py-3.5">
                        Student
                      </th>

                      <th className="px-4 py-3.5">
                        Email
                      </th>

                      <th className="px-4 py-3.5">
                        Academic Year
                      </th>

                      <th className="px-4 py-3.5">
                        Status
                      </th>

                      <th className="px-4 py-3.5">
                        Joined
                      </th>

                      <th className="px-5 py-3.5 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map(
                      (user) => {
                        const active =
                          Number(
                            user.is_active,
                          ) === 1;

                        return (
                          <tr
                            key={user.id}
                            className="admin-user-row"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {userAvatar(
                                  user,
                                )}

                                <div className="min-w-0">
                                  <p className="truncate font-bold text-foreground">
                                    {user.name}
                                  </p>

                                  <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                                    Student account
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-muted-foreground">
                              <span className="block max-w-[230px] truncate">
                                {user.email}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span className="admin-user-academic-pill">
                                {user.academic_year ||
                                  "Not set"}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`admin-user-status ${
                                  active
                                    ? "is-active"
                                    : "is-disabled"
                                }`}
                              >
                                <i />

                                {active
                                  ? "Active"
                                  : "Disabled"}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-muted-foreground">
                              {joinedLabel(
                                user.created_at,
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="admin-user-action"
                                  title="View user"
                                  aria-label={`View ${user.name}`}
                                  onClick={() =>
                                    notice(
                                      user.name,
                                      `${user.email} · ${user.academic_year || "Academic year not set"} · Allowance ${money(Number(user.monthly_allowance))}`,
                                      "info",
                                    )
                                  }
                                >
                                  <Eye size={15} />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`admin-user-action ${
                                    active
                                      ? "is-danger"
                                      : "is-success"
                                  }`}
                                  title={
                                    active
                                      ? "Disable"
                                      : "Enable"
                                  }
                                  aria-label={`Change status for ${user.name}`}
                                  onClick={() =>
                                    toggle(
                                      user,
                                    )
                                  }
                                >
                                  {active ? (
                                    <Ban size={15} />
                                  ) : (
                                    <CheckCircle2 size={15} />
                                  )}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="admin-user-action"
                                  title="Reset password"
                                  aria-label={`Reset password for ${user.name}`}
                                  onClick={() =>
                                    resetPassword(
                                      user,
                                    )
                                  }
                                >
                                  <RotateCcw size={15} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-users-mobile grid gap-3 border-t border-border/60 p-4 md:hidden">
              {users.map(
                (user) => {
                  const active =
                    Number(
                      user.is_active,
                    ) === 1;

                  return (
                    <article
                      key={user.id}
                      className="admin-user-mobile-card"
                    >
                      <div className="flex items-start gap-3">
                        {userAvatar(
                          user,
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold text-foreground">
                                {user.name}
                              </h3>

                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>

                            <span
                              className={`admin-user-status shrink-0 ${
                                active
                                  ? "is-active"
                                  : "is-disabled"
                              }`}
                            >
                              <i />

                              {active
                                ? "Active"
                                : "Disabled"}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="admin-user-mobile-detail">
                              <span>
                                Academic year
                              </span>

                              <strong>
                                {user.academic_year ||
                                  "Not set"}
                              </strong>
                            </div>

                            <div className="admin-user-mobile-detail">
                              <span>
                                Joined
                              </span>

                              <strong>
                                {joinedLabel(
                                  user.created_at,
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="admin-user-mobile-action"
                          onClick={() =>
                            notice(
                              user.name,
                              `${user.email} · ${user.academic_year || "Academic year not set"} · Allowance ${money(Number(user.monthly_allowance))}`,
                              "info",
                            )
                          }
                        >
                          <Eye size={14} />
                          View
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`admin-user-mobile-action ${
                            active
                              ? "is-danger"
                              : "is-success"
                          }`}
                          onClick={() =>
                            toggle(
                              user,
                            )
                          }
                        >
                          {active ? (
                            <Ban size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}

                          {active
                            ? "Disable"
                            : "Enable"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="admin-user-mobile-action"
                          onClick={() =>
                            resetPassword(
                              user,
                            )
                          }
                        >
                          <RotateCcw size={14} />
                          Reset
                        </Button>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </>
        ) : (
          <div className="border-t border-border/60 p-5 md:p-6">
            <EmptyState
              title="No users found"
              description="No student accounts match your current search or status filter."
            />
          </div>
        )}
      </Panel>
    </div>
  );
}

/* Announcements and tip content */

export function AdminContentPage() {
  const [
    tab,
    setTab,
  ] =
    useState<
      | "announcement"
      | "tip_template"
    >("announcement");

  const [
    items,
    setItems,
  ] =
    useState<
      AdminContentRecord[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<AdminContentRecord | null>(
      null,
    );

  const loadContent =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await adminService.content();

        setItems(
          response.data.items,
        );
      } catch (error) {
        await notice(
          "Content unavailable",
          error instanceof Error
            ? error.message
            : "Administrator content could not be loaded.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  async function save(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const form =
      new FormData(
        event.currentTarget,
      );

    const title =
      String(
        form.get("title") ||
          "",
      ).trim();

    const message =
      String(
        form.get("message") ||
          "",
      ).trim();

    if (
      !title ||
      !message
    ) {
      await notice(
        "Missing content",
        "Title and message are required.",
        "warning",
      );

      return;
    }

    try {
      setSaving(true);

      const wasEditing =
        Boolean(editing);

      const successTitle =
        wasEditing
          ? "Content updated"
          : "Content created";

      const successMessage =
        wasEditing
          ? "Changes saved successfully."
          : tab ===
              "announcement"
            ? "Announcement published successfully."
            : "Saving tip template created successfully.";

      if (editing) {
        await adminService.updateContent(
          editing.id,
          {
            content_type:
              editing.content_type,

            title,

            message,

            is_active:
              Number(
                editing.is_active,
              ) === 1,
          },
        );
      } else {
        await adminService.createContent(
          {
            content_type:
              tab,

            title,

            message,
          },
        );
      }

      /* Close the dialog first so its focus lock does not interfere with the alert. */
      setOpen(false);
      setEditing(null);

      await new Promise<void>(
        (resolve) => {
          window.setTimeout(
            resolve,
            80,
          );
        },
      );

      await notice(
        successTitle,
        successMessage,
        "success",
      );

      await loadContent();
    } catch (error) {
      await notice(
        "Unable to save content",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(
    item: AdminContentRecord,
  ) {
    try {
      const activating =
        Number(
          item.is_active,
        ) !== 1;

      await adminService.updateContent(
        item.id,
        {
          content_type:
            item.content_type,

          title:
            item.title,

          message:
            item.message,

          is_active:
            activating,
        },
      );

      await notice(
        activating
          ? "Content activated"
          : "Content disabled",
        activating
          ? "This content is now active for Campus Coin."
          : "This content has been disabled.",
        "success",
      );

      await loadContent();
    } catch (error) {
      await notice(
        "Unable to update status",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    }
  }

  async function remove(
    item: AdminContentRecord,
  ) {
    const confirmed =
      await confirmAction(
        "Delete this content?",
        "This action cannot be undone.",
      );

    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteContent(
        item.id,
        item.content_type,
      );

      await notice(
        "Content deleted",
        item.content_type ===
          "announcement"
          ? "The announcement has been removed."
          : "The saving tip template has been removed.",
        "success",
      );

      await loadContent();
    } catch (error) {
      await notice(
        "Delete failed",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    }
  }

  const announcements =
    items.filter(
      (item) =>
        item.content_type ===
        "announcement",
    );

  const tipTemplates =
    items.filter(
      (item) =>
        item.content_type ===
        "tip_template",
    );

  const activeItems =
    items.filter(
      (item) =>
        Number(
          item.is_active,
        ) === 1,
    );

  const visibleItems =
    tab ===
      "announcement"
      ? announcements
      : tipTemplates;

  const activeVisible =
    visibleItems.filter(
      (item) =>
        Number(
          item.is_active,
        ) === 1,
    ).length;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(
    item: AdminContentRecord,
  ) {
    setEditing(
      item,
    );

    setTab(
      item.content_type,
    );

    setOpen(true);
  }

  return (
    <div className="admin-content-premium">
      <PageHeader
        title="Content & Announcements"
        subtitle="Manage announcements and saving-tip templates shown across the student experience."
        action={
          <Button
            className="premium-btn h-11 px-5"
            onClick={
              openCreate
            }
          >
            <Plus size={17} />

            Create{" "}
            {tab ===
              "announcement"
              ? "Announcement"
              : "Tip Template"}
          </Button>
        }
      />

      {/* Content summary */}

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="admin-content-stat">
          <span className="admin-content-stat-icon is-announcement">
            <Megaphone
              size={17}
            />
          </span>

          <div>
            <p>
              Announcements
            </p>

            <strong>
              {
                announcements.length
              }
            </strong>
          </div>
        </div>

        <div className="admin-content-stat">
          <span className="admin-content-stat-icon is-tip">
            <Lightbulb
              size={17}
            />
          </span>

          <div>
            <p>
              Tip Templates
            </p>

            <strong>
              {
                tipTemplates.length
              }
            </strong>
          </div>
        </div>

        <div className="admin-content-stat">
          <span className="admin-content-stat-icon is-active">
            <CheckCircle2
              size={17}
            />
          </span>

          <div>
            <p>
              Active Content
            </p>

            <strong>
              {
                activeItems.length
              }
            </strong>
          </div>
        </div>
      </section>

      {/* Content tabs */}

      <div className="admin-content-tabs mb-5">
        <button
          type="button"
          onClick={() =>
            setTab(
              "announcement",
            )
          }
          className={
            tab ===
              "announcement"
              ? "is-active"
              : ""
          }
        >
          <span className="admin-content-tab-icon">
            <Megaphone
              size={15}
            />
          </span>

          <span>
            Announcements
          </span>

          <em>
            {
              announcements.length
            }
          </em>
        </button>

        <button
          type="button"
          onClick={() =>
            setTab(
              "tip_template",
            )
          }
          className={
            tab ===
              "tip_template"
              ? "is-active"
              : ""
          }
        >
          <span className="admin-content-tab-icon">
            <Lightbulb
              size={15}
            />
          </span>

          <span>
            Tip Templates
          </span>

          <em>
            {
              tipTemplates.length
            }
          </em>
        </button>
      </div>

      {/* Content list */}

      <Panel className="admin-content-panel overflow-hidden !p-0">
        <div className="admin-content-panel-head flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6">
          <div>
            <p className="text-sm font-bold text-foreground">
              {tab ===
                "announcement"
                ? "Published Announcements"
                : "Saving Tip Templates"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {activeVisible} active of{" "}
              {
                visibleItems.length
              }{" "}
              item
              {visibleItems.length ===
                1
                ? ""
                : "s"}
            </p>
          </div>

          <span className="admin-panel-chip">
            {tab ===
              "announcement"
              ? "Student updates"
              : "Savings guidance"}
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center border-t border-border/60">
            <div className="text-center">
              <div className="admin-dashboard-loader-ring mx-auto !size-9" />

              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                Loading administrator content...
              </p>
            </div>
          </div>
        ) : visibleItems.length ? (
          <div className="admin-content-list border-t border-border/60">
            {visibleItems.map(
              (
                item,
                index,
              ) => {
                const active =
                  Number(
                    item.is_active,
                  ) === 1;

                return (
                  <article
                    key={`${item.content_type}-${item.id}`}
                    className="admin-content-item"
                  >
                    <div className="admin-content-item-main">
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className={`admin-content-item-icon ${
                            item.content_type ===
                              "announcement"
                              ? "is-announcement"
                              : "is-tip"
                          }`}
                        >
                          {item.content_type ===
                          "announcement" ? (
                            <Megaphone
                              size={18}
                            />
                          ) : (
                            <Lightbulb
                              size={18}
                            />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="admin-content-index">
                              #
                              {
                                index +
                                1
                              }
                            </span>

                            <span
                              className={`admin-content-status ${
                                active
                                  ? "is-active"
                                  : "is-disabled"
                              }`}
                            >
                              <i />

                              {active
                                ? "Active"
                                : "Disabled"}
                            </span>
                          </div>

                          <h3 className="mt-3 text-[15px] font-bold leading-5 text-foreground">
                            {
                              item.title
                            }
                          </h3>

                          <p className="mt-1.5 line-clamp-3 max-w-3xl text-xs leading-5 text-muted-foreground">
                            {
                              item.message
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="admin-content-actions">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`admin-content-toggle ${
                          active
                            ? "is-disable"
                            : "is-activate"
                        }`}
                        onClick={() =>
                          toggleStatus(
                            item,
                          )
                        }
                      >
                        {active ? (
                          <XCircle
                            size={14}
                          />
                        ) : (
                          <CheckCircle2
                            size={14}
                          />
                        )}

                        {active
                          ? "Disable"
                          : "Activate"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="admin-content-action-btn"
                        aria-label={`Edit ${item.title}`}
                        title="Edit content"
                        onClick={() =>
                          openEdit(
                            item,
                          )
                        }
                      >
                        <Pencil
                          size={15}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="admin-content-action-btn is-danger"
                        aria-label={`Delete ${item.title}`}
                        title="Delete content"
                        onClick={() =>
                          remove(
                            item,
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                      </Button>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div className="border-t border-border/60 p-5 md:p-6">
            <EmptyState
              title={
                tab ===
                  "announcement"
                  ? "No announcements yet"
                  : "No tip templates yet"
              }
              description={
                tab ===
                  "announcement"
                  ? "Create your first announcement for students."
                  : "Create your first saving tip template."
              }
              action={
                <Button
                  type="button"
                  className="premium-btn"
                  onClick={
                    openCreate
                  }
                >
                  <Plus
                    size={16}
                  />
                  Create{" "}
                  {tab ===
                    "announcement"
                    ? "Announcement"
                    : "Template"}
                </Button>
              }
            />
          </div>
        )}
      </Panel>

      {/* Create and edit dialog */}

      <Dialog
        open={open}
        onOpenChange={(
          nextOpen,
        ) => {
          setOpen(
            nextOpen,
          );

          if (!nextOpen) {
            setEditing(
              null,
            );
          }
        }}
      >
        <DialogContent className="admin-content-dialog max-w-lg">
          <div className="admin-content-dialog-glow" />

          <DialogHeader className="relative z-10">
            <div className="mb-2 flex items-center gap-3">
              <span
                className={`admin-content-dialog-icon ${
                  tab ===
                    "announcement"
                    ? "is-announcement"
                    : "is-tip"
                }`}
              >
                {tab ===
                  "announcement" ? (
                  <Megaphone
                    size={17}
                  />
                ) : (
                  <Lightbulb
                    size={17}
                  />
                )}
              </span>

              <div>
                <DialogTitle className="text-xl font-bold tracking-[-0.025em]">
                  {editing
                    ? "Edit"
                    : "Create"}{" "}
                  {tab ===
                    "announcement"
                    ? "Announcement"
                    : "Tip Template"}
                </DialogTitle>

                <DialogDescription className="mt-1">
                  {tab ===
                    "announcement"
                    ? "Write a clear update that can be shown to students."
                    : "Create reusable saving guidance for the student experience."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            key={
              editing?.id ??
              `new-${tab}`
            }
            onSubmit={save}
            className="relative z-10 mt-2 space-y-4"
          >
            <label className="block text-sm font-semibold">
              Title

              <Input
                name="title"
                defaultValue={
                  editing?.title ||
                  ""
                }
                required
                maxLength={150}
                className="admin-content-input mt-2 h-11"
                placeholder={
                  tab ===
                    "announcement"
                    ? "e.g. Campus Coin maintenance update"
                    : "e.g. Plan weekly food spending"
                }
              />
            </label>

            <label className="block text-sm font-semibold">
              Message

              <textarea
                name="message"
                required
                defaultValue={
                  editing?.message ||
                  ""
                }
                className="admin-content-textarea mt-2 min-h-40 w-full resize-y p-4"
                placeholder={
                  tab ===
                    "announcement"
                    ? "Write the announcement message..."
                    : "Write the saving tip guidance..."
                }
              />
            </label>

            <div className="admin-content-form-note">
              <Lightbulb
                size={14}
              />

              <span>
                Keep content clear, concise, and easy for students to understand.
              </span>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={
                  saving
                }
                className="outline-btn sm:min-w-28"
                onClick={() =>
                  setOpen(
                    false,
                  )
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  saving
                }
                className="premium-btn sm:min-w-36"
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Publish Content"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Admin statistics */

export function AdminStatisticsPage() {
  const [loading, setLoading] =
    useState(true);

  const [monthly, setMonthly] =
    useState<
      Array<{
        month: string;
        transactions:
          number | string;
        income:
          number | string | null;
        expense:
          number | string | null;
      }>
    >([]);

  const [categories, setCategories] =
    useState<
      Array<{
        name: string;
        type:
          | "income"
          | "expense";
        usage_count:
          number | string;
        total_amount:
          number | string;
      }>
    >([]);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await adminService.statistics();

        setMonthly(
          response.data
            .monthly_activity,
        );

        setCategories(
          response.data
            .category_usage,
        );
      } catch (error) {
        await notice(
          "Statistics unavailable",
          error instanceof Error
            ? error.message
            : "Unable to load system statistics.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return (
      <div className="admin-statistics-premium flex min-h-[460px] items-center justify-center">
        <div className="text-center">
          <div className="admin-dashboard-loader-ring mx-auto" />

          <p className="mt-4 text-sm font-semibold text-foreground">
            Preparing usage statistics
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Loading live Campus Coin activity...
          </p>
        </div>
      </div>
    );
  }

  const monthlyData =
    monthly.map(
      (item) => ({
        month:
          item.month,

        transactions:
          Number(
            item.transactions,
          ),

        income:
          Number(
            item.income ||
              0,
          ),

        expense:
          Number(
            item.expense ||
              0,
          ),
      }),
    );

  const totalTransactions =
    monthlyData.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.transactions,
      0,
    );

  const totalIncome =
    monthlyData.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.income,
      0,
    );

  const totalExpense =
    monthlyData.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.expense,
      0,
    );

  const netFlow =
    totalIncome -
    totalExpense;

  const averageTransactions =
    monthlyData.length
      ? Math.round(
        totalTransactions /
        monthlyData.length,
      )
      : 0;

  const latestMonth =
    monthlyData.at(-1);

  const categoryUsageTotal =
    categories.reduce(
      (
        total,
        item,
      ) =>
        total +
        Number(
          item.usage_count,
        ),
      0,
    );

  const rankedCategories =
    [...categories]
      .sort(
        (
          first,
          second,
        ) =>
          Number(
            second.usage_count,
          ) -
          Number(
            first.usage_count,
          ),
      )
      .slice(
        0,
        8,
      );

  const maxCategoryUsage =
    Math.max(
      1,
      ...rankedCategories.map(
        (item) =>
          Number(
            item.usage_count,
          ),
      ),
    );

  const statCards = [
    {
      label:
        "Transactions",
      value:
        totalTransactions.toLocaleString(),
      detail:
        `${averageTransactions.toLocaleString()} average per month`,
      icon:
        Activity,
      tone:
        "is-primary",
    },
    {
      label:
        "Recorded Income",
      value:
        money(
          totalIncome,
        ),
      detail:
        latestMonth
          ? `${money(latestMonth.income)} in ${latestMonth.month}`
          : "No monthly activity yet",
      icon:
        CircleDollarSign,
      tone:
        "is-success",
    },
    {
      label:
        "Recorded Expenses",
      value:
        money(
          totalExpense,
        ),
      detail:
        latestMonth
          ? `${money(latestMonth.expense)} in ${latestMonth.month}`
          : "No monthly activity yet",
      icon:
        ReceiptText,
      tone:
        "is-expense",
    },
    {
      label:
        "Net Flow",
      value:
        money(
          netFlow,
        ),
      detail:
        netFlow >=
          0
          ? "Income remains above expenses"
          : "Expenses are above recorded income",
      icon:
        CircleDollarSign,
      tone:
        netFlow >=
          0
          ? "is-net-positive"
          : "is-net-negative",
    },
  ];

  return (
    <div className="admin-statistics-premium">
      <PageHeader
        title="Usage Statistics"
        subtitle="Review platform transaction activity, financial flow, and the categories students use most."
        action={
          <div className="admin-live-pill">
            <span className="admin-live-dot" />

            <span>
              Live analytics
            </span>
          </div>
        }
      />

      {/* Statistics summary */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(
          (card) => (
            <div
              key={
                card.label
              }
              className={`admin-stat-card ${card.tone}`}
            >
              <div className="admin-stat-card-glow" />

              <div className="relative z-10">
                <span className="admin-stat-card-icon">
                  <card.icon
                    size={18}
                  />
                </span>

                <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.11em] text-muted-foreground">
                  {card.label}
                </p>

                <strong
                  className={`mt-2 block text-[25px] font-extrabold leading-tight tracking-[-0.045em] ${
                    card.label ===
                      "Net Flow" &&
                    netFlow <
                      0
                      ? "text-destructive"
                      : ""
                  }`}
                >
                  {card.value}
                </strong>

                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  {card.detail}
                </p>
              </div>
            </div>
          ),
        )}
      </section>

      {/* Detailed analytics */}

      <section className="mt-5 grid items-start gap-5 xl:grid-cols-[1.55fr_0.85fr]">

        {/* Monthly financial flow */}

        <Panel className="admin-stat-panel">
          <PanelHeading
            title="Monthly Financial Flow"
            action={
              <span className="admin-panel-chip">
                {monthlyData.length}{" "}
                {monthlyData.length ===
                  1
                  ? "month"
                  : "months"}
              </span>
            }
          />

          {monthlyData.length ? (
            <>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <div className="admin-stat-mini-card">
                  <span>
                    Latest activity
                  </span>

                  <strong>
                    {latestMonth
                      ?.transactions
                      .toLocaleString() ??
                      "0"}
                  </strong>

                  <small>
                    {latestMonth
                      ?.month ??
                      "No month"}{" "}
                    transactions
                  </small>
                </div>

                <div className="admin-stat-mini-card">
                  <span>
                    Total income
                  </span>

                  <strong className="text-success">
                    {money(
                      totalIncome,
                    )}
                  </strong>

                  <small>
                    Across loaded months
                  </small>
                </div>

                <div className="admin-stat-mini-card">
                  <span>
                    Total expense
                  </span>

                  <strong className="text-destructive">
                    {money(
                      totalExpense,
                    )}
                  </strong>

                  <small>
                    Across loaded months
                  </small>
                </div>
              </div>

              <div className="admin-stat-chart h-[320px] sm:h-[345px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={
                      monthlyData
                    }
                    margin={{
                      top: 8,
                      right: 8,
                      left: -8,
                      bottom: 0,
                    }}
                    barGap={
                      7
                    }
                  >
                    <CartesianGrid
                      vertical={
                        false
                      }
                      stroke="var(--border)"
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={
                        false
                      }
                      tickLine={
                        false
                      }
                    />

                    <YAxis
                      axisLine={
                        false
                      }
                      tickLine={
                        false
                      }
                    />

                    <Tooltip />

                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="var(--chart-1)"
                      radius={[
                        7,
                        7,
                        2,
                        2,
                      ]}
                      maxBarSize={
                        34
                      }
                    />

                    <Bar
                      dataKey="expense"
                      name="Expense"
                      fill="var(--chart-2)"
                      radius={[
                        7,
                        7,
                        2,
                        2,
                      ]}
                      maxBarSize={
                        34
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="admin-stat-chart-legend">
                <span>
                  <i className="is-income" />
                  Income
                </span>

                <span>
                  <i className="is-expense" />
                  Expense
                </span>
              </div>
            </>
          ) : (
            <EmptyState
              title="No monthly statistics yet"
              description="Monthly financial activity will appear after students record transactions."
            />
          )}
        </Panel>

        {/* Category ranking */}

        <Panel className="admin-stat-panel">
          <PanelHeading
            title="Category Usage"
            action={
              <span className="admin-panel-chip">
                {categoryUsageTotal.toLocaleString()} uses
              </span>
            }
          />

          {rankedCategories.length ? (
            <div className="admin-stat-category-list">
              {rankedCategories.map(
                (
                  item,
                  index,
                ) => {
                  const usage =
                    Number(
                      item.usage_count,
                    );

                  const amount =
                    Number(
                      item.total_amount,
                    );

                  const width =
                    Math.max(
                      5,
                      (
                        usage /
                        maxCategoryUsage
                      ) *
                      100,
                    );

                  return (
                    <article
                      key={`${item.type}-${item.name}`}
                      className="admin-stat-category-item"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="admin-stat-category-rank">
                              {index +
                                1}
                            </span>

                            <p className="truncate text-sm font-bold text-foreground">
                              {
                                item.name
                              }
                            </p>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-2 pl-8">
                            <span
                              className={`admin-stat-category-type ${
                                item.type ===
                                  "income"
                                  ? "is-income"
                                  : "is-expense"
                              }`}
                            >
                              {
                                item.type
                              }
                            </span>

                            <span className="text-[10px] text-muted-foreground">
                              {money(
                                amount,
                              )}{" "}
                              recorded
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <strong className="block text-sm">
                            {usage.toLocaleString()}
                          </strong>

                          <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                            uses
                          </span>
                        </div>
                      </div>

                      <div className="admin-stat-progress mt-3">
                        <span
                          style={{
                            width:
                              `${width}%`,
                          }}
                        />
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          ) : (
            <EmptyState
              title="No category activity yet"
              description="Category rankings will appear after students begin recording transactions."
            />
          )}
        </Panel>
      </section>

      {/* Monthly activity */}

      {monthlyData.length ? (
        <Panel className="admin-stat-month-strip mt-5">
          <PanelHeading
            title="Monthly Transaction Activity"
            action={
              <span className="text-xs text-muted-foreground">
                Transaction count by month
              </span>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {monthlyData.map(
              (
                item,
                index,
              ) => (
                <div
                  key={`${item.month}-${index}`}
                  className="admin-stat-month-card"
                >
                  <span>
                    {
                      item.month
                    }
                  </span>

                  <strong>
                    {item.transactions.toLocaleString()}
                  </strong>

                  <small>
                    transaction
                    {item.transactions ===
                      1
                      ? ""
                      : "s"}
                  </small>
                </div>
              ),
            )}
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
