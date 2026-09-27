import {
  profileService,
  type ProfileRecord,
} from "@/services/profileService";

import {
  bookmarkService,
  type BookmarkRecord,
} from "@/services/bookmarkService";

import { importService } from "@/services/importService";

import {
  reportService,
  type MonthlyReport,
} from "@/services/reportService";

import {
  insightService,
  type InsightRecord,
} from "@/services/insightService";

import {
  tipService,
  type TipRecord,
} from "../../services/tipService";

import {
  notificationService,
  type NotificationRecord,
} from "@/services/notificationService";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  budgetService,
  type BudgetRecord,
} from "@/services/budgetService";

import {
  goalService,
  type GoalRecord,
} from "@/services/goalService";

import { Link } from "@tanstack/react-router";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Bus,
  CalendarDays,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileText,
  Film,
  Globe,
  Image as ImageIcon,
  Info,
  Laptop,
  Leaf,
  Pencil,
  Pin,
  Plane,
  Plus,
  ReceiptText,
  Search,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UploadCloud,
  Utensils,
  Wallet,
  X,
} from "lucide-react";

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  CategoryBadge,
  EmptyState,
  FontSizeControl,
  PageHeader,
  Panel,
  PanelHeading,
  ThemeToggle,
} from "./shared";

import {
  confirmAction,
  notice,
} from "./alerts";

import {
  PremiumDatePicker,
  PremiumMonthPicker,
} from "./premium-date-picker";

import { apiRequest } from "@/services/api";
import { authService } from "@/services/authService";
import {
  transactionService,
  type TransactionRecord,
  type TransactionPayload,
} from "@/services/transactionService";

import {
  categoryService,
  type CategoryRecord,
} from "@/services/categoryService";

type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  recurring: boolean;
};

/* API types */

type DashboardData = {
  month: string;

  income: number;
  expense: number;
  balance: number;

  top_category: {
    id: number;
    name: string;
    total: number | string;
  } | null;

  budget: {
    limit: number;
    spent: number;
    percentage: number;
  };

  recent_transactions: Array<{
    id: number;
    amount: number | string;
    type: "income" | "expense";
    description: string | null;
    transaction_date: string;
    category_name: string;
  }>;

  tips: Array<{
    id: number;
    title: string;
    message: string;
    potential_saving:
    | number
    | string
    | null;
    priority:
    | "low"
    | "medium"
    | "high";
    is_pinned: number;
  }>;

  unread_notifications: number;

  announcements: Array<{
    id: number;
    title: string;
    message: string;
    created_at: string;
  }>;
};

/* Shared helpers */

const money = (amount: number) =>
  `$${amount.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;

/*
 * Ask the shared app shell to refresh its unread-notification badge.
 * This avoids waiting for the background polling interval after actions
 * that may create, remove, or read an alert.
 */
function refreshNotificationBadge() {
  window.dispatchEvent(
    new Event(
      "campuscoin:notifications-changed",
    ),
  );
}

const categoryIcon = (
  name: string,
) => {
  if (name === "Food") {
    return Utensils;
  }

  if (name === "Transport") {
    return Bus;
  }

  if (name === "Shopping") {
    return ShoppingBag;
  }

  if (
    name === "Education" ||
    name === "Academics"
  ) {
    return BookOpen;
  }

  if (
    name === "Entertainment"
  ) {
    return Film;
  }

  return CircleDollarSign;
};

const goalIcon = (
  name: string,
) => {
  if (name === "New Laptop") {
    return Laptop;
  }

  if (name === "Travel Trip") {
    return Plane;
  }

  if (name === "New Phone") {
    return Smartphone;
  }

  if (
    name === "Emergency Fund"
  ) {
    return Shield;
  }

  if (name === "Camera") {
    return Camera;
  }

  return Globe;
};

function SectionLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
    >
      {children}

      <ArrowUpRight
        size={15}
      />
    </Link>
  );
}

function Progress({
  value,
  tone = "bg-primary",
}: {
  value: number;
  tone?: string;
}) {
  const safeValue = Math.min(
    100,
    Math.max(0, value),
  );

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full transition-all duration-300 ${tone}`}
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}

/* Chart helpers */

/* Transaction list */

function TransactionsList({
  items,
}: {
  items: Transaction[];
}) {
  return (
    <div className="divide-y divide-border">
      {items.map(
        (transaction) => {
          const Icon =
            categoryIcon(
              transaction.category,
            );

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 py-3.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                <Icon size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {
                    transaction.description
                  }
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {
                    transaction.category
                  }
                  {" · "}

                  {new Date(
                    `${transaction.date}T12:00:00`,
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month:
                        "short",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              <strong
                className={`text-sm ${transaction.type ===
                  "expense"
                  ? "text-destructive"
                  : "text-success"
                  }`}
              >
                {transaction.type ===
                  "expense"
                  ? "−"
                  : "+"}

                {money(
                  transaction.amount,
                )}
              </strong>
            </div>
          );
        },
      )}

      {!items.length && (
        <EmptyState
          title="No transactions yet"
          description="Your money activity will appear here."
        />
      )}
    </div>
  );
}

/* Student dashboard */

export function DashboardPage() {
  const [
    dashboard,
    setDashboard,
  ] =
    useState<DashboardData | null>(
      null,
    );

  const [
    studentName,
    setStudentName,
  ] = useState("Student");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    dashboardTrend,
    setDashboardTrend,
  ] = useState<
    Array<{
      month: string;
      income: number;
      expense: number;
    }>
  >([]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          dashboardResponse,
          userResponse,
          trendResponse,
        ] =
          await Promise.all([
            apiRequest<DashboardData>(
              "/dashboard/summary.php",
            ),

            authService.me(),

            reportService.sixMonths(),
          ]);

        if (!active) {
          return;
        }

        setDashboard(
          dashboardResponse.data,
        );

        setStudentName(
          userResponse.data.user
            .name,
        );

        setDashboardTrend(
          trendResponse.data.months.map(
            (item) => ({
              month: item.month,
              income: Number(
                item.income,
              ),
              expense: Number(
                item.expense,
              ),
            }),
          ),
        );
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof
            Error
            ? requestError.message
            : "Dashboard could not be loaded.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading your financial
            overview...
          </p>
        </div>
      </div>
    );
  }

  if (
    error ||
    !dashboard
  ) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        description={
          error ||
          "Your dashboard could not be loaded."
        }
      />
    );
  }

  const firstName =
    studentName
      .trim()
      .split(/\s+/)
      .at(0) ||
    "Student";

  const monthDate =
    new Date(
      `${dashboard.month}-01T12:00:00`,
    );

  const monthLabel =
    monthDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      },
    );

  const transactions: Transaction[] =
    dashboard.recent_transactions.map(
      (transaction) => ({
        id: transaction.id,

        date:
          transaction.transaction_date,

        description:
          transaction.description ||
          "Transaction",

        category:
          transaction.category_name,

        amount: Number(
          transaction.amount,
        ),

        type:
          transaction.type,

        recurring: false,
      }),
    );

  const topTips =
    dashboard.tips.slice(0, 3);

  const latestAnnouncement =
    dashboard.announcements.at(
      0,
    );

  /*
   * Keep the backend budget values unchanged while presenting
   * over-budget spending in a clearer way for the student.
   */

  const budgetLimit =
    Number(
      dashboard.budget.limit,
    );

  const budgetSpent =
    Number(
      dashboard.budget.spent,
    );

  const isBudgetOver =
    budgetLimit > 0 &&
    budgetSpent > budgetLimit;

  const budgetUsedPercentage =
    budgetLimit > 0
      ? Math.min(
        100,
        Math.max(
          0,
          (budgetSpent /
            budgetLimit) *
          100,
        ),
      )
      : 0;

  const budgetOverAmount =
    Math.max(
      0,
      budgetSpent -
      budgetLimit,
    );

  const budgetOverPercentage =
    budgetLimit > 0
      ? Math.max(
        0,
        (budgetOverAmount /
          budgetLimit) *
        100,
      )
      : 0;

  const budgetRemaining =
    Math.max(
      0,
      budgetLimit -
      budgetSpent,
    );

  const glassCard =
    "relative overflow-hidden rounded-[24px] border border-white/70 bg-white/45 shadow-[0_18px_50px_rgba(39,60,46,0.10)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-[rgba(18,42,32,0.48)] dark:shadow-[0_22px_58px_rgba(0,0,0,0.34)]";

  const softGlass =
    "rounded-[18px] border border-white/60 bg-white/40 shadow-[0_8px_24px_rgba(39,60,46,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_10px_28px_rgba(0,0,0,0.22)]";

  return (
    <div className="student-dashboard-glass space-y-5">
      <PageHeader
        title={`Good morning, ${firstName}`}
        subtitle="Small steps. A brighter you."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="outline-btn h-10 w-full px-5 sm:w-auto"
            >
              <Link to="/income">
                <Wallet size={17} />
                Add Income
              </Link>
            </Button>

            <Button
              asChild
              className="premium-btn h-10 w-full px-5 sm:w-auto"
            >
              <Link to="/transactions">
                <Plus size={17} />
                Add Expense
              </Link>
            </Button>
          </div>
        }
      />

      {/* Dashboard summary cards */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`${glassCard} p-5`}>
          <div className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-sage/80 blur-3xl dark:bg-emerald-400/10" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Current Balance
              </p>

              <h2 className="editorial mt-3 text-3xl text-foreground md:text-[34px]">
                {money(
                  Number(
                    dashboard.balance,
                  ),
                )}
              </h2>

              <div className="metric-pill mt-4">
                <TrendingUp size={14} />
                This month
              </div>
            </div>

            <span className={`${softGlass} flex size-11 shrink-0 items-center justify-center text-primary`}>
              <Wallet size={20} />
            </span>
          </div>
        </div>

        <div className={`${glassCard} p-5`}>
          <div className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-sage/70 blur-3xl dark:bg-emerald-400/10" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Income
              </p>

              <h2 className="mt-3 text-3xl font-bold text-success">
                {money(
                  Number(
                    dashboard.income,
                  ),
                )}
              </h2>

              <p className="mt-4 text-xs text-muted-foreground">
                Received in {monthLabel}
              </p>
            </div>

            <span className={`${softGlass} flex size-11 shrink-0 items-center justify-center text-success`}>
              <TrendingUp size={20} />
            </span>
          </div>
        </div>

        <div className={`${glassCard} p-5`}>
          <div className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-peach/80 blur-3xl dark:bg-rose-400/10" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Expenses
              </p>

              <h2 className="mt-3 text-3xl font-bold text-destructive">
                {money(
                  Number(
                    dashboard.expense,
                  ),
                )}
              </h2>

              <p className="mt-4 text-xs text-muted-foreground">
                Spent in {monthLabel}
              </p>
            </div>

            <span className={`${softGlass} flex size-11 shrink-0 items-center justify-center text-destructive`}>
              <ReceiptText size={20} />
            </span>
          </div>
        </div>

        <div className={`${glassCard} p-5`}>
          <div className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-violet-soft/90 blur-3xl dark:bg-violet-400/10" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {isBudgetOver
                  ? "Over Budget"
                  : "Budget Used"}
              </p>

              <h2
                className={`mt-3 text-3xl font-bold ${isBudgetOver
                    ? "text-destructive"
                    : "text-foreground"
                  }`}
              >
                {isBudgetOver
                  ? `${budgetOverPercentage.toFixed(0)}%`
                  : `${budgetUsedPercentage.toFixed(0)}%`}
              </h2>

              <p className="mt-4 text-xs text-muted-foreground">
                {isBudgetOver
                  ? `${money(
                    budgetOverAmount,
                  )} above ${money(
                    budgetLimit,
                  )} limit`
                  : `${money(
                    budgetSpent,
                  )} of ${money(
                    budgetLimit,
                  )}`}
              </p>
            </div>

            <span
              className={`${softGlass} flex size-11 shrink-0 items-center justify-center ${isBudgetOver
                  ? "text-destructive"
                  : "text-primary"
                }`}
            >
              <Target size={20} />
            </span>
          </div>
        </div>
      </section>

      {/* Cash flow and budget overview */}

      <section className="grid items-start gap-5 xl:grid-cols-[1.55fr_0.85fr]">
        <div className={`${glassCard} p-5 md:p-6`}>
          <PanelHeading
            title="Income vs. Expense"
            action={
              <SectionLink to="/reports">
                Full reports
              </SectionLink>
            }
          />

          {dashboardTrend.length ? (
            <>
              <div className="h-[250px] w-full sm:h-[280px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={dashboardTrend}
                    margin={{
                      top: 8,
                      right: 4,
                      left: -18,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                    />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                      }}
                      tickFormatter={(value) =>
                        new Date(
                          `${String(value)}-01T12:00:00`,
                        ).toLocaleDateString(
                          "en-US",
                          { month: "short" },
                        )
                      }
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <Tooltip
                      formatter={(value) =>
                        money(
                          Number(value),
                        )
                      }
                      labelFormatter={(value) =>
                        new Date(
                          `${String(value)}-01T12:00:00`,
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )
                      }
                    />

                    <Legend />

                    <Area
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="var(--chart-1)"
                      fill="var(--chart-1)"
                      fillOpacity={0.14}
                      strokeWidth={2}
                    />

                    <Area
                      type="monotone"
                      dataKey="expense"
                      name="Expense"
                      stroke="var(--chart-2)"
                      fill="var(--chart-2)"
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={`${softGlass} mt-4 flex flex-wrap items-center justify-between gap-4 p-4`}>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current month spending
                  </p>

                  <strong className="mt-1 block text-xl">
                    {money(
                      Number(
                        dashboard.expense,
                      ),
                    )}
                  </strong>
                </div>

                {dashboard.top_category && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Top category · {monthLabel}
                    </p>

                    <strong className="mt-1 block text-sm">
                      {dashboard.top_category.name}
                    </strong>
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              title="No chart data yet"
              description="Add income and expenses to build your interactive cash-flow chart."
            />
          )}
        </div>

        <div className="grid gap-5">
          <div className={`${glassCard} p-5 md:p-6`}>
            <PanelHeading
              title="Budget vs. Actual"
              action={
                <SectionLink to="/budgets">
                  Manage
                </SectionLink>
              }
            />

            <div className={`${softGlass} p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Monthly Budget
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {money(
                      Number(
                        dashboard
                          .budget
                          .limit,
                      ),
                    )}
                  </h3>
                </div>

                <strong
                  className={`text-sm ${isBudgetOver
                      ? "text-destructive"
                      : budgetUsedPercentage >= 80
                        ? "text-warning"
                        : "text-primary"
                    }`}
                >
                  {isBudgetOver
                    ? `${budgetOverPercentage.toFixed(0)}% over`
                    : `${budgetUsedPercentage.toFixed(0)}% used`}
                </strong>
              </div>

              <div className="mt-5">
                <Progress
                  value={
                    budgetUsedPercentage
                  }
                  tone={
                    isBudgetOver
                      ? "bg-destructive"
                      : budgetUsedPercentage >= 80
                        ? "bg-warning"
                        : "bg-primary"
                  }
                />
              </div>

              <div className="mt-3 flex justify-between gap-4 text-xs text-muted-foreground">
                <span>
                  Spent{" "}
                  {money(
                    budgetSpent,
                  )}
                </span>

                <span
                  className={
                    isBudgetOver
                      ? "font-semibold text-destructive"
                      : undefined
                  }
                >
                  {isBudgetOver
                    ? `Over by ${money(
                      budgetOverAmount,
                    )}`
                    : `Remaining ${money(
                      budgetRemaining,
                    )}`}
                </span>
              </div>
            </div>
          </div>

          <div className={`${glassCard} p-5 md:p-6`}>
            <PanelHeading
              title="Top Category"
              action={
                <SectionLink to="/reports">
                  Details
                </SectionLink>
              }
            />

            {dashboard.top_category ? (
              <div className={`${softGlass} p-5`}>
                <p className="text-xs text-muted-foreground">
                  Highest spending · {monthLabel}
                </p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <CategoryBadge
                    category={
                      dashboard
                        .top_category
                        .name
                    }
                  />

                  <strong className="text-lg">
                    {money(
                      Number(
                        dashboard
                          .top_category
                          .total,
                      ),
                    )}
                  </strong>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No top category yet"
                description="Your highest-spending category will appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* Recent transactions and saving tips */}

      <section className="grid items-start gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className={`${glassCard} p-5 md:p-6`}>
          <PanelHeading
            title="Recent Transactions"
            action={
              <SectionLink to="/transactions">
                View all
              </SectionLink>
            }
          />

          <TransactionsList
            items={transactions}
          />
        </div>

        <div className={`${glassCard} p-5 md:p-6`}>
          <PanelHeading
            title="Top Saving Tips"
            action={
              <SectionLink to="/tips">
                View all
              </SectionLink>
            }
          />

          {topTips.length ? (
            <div className="grid gap-3">
              {topTips.map(
                (tip, index) => (
                  <div
                    key={tip.id}
                    className={`${softGlass} p-4 transition-transform duration-200 hover:-translate-y-0.5`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] border border-white/50 bg-violet-soft/75 text-primary dark:border-white/10 dark:bg-violet-400/10">
                        <Sparkles size={17} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold">
                            {tip.title}
                          </h3>

                          <span className="shrink-0 rounded-full border border-white/50 bg-white/40 px-2 py-1 text-[10px] font-bold text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]">
                            #{index + 1}
                          </span>
                        </div>

                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {tip.message}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="rounded-full bg-sage px-2 py-1 font-semibold capitalize text-primary">
                            {tip.priority} priority
                          </span>

                          {tip.potential_saving !== null && (
                            <span className="text-muted-foreground">
                              Potential{" "}
                              {money(
                                Number(
                                  tip.potential_saving,
                                ),
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <EmptyState
              title="No saving tips yet"
              description="Add transactions and budgets to generate personalized saving tips."
            />
          )}
        </div>
      </section>

      {/* Latest admin announcement */}

      {latestAnnouncement && (
        <div className={`${glassCard} p-5 md:p-6`}>
          <div className="flex items-start gap-4">
            <span className={`${softGlass} flex size-11 shrink-0 items-center justify-center text-primary`}>
              <Info size={19} />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary">
                Announcement
              </p>

              <h3 className="mt-2 font-bold">
                {
                  latestAnnouncement.title
                }
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {
                  latestAnnouncement.message
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Transactions and income */

export function TransactionsPage({
  income = false,
}: {
  income?: boolean;
}) {
  const transactionType =
    income
      ? "income"
      : "expense";

  const [
    transactions,
    setTransactions,
  ] = useState<TransactionRecord[]>(
    [],
  );

  const [
    categories,
    setCategories,
  ] = useState<CategoryRecord[]>(
    [],
  );

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    categoryId,
    setCategoryId,
  ] = useState("all");

  const [
    month,
    setMonth,
  ] = useState("all");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalRecords,
    setTotalRecords,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<TransactionRecord | null>(
      null,
    );

  const [
    recurring,
    setRecurring,
  ] = useState(false);

  /* Month filter date range */

  function getMonthRange(
    selectedMonth: string,
  ) {
    if (
      selectedMonth === "all"
    ) {
      return {
        from: undefined,
        to: undefined,
      };
    }

    const [
      yearText,
      monthText,
    ] =
      selectedMonth.split("-");

    const year =
      Number(yearText);

    const monthNumber =
      Number(monthText);

    const lastDay =
      new Date(
        year,
        monthNumber,
        0,
      ).getDate();

    return {
      from:
        `${selectedMonth}-01`,

      to:
        `${selectedMonth}-${String(
          lastDay,
        ).padStart(2, "0")}`,
    };
  }

  /* Load categories */

  const loadCategories =
    useCallback(
      async () => {
        try {
          const response =
            await categoryService.list(
              transactionType,
            );

          setCategories(
            response.data.categories,
          );
        } catch (error) {
          await notice(
            "Categories unavailable",
            error instanceof Error
              ? error.message
              : "Categories could not be loaded.",
            "error",
          );
        }
      },
      [transactionType],
    );

  /* Load transactions */

  const loadTransactions =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const range =
            getMonthRange(
              month,
            );

          const response =
            await transactionService.list(
              {
                type:
                  transactionType,

                category_id:
                  categoryId ===
                    "all"
                    ? undefined
                    : Number(
                      categoryId,
                    ),

                from:
                  range.from,

                to:
                  range.to,

                search:
                  query.trim() ||
                  undefined,

                page,

                limit: 6,
              },
            );

          setTransactions(
            response.data
              .transactions,
          );

          setTotalPages(
            Math.max(
              1,
              response.data
                .pagination.pages,
            ),
          );

          setTotalRecords(
            response.data
              .pagination.total,
          );
        } catch (error) {
          await notice(
            "Unable to load transactions",
            error instanceof Error
              ? error.message
              : "Please try again.",
            "error",
          );

          setTransactions([]);
        } finally {
          setLoading(false);
        }
      },
      [
        transactionType,
        categoryId,
        month,
        query,
        page,
      ],
    );

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  /* Open create form */

  function openCreateForm() {
    setEditing(null);
    setRecurring(false);
    setOpen(true);
  }

  /* Open edit form */

  function openEditForm(
    transaction: TransactionRecord,
  ) {
    setEditing(
      transaction,
    );

    setRecurring(
      Number(
        transaction.is_recurring,
      ) === 1,
    );

    setOpen(true);
  }

  /* Create or update transaction */

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

    const selectedCategory =
      Number(
        form.get(
          "category_id",
        ),
      );

    const amount =
      Number(
        form.get("amount"),
      );

    const description =
      String(
        form.get(
          "description",
        ) || "",
      ).trim();

    const transactionDate =
      String(
        form.get("date") ||
        "",
      );

    const frequency =
      String(
        form.get(
          "recurring_frequency",
        ) || "monthly",
      ) as
      | "weekly"
      | "monthly"
      | "yearly";

    const recurringEndDate =
      String(
        form.get(
          "recurring_end_date",
        ) || "",
      );

    if (
      selectedCategory < 1
    ) {
      await notice(
        "Category required",
        "Please select a category.",
        "warning",
      );

      return;
    }

    if (
      !amount ||
      amount <= 0
    ) {
      await notice(
        "Invalid amount",
        "Enter an amount greater than zero.",
        "error",
      );

      return;
    }

    if (
      !transactionDate
    ) {
      await notice(
        "Date required",
        "Please select the transaction date.",
        "warning",
      );

      return;
    }

    const payload: TransactionPayload =
    {
      category_id:
        selectedCategory,

      amount,

      type:
        transactionType,

      description,

      transaction_date:
        transactionDate,

      is_recurring:
        recurring,

      recurring_frequency:
        recurring
          ? frequency
          : undefined,

      recurring_end_date:
        recurring &&
          recurringEndDate
          ? recurringEndDate
          : null,
    };

    try {
      setSaving(true);

      if (editing) {
        await transactionService.update(
          editing.id,
          payload,
        );

        await notice(
          "Transaction updated",
          "Your changes were saved successfully.",
          "success",
        );
      } else {
        await transactionService.create(
          payload,
        );

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
          "Expense added",
          "Your expense has been added to Campus Coin.",
          "success",
        );
      }

      refreshNotificationBadge();

      setOpen(false);
      setEditing(null);
      setRecurring(false);

      if (page !== 1) {
        setPage(1);
      } else {
        await loadTransactions();
      }
    } catch (error) {
      await notice(
        editing
          ? "Update failed"
          : "Unable to add transaction",

        error instanceof Error
          ? error.message
          : "Please try again.",

        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  /* Delete transaction */

  async function remove(
    transaction: TransactionRecord,
  ) {
    const confirmed =
      await confirmAction(
        "Delete this transaction?",
        `${transaction.description || "This transaction"} will be removed from your account.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await transactionService.remove(
        transaction.id,
      );

      await notice(
        "Transaction deleted",
        "The transaction has been removed.",
        "success",
      );

      refreshNotificationBadge();

      if (
        transactions.length ===
        1 &&
        page > 1
      ) {
        setPage(
          page - 1,
        );
      } else {
        await loadTransactions();
      }
    } catch (error) {
      await notice(
        "Delete failed",
        error instanceof Error
          ? error.message
          : "The transaction could not be deleted.",
        "error",
      );
    }
  }

  return (
    <>
      <PageHeader
        title={
          income
            ? "Income"
            : "Expenses"
        }
        subtitle={
          income
            ? "Track and manage your real income records."
            : "Track and manage your real spending."
        }
        action={
          <Button
            onClick={
              openCreateForm
            }
          >
            <Plus />

            Add{" "}
            {income
              ? "Income"
              : "Expense"}
          </Button>
        }
      />

      <Panel>

        {/* Filters */}

        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />

            <Input
              aria-label="Search transactions"
              placeholder="Search description or category..."
              value={query}
              onChange={(
                event,
              ) => {
                setQuery(
                  event.target
                    .value,
                );

                setPage(1);
              }}
              className="h-10 pl-9"
            />
          </div>

          <Select
            value={categoryId}
            onValueChange={(
              value,
            ) => {
              setCategoryId(
                value,
              );

              setPage(1);
            }}
          >
            <SelectTrigger
              aria-label="Category filter"
              className="h-10 min-w-[165px]"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Categories
              </SelectItem>

              {categories.map(
                (category) => (
                  <SelectItem
                    key={
                      category.id
                    }
                    value={String(
                      category.id,
                    )}
                  >
                    {
                      category.name
                    }
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Select
            value={month}
            onValueChange={(
              value,
            ) => {
              setMonth(
                value,
              );

              setPage(1);
            }}
          >
            <SelectTrigger
              aria-label="Month filter"
              className="h-10 min-w-[155px]"
            >
              <SelectValue placeholder="All Months" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Months
              </SelectItem>

              <SelectItem value="2026-09">
                September 2026
              </SelectItem>

              <SelectItem value="2026-08">
                August 2026
              </SelectItem>

              <SelectItem value="2026-07">
                July 2026
              </SelectItem>

              <SelectItem value="2026-06">
                June 2026
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto size-9 animate-spin rounded-full border-4 border-muted border-t-primary" />

              <p className="mt-3 text-sm text-muted-foreground">
                Loading{" "}
                {income
                  ? "income"
                  : "expenses"}
                ...
              </p>
            </div>
          </div>
        ) : transactions.length ? (
          <>

            {/* Desktop table */}

            <div className="table-shell hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3">
                      Date
                    </th>

                    <th className="p-3">
                      Description
                    </th>

                    <th className="p-3">
                      Category
                    </th>

                    <th className="p-3">
                      Type
                    </th>

                    <th className="p-3 text-right">
                      Amount
                    </th>

                    <th className="p-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (
                      transaction,
                    ) => {
                      const Icon =
                        categoryIcon(
                          transaction.category_name,
                        );

                      return (
                        <tr
                          key={
                            transaction.id
                          }
                          className="border-b border-border transition-colors hover:bg-muted/40"
                        >
                          <td className="whitespace-nowrap p-3 text-muted-foreground">
                            {new Date(
                              `${transaction.transaction_date}T12:00:00`,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month:
                                  "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                                <Icon
                                  size={
                                    16
                                  }
                                />
                              </span>

                              <div>
                                <p className="font-medium">
                                  {transaction.description ||
                                    "Transaction"}
                                </p>

                                {Number(
                                  transaction.is_recurring,
                                ) ===
                                  1 && (
                                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                      Recurring{" "}
                                      {
                                        transaction.recurring_frequency
                                      }
                                    </span>
                                  )}
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <CategoryBadge
                              category={
                                transaction.category_name
                              }
                            />
                          </td>

                          <td className="p-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${transaction.type ===
                                "income"
                                ? "bg-sage text-success"
                                : "bg-peach text-destructive"
                                }`}
                            >
                              {
                                transaction.type
                              }
                            </span>
                          </td>

                          <td
                            className={`p-3 text-right font-bold ${transaction.type ===
                              "income"
                              ? "text-success"
                              : "text-destructive"
                              }`}
                          >
                            {transaction.type ===
                              "income"
                              ? "+"
                              : "−"}

                            {money(
                              Number(
                                transaction.amount,
                              ),
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit"
                              aria-label={`Edit ${transaction.description || "transaction"}`}
                              onClick={() =>
                                openEditForm(
                                  transaction,
                                )
                              }
                            >
                              <Pencil
                                size={
                                  15
                                }
                              />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              aria-label={`Delete ${transaction.description || "transaction"}`}
                              onClick={() =>
                                remove(
                                  transaction,
                                )
                              }
                            >
                              <Trash2
                                size={
                                  15
                                }
                              />
                            </Button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}

            <div className="space-y-3 md:hidden">
              {transactions.map(
                (
                  transaction,
                ) => (
                  <div
                    key={
                      transaction.id
                    }
                    className="data-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {transaction.description ||
                            "Transaction"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            transaction.transaction_date
                          }
                        </p>
                      </div>

                      <strong
                        className={
                          transaction.type ===
                            "income"
                            ? "text-success"
                            : "text-destructive"
                        }
                      >
                        {transaction.type ===
                          "income"
                          ? "+"
                          : "−"}

                        {money(
                          Number(
                            transaction.amount,
                          ),
                        )}
                      </strong>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <CategoryBadge
                        category={
                          transaction.category_name
                        }
                      />

                      {Number(
                        transaction.is_recurring,
                      ) ===
                        1 && (
                          <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                            Recurring{" "}
                            {
                              transaction.recurring_frequency
                            }
                          </span>
                        )}
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit transaction"
                        onClick={() =>
                          openEditForm(
                            transaction,
                          )
                        }
                      >
                        <Pencil
                          size={16}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete transaction"
                        onClick={() =>
                          remove(
                            transaction,
                          )
                        }
                      >
                        <Trash2
                          size={16}
                        />
                      </Button>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Pagination */}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {totalRecords}{" "}
                {income
                  ? "income"
                  : "expense"}{" "}
                record
                {totalRecords ===
                  1
                  ? ""
                  : "s"}
              </span>

              <div className="flex items-center gap-2">
                <span>
                  Page {page} of{" "}
                  {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={
                    page <= 1
                  }
                  aria-label="Previous page"
                  onClick={() =>
                    setPage(
                      (
                        current,
                      ) =>
                        Math.max(
                          1,
                          current -
                          1,
                        ),
                    )
                  }
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={
                    page >=
                    totalPages
                  }
                  aria-label="Next page"
                  onClick={() =>
                    setPage(
                      (
                        current,
                      ) =>
                        Math.min(
                          totalPages,
                          current +
                          1,
                        ),
                    )
                  }
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title={
              query ||
                categoryId !==
                "all" ||
                month !== "all"
                ? "No matching transactions"
                : income
                  ? "No income yet"
                  : "No expenses yet"
            }
            description={
              income
                ? "Add your first income record to start tracking your money."
                : "Add your first expense to start understanding your spending."
            }
            action={
              <Button
                onClick={
                  openCreateForm
                }
              >
                <Plus />

                Add{" "}
                {income
                  ? "Income"
                  : "Expense"}
              </Button>
            }
          />
        )}
      </Panel>

      {/* Add / edit dialog */}

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

            setRecurring(
              false,
            );
          }
        }}
      >
        <DialogContent className="max-w-md rounded-[26px] border-border bg-card shadow-[var(--shadow-lift)]">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? "Edit"
                : "Add"}{" "}
              {income
                ? "Income"
                : "Expense"}
            </DialogTitle>

            <DialogDescription>
              {editing
                ? "Update this transaction in your Campus Coin account."
                : "Add a new transaction to your financial record."}
            </DialogDescription>
          </DialogHeader>

          <form
            key={
              editing?.id ??
              "new"
            }
            onSubmit={save}
            className="space-y-4"
          >

            {/* Amount */}

            <label className="block text-sm font-semibold">
              Amount

              <Input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                defaultValue={
                  editing
                    ? Number(
                      editing.amount,
                    )
                    : ""
                }
                className="mt-1.5 h-10"
                placeholder="0.00"
              />
            </label>

            {/* Category */}

            <label className="block text-sm font-semibold">
              Category

              <Select
                name="category_id"
                required
                defaultValue={
                  editing
                    ? String(
                      editing.category_id,
                    )
                    : ""
                }
              >
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map(
                    (category) => (
                      <SelectItem
                        key={
                          category.id
                        }
                        value={String(
                          category.id,
                        )}
                      >
                        {
                          category.name
                        }

                        {Number(
                          category.is_default,
                        ) ===
                          1
                          ? ""
                          : " · Personal"}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </label>

            {/* Description */}

            <label className="block text-sm font-semibold">
              Description

              <Input
                name="description"
                defaultValue={
                  editing?.description ??
                  ""
                }
                className="mt-1.5 h-10"
                placeholder={
                  income
                    ? "e.g. Monthly allowance"
                    : "e.g. Campus cafe lunch"
                }
              />
            </label>

            {/* Date */}

            <label className="block text-sm font-semibold">
              Date

              <PremiumDatePicker
                name="date"
                required
                defaultValue={
                  editing?.transaction_date ||
                  new Date()
                    .toISOString()
                    .slice(
                      0,
                      10,
                    )
                }
                placeholder="Select transaction date"
                className="mt-1.5"
              />
            </label>

            {/* Recurring option */}

            <label className="flex cursor-pointer items-center gap-2 rounded-[16px] border border-border bg-card/60 p-3 text-sm">
              <input
                type="checkbox"
                checked={
                  recurring
                }
                onChange={(
                  event,
                ) =>
                  setRecurring(
                    event.target
                      .checked,
                  )
                }
                className="accent-primary"
              />

              <div>
                <p className="font-semibold">
                  Recurring transaction
                </p>

                <p className="text-xs text-muted-foreground">
                  Repeat this entry
                  automatically.
                </p>
              </div>
            </label>

            {recurring && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Frequency

                  <Select
                    name="recurring_frequency"
                    defaultValue={
                      editing?.recurring_frequency ||
                      "monthly"
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-10 w-full">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="weekly">
                        Weekly
                      </SelectItem>

                      <SelectItem value="monthly">
                        Monthly
                      </SelectItem>

                      <SelectItem value="yearly">
                        Yearly
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="block text-sm font-semibold">
                  End date

                  <PremiumDatePicker
                    name="recurring_end_date"
                    defaultValue={
                      editing?.recurring_end_date ||
                      ""
                    }
                    placeholder="No end date"
                    className="mt-1.5"
                  />
                </label>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={
                  saving
                }
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
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : `Add ${income
                      ? "Income"
                      : "Expense"
                    }`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* Budgets */

export function BudgetsPage() {
  const [items, setItems] = useState<BudgetRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetRecord | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [budgetResponse, categoryResponse] = await Promise.all([
        budgetService.list(currentMonth),
        categoryService.list("expense"),
      ]);

      setItems(budgetResponse.data.budgets);
      setCategories(categoryResponse.data.categories);
    } catch (error) {
      await notice(
        "Unable to load budgets",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const form = new FormData(event.currentTarget);

    const categoryId = Number(form.get("category_id"));
    const limit = Number(form.get("limit_amount"));

    if (categoryId < 1 || limit <= 0) {
      await notice(
        "Check your budget",
        "Select a category and enter an amount above zero.",
        "warning",
      );
      return;
    }

    try {
      setSaving(true);

      await budgetService.save({
        category_id: categoryId,
        month: currentMonth,
        limit_amount: limit,
      });

      await notice(
        "Budget saved",
        "Your monthly budget is now active.",
        "success",
      );

      refreshNotificationBadge();

      setOpen(false);
      setEditing(null);

      await loadData();
    } catch (error) {
      await notice(
        "Unable to save budget",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(budget: BudgetRecord) {
    const confirmed = await confirmAction(
      `Delete ${budget.category_name} budget?`,
      "This monthly budget will be removed.",
    );

    if (!confirmed) return;

    try {
      await budgetService.remove(budget.id);

      await notice("Budget deleted", "", "success");

      refreshNotificationBadge();

      await loadData();
    } catch (error) {
      await notice(
        "Delete failed",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Budgets"
        subtitle="Set real monthly limits and monitor your spending."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus />
            Create Budget
          </Button>
        }
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((budget) => {
            const Icon = categoryIcon(budget.category_name);

            const spent =
              Number(
                budget.spent,
              );

            const limit =
              Number(
                budget.limit_amount,
              );

            const isOver =
              limit > 0 &&
              spent > limit;

            const usedPercentage =
              limit > 0
                ? Math.min(
                  100,
                  Math.max(
                    0,
                    (spent / limit) *
                    100,
                  ),
                )
                : 0;

            const overAmount =
              Math.max(
                0,
                spent - limit,
              );

            const overPercentage =
              limit > 0
                ? Math.max(
                  0,
                  (overAmount / limit) *
                  100,
                )
                : 0;

            const remaining =
              Math.max(
                0,
                limit - spent,
              );

            return (
              <Panel key={budget.id}>
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-sage text-primary">
                    <Icon size={20} />
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isOver
                        ? "bg-peach text-destructive"
                        : usedPercentage >= 80
                          ? "bg-orange-soft text-warning"
                          : "bg-sage text-primary"
                      }`}
                  >
                    {isOver
                      ? "Exceeded"
                      : usedPercentage >= 80
                        ? "Near limit"
                        : "On track"}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-bold">
                  {budget.category_name}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="text-xl text-foreground">
                    {money(spent)}
                  </strong>
                  {" / "}
                  {money(limit)}
                </p>

                <div className="mt-4">
                  <Progress
                    value={
                      usedPercentage
                    }
                    tone={
                      isOver
                        ? "bg-destructive"
                        : usedPercentage >= 80
                          ? "bg-warning"
                          : "bg-primary"
                    }
                  />
                </div>

                <div className="mt-3 flex justify-between gap-3 text-xs text-muted-foreground">
                  <span
                    className={
                      isOver
                        ? "font-semibold text-destructive"
                        : undefined
                    }
                  >
                    {isOver
                      ? `${overPercentage.toFixed(0)}% over budget`
                      : `${usedPercentage.toFixed(0)}% used`}
                  </span>

                  <span
                    className={
                      isOver
                        ? "font-semibold text-destructive"
                        : undefined
                    }
                  >
                    {isOver
                      ? `Over by ${money(
                        overAmount,
                      )}`
                      : `${money(
                        remaining,
                      )} remaining`}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(budget);
                      setOpen(true);
                    }}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(budget)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No budgets yet"
          description="Create your first monthly category budget."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus />
              Create Budget
            </Button>
          }
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-[26px] border-border bg-card shadow-[var(--shadow-lift)]">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Budget" : "Create Budget"}
            </DialogTitle>

            <DialogDescription>
              Set a spending limit for this month.
            </DialogDescription>
          </DialogHeader>

          <form
            key={editing?.id ?? "new-budget"}
            onSubmit={save}
            className="space-y-4"
          >
            <label className="block text-sm font-semibold">
              Expense Category

              <Select
                name="category_id"
                required
                defaultValue={
                  editing
                    ? String(
                      editing.category_id,
                    )
                    : ""
                }
              >
                <SelectTrigger className="mt-2 h-10 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map(
                    (category) => (
                      <SelectItem
                        key={
                          category.id
                        }
                        value={String(
                          category.id,
                        )}
                      >
                        {
                          category.name
                        }
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </label>

            <label className="block text-sm font-semibold">
              Monthly Limit

              <Input
                name="limit_amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                defaultValue={editing ? Number(editing.limit_amount) : ""}
                className="mt-2 h-10"
              />
            </label>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Budget"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* Savings goals */

export function GoalsPage() {
  const [items, setItems] = useState<GoalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GoalRecord | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);

      const response = await goalService.list();

      setItems(response.data.goals);
    } catch (error) {
      await notice(
        "Unable to load goals",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const form = new FormData(event.currentTarget);

    const title = String(form.get("title") || "").trim();
    const target = Number(form.get("target_amount"));
    const saved = Number(form.get("saved_amount"));
    const date = String(form.get("target_date") || "");

    if (!title || target <= 0 || saved < 0) {
      await notice(
        "Check your goal",
        "Enter valid goal details.",
        "warning",
      );
      return;
    }

    const payload = {
      title,
      target_amount: target,
      saved_amount: saved,
      target_date: date || null,
      status: editing?.status ?? "active",
    } as const;

    try {
      setSaving(true);

      if (editing) {
        await goalService.update(editing.id, payload);
      } else {
        await goalService.create(payload);
      }

      await notice(
        editing ? "Goal updated" : "Goal created",
        "Your savings goal has been saved.",
        "success",
      );

      setOpen(false);
      setEditing(null);

      await loadGoals();
    } catch (error) {
      await notice(
        "Unable to save goal",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(goal: GoalRecord) {
    const confirmed = await confirmAction(
      `Delete ${goal.title}?`,
      "This savings goal will be permanently removed.",
    );

    if (!confirmed) return;

    try {
      await goalService.remove(goal.id);

      await notice("Goal deleted", "", "success");

      await loadGoals();
    } catch (error) {
      await notice(
        "Delete failed",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Savings Goals"
        subtitle="Turn your plans into measurable savings targets."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus />
            Create Goal
          </Button>
        }
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((goal) => {
            const target = Number(goal.target_amount);
            const saved = Number(goal.saved_amount);

            const percentage =
              target > 0
                ? Math.min(100, Math.round((saved / target) * 100))
                : 0;

            const Icon = goalIcon(goal.title);

            return (
              <Panel key={goal.id}>
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-orange-soft text-warning">
                    <Icon size={23} />
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${goal.status === "completed"
                      ? "bg-sage text-success"
                      : goal.status === "cancelled"
                        ? "bg-muted text-muted-foreground"
                        : "bg-blue-soft text-foreground"
                      }`}
                  >
                    {goal.status}
                  </span>
                </div>

                <h2 className="mt-6 text-lg font-bold">
                  {goal.title}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    {money(saved)}
                  </strong>
                  {" of "}
                  {money(target)}
                </p>

                <div className="mt-5">
                  <Progress value={percentage} />
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <strong className="text-primary">
                    {percentage}% saved
                  </strong>

                  <span className="text-muted-foreground">
                    {goal.target_date || "No deadline"}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(goal);
                      setOpen(true);
                    }}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(goal)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No savings goals yet"
          description="Create a target for something you want to save for."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus />
              Create Goal
            </Button>
          }
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-[26px] border-border bg-card shadow-[var(--shadow-lift)]">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Goal" : "Create Goal"}
            </DialogTitle>

            <DialogDescription>
              Give your savings a clear destination.
            </DialogDescription>
          </DialogHeader>

          <form
            key={editing?.id ?? "new-goal"}
            onSubmit={save}
            className="space-y-4"
          >
            <label className="block text-sm font-semibold">
              Goal Name

              <Input
                name="title"
                required
                maxLength={120}
                defaultValue={editing?.title ?? ""}
                className="mt-2 h-10"
                placeholder="e.g. New Laptop"
              />
            </label>

            <label className="block text-sm font-semibold">
              Target Amount

              <Input
                name="target_amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                defaultValue={
                  editing ? Number(editing.target_amount) : ""
                }
                className="mt-2 h-10"
              />
            </label>

            <label className="block text-sm font-semibold">
              Already Saved

              <Input
                name="saved_amount"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={
                  editing ? Number(editing.saved_amount) : 0
                }
                className="mt-2 h-10"
              />
            </label>

            <label className="block text-sm font-semibold">
              Target Date

              <PremiumDatePicker
                name="target_date"
                defaultValue={editing?.target_date ?? ""}
                placeholder="Select target date"
                className="mt-2"
              />
            </label>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Goal"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* Categories */

export function CategoriesPage({
  admin = false,
}: {
  admin?: boolean;
}) {
  const [
    tab,
    setTab,
  ] =
    useState<
      "expense" | "income"
    >("expense");

  const [
    items,
    setItems,
  ] =
    useState<CategoryRecord[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<CategoryRecord | null>(
      null,
    );

  /* Load categories */

  const loadCategories =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            admin
              ? await categoryService.adminList()
              : await categoryService.list();

          setItems(
            response.data.categories,
          );
        } catch (error) {
          await notice(
            "Categories unavailable",
            error instanceof Error
              ? error.message
              : "Categories could not be loaded.",
            "error",
          );

          setItems([]);
        } finally {
          setLoading(false);
        }
      },
      [admin],
    );

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  /* Create or update */

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

    const name =
      String(
        form.get("name") ||
          "",
      ).trim();

    if (!name) {
      await notice(
        "Category name required",
        "Enter a category name.",
        "warning",
      );

      return;
    }

    try {
      setSaving(true);

      let successTitle =
        "";

      let successMessage =
        "";

      if (admin) {
        if (editing) {
          await categoryService.adminUpdate(
            editing.id,
            {
              name,
              type: tab,

              is_active:
                Number(
                  editing.is_active,
                ) === 1,
            },
          );

          successTitle =
            "Category updated";

          successMessage =
            "The default category has been updated.";
        } else {
          await categoryService.adminCreate(
            {
              name,
              type: tab,
            },
          );

          successTitle =
            "Default category created";

          successMessage =
            `${name} is now available as a system category.`;
        }
      } else {
        if (editing) {
          await categoryService.update(
            editing.id,
            {
              name,
              type: tab,
            },
          );

          successTitle =
            "Category updated";

          successMessage =
            "Your personal category has been updated.";
        } else {
          await categoryService.create(
            {
              name,
              type: tab,
            },
          );

          successTitle =
            "Category created";

          successMessage =
            `${name} has been added to your categories.`;
        }
      }

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

      await loadCategories();
    } catch (error) {
      await notice(
        "Unable to save category",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  /* Delete item */

  async function remove(
    category: CategoryRecord,
  ) {
    const confirmed =
      await confirmAction(
        admin
          ? `Remove ${category.name}?`
          : `Delete ${category.name}?`,

        admin
          ? "If this category is already used by transactions, Campus Coin will disable it instead of permanently deleting it."
          : "A personal category that is already used by transactions cannot be deleted.",
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        admin
          ? await categoryService.adminRemove(
            category.id,
          )
          : await categoryService.remove(
            category.id,
          );

      await notice(
        admin
          ? "Category updated"
          : "Category deleted",

        response.message,

        "success",
      );

      await loadCategories();
    } catch (error) {
      await notice(
        "Unable to delete category",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    }
  }

  const visibleCategories =
    items.filter(
      (category) =>
        category.type === tab,
    );

  const activeCount =
    items.filter(
      (category) =>
        Number(
          category.is_active,
        ) === 1,
    ).length;

  const disabledCount =
    items.length -
    activeCount;

  const expenseCount =
    items.filter(
      (category) =>
        category.type ===
        "expense",
    ).length;

  const incomeCount =
    items.filter(
      (category) =>
        category.type ===
        "income",
    ).length;

  if (admin) {
    return (
      <div className="admin-categories-premium">
        <PageHeader
          title="Global Categories"
          subtitle="Manage the default income and expense categories available across Campus Coin."
          action={
            <Button
              className="premium-btn h-11 px-5"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus size={17} />

              Add Category
            </Button>
          }
        />

        {/* Summary */}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="admin-category-stat">
            <span className="admin-category-stat-icon is-total">
              <Globe size={17} />
            </span>

            <div>
              <p>
                Global Categories
              </p>

              <strong>
                {items.length}
              </strong>
            </div>
          </div>

          <div className="admin-category-stat">
            <span className="admin-category-stat-icon is-expense">
              <ReceiptText size={17} />
            </span>

            <div>
              <p>
                Expense
              </p>

              <strong>
                {expenseCount}
              </strong>
            </div>
          </div>

          <div className="admin-category-stat">
            <span className="admin-category-stat-icon is-income">
              <Wallet size={17} />
            </span>

            <div>
              <p>
                Income
              </p>

              <strong>
                {incomeCount}
              </strong>
            </div>
          </div>

          <div className="admin-category-stat">
            <span className="admin-category-stat-icon is-active">
              <Check size={17} />
            </span>

            <div>
              <p>
                Active
              </p>

              <strong>
                {activeCount}
              </strong>

              {disabledCount > 0 && (
                <small>
                  {disabledCount} disabled
                </small>
              )}
            </div>
          </div>
        </section>

        {/* Filter tabs */}

        <div className="admin-category-tabs mb-5">
          <button
            type="button"
            className={
              tab ===
                "expense"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setTab(
                "expense",
              )
            }
          >
            <ReceiptText
              size={15}
            />

            <span>
              Expense Categories
            </span>

            <em>
              {expenseCount}
            </em>
          </button>

          <button
            type="button"
            className={
              tab ===
                "income"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setTab(
                "income",
              )
            }
          >
            <Wallet
              size={15}
            />

            <span>
              Income Categories
            </span>

            <em>
              {incomeCount}
            </em>
          </button>
        </div>

        {/* Category list */}

        <Panel className="admin-category-panel overflow-hidden !p-0">
          <div className="admin-category-panel-head flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6">
            <div>
              <p className="text-sm font-bold text-foreground">
                {tab ===
                  "expense"
                  ? "Default Expense Categories"
                  : "Default Income Categories"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {visibleCategories.length}{" "}
                {visibleCategories.length ===
                  1
                  ? "category"
                  : "categories"}{" "}
                in this group
              </p>
            </div>

            <span className="admin-panel-chip">
              System defaults
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center border-t border-border/60">
              <div className="text-center">
                <div className="admin-dashboard-loader-ring mx-auto !size-9" />

                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                  Loading global categories...
                </p>
              </div>
            </div>
          ) : visibleCategories.length ? (
            <div className="admin-category-grid border-t border-border/60">
              {visibleCategories.map(
                (
                  category,
                  index,
                ) => {
                  const Icon =
                    categoryIcon(
                      category.name,
                    );

                  const isActive =
                    Number(
                      category.is_active,
                    ) === 1;

                  const isDefault =
                    Number(
                      category.is_default,
                    ) === 1;

                  return (
                    <article
                      key={
                        category.id
                      }
                      className="admin-category-item"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className={`admin-category-icon ${
                            isActive
                              ? "is-active"
                              : "is-disabled"
                          }`}
                        >
                          <Icon
                            size={18}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="admin-category-index">
                              #
                              {index +
                                1}
                            </span>

                            <span className="admin-category-default">
                              {isDefault
                                ? "Default"
                                : "Custom"}
                            </span>

                            <span
                              className={`admin-category-status ${
                                isActive
                                  ? "is-active"
                                  : "is-disabled"
                              }`}
                            >
                              <i />

                              {isActive
                                ? "Active"
                                : "Disabled"}
                            </span>
                          </div>

                          <h3 className="mt-3 truncate text-[15px] font-bold text-foreground">
                            {
                              category.name
                            }
                          </h3>

                          <p className="mt-1 text-[11px] capitalize text-muted-foreground">
                            {category.type} category · Campus Coin system category
                          </p>
                        </div>
                      </div>

                      <div className="admin-category-actions">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="admin-category-action"
                          title="Edit category"
                          aria-label={`Edit ${category.name}`}
                          onClick={() => {
                            setEditing(
                              category,
                            );

                            setTab(
                              category.type,
                            );

                            setOpen(
                              true,
                            );
                          }}
                        >
                          <Pencil
                            size={15}
                          />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="admin-category-action is-danger"
                          title="Remove category"
                          aria-label={`Remove ${category.name}`}
                          onClick={() =>
                            remove(
                              category,
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
                title="No categories found"
                description={`Create the first default ${tab} category for Campus Coin.`}
                action={
                  <Button
                    className="premium-btn"
                    onClick={() => {
                      setEditing(
                        null,
                      );

                      setOpen(
                        true,
                      );
                    }}
                  >
                    <Plus
                      size={16}
                    />

                    Add Category
                  </Button>
                }
              />
            </div>
          )}
        </Panel>

        {/* Create / edit dialog */}

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
          <DialogContent className="admin-category-dialog max-w-md">
            <div className="admin-category-dialog-glow" />

            <DialogHeader className="relative z-10">
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={`admin-category-dialog-icon ${
                    tab ===
                      "expense"
                      ? "is-expense"
                      : "is-income"
                  }`}
                >
                  {tab ===
                    "expense" ? (
                    <ReceiptText
                      size={17}
                    />
                  ) : (
                    <Wallet
                      size={17}
                    />
                  )}
                </span>

                <div>
                  <DialogTitle className="text-xl font-bold tracking-[-0.025em]">
                    {editing
                      ? "Edit"
                      : "Add"}{" "}
                    Default Category
                  </DialogTitle>

                  <DialogDescription className="mt-1">
                    This category will be available across Campus Coin.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form
              key={
                editing?.id ??
                `admin-new-${tab}`
              }
              onSubmit={save}
              className="relative z-10 mt-2 space-y-4"
            >
              <label className="block text-sm font-semibold">
                Category name

                <Input
                  name="name"
                  defaultValue={
                    editing?.name ||
                    ""
                  }
                  maxLength={80}
                  required
                  placeholder={
                    tab ===
                      "expense"
                      ? "e.g. Health & Fitness"
                      : "e.g. Freelancing"
                  }
                  className="admin-category-input mt-2 h-11"
                />
              </label>

              <div className="admin-category-type-card">
                <span
                  className={
                    tab ===
                      "expense"
                      ? "is-expense"
                      : "is-income"
                  }
                >
                  {tab ===
                    "expense" ? (
                    <ReceiptText
                      size={15}
                    />
                  ) : (
                    <Wallet
                      size={15}
                    />
                  )}

                  {tab}
                </span>

                <p>
                  The category type follows the selected tab.
                </p>
              </div>

              {editing &&
                Number(
                  editing.is_active,
                ) !== 1 && (
                  <div className="admin-category-disabled-note">
                    <Info
                      size={14}
                    />

                    <span>
                      This category is currently disabled. Saving changes keeps its existing active status.
                    </span>
                  </div>
                )}

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
                      : "Create Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={
          admin
            ? "Manage Global Categories"
            : "Manage Categories"
        }
        subtitle={
          admin
            ? "Manage the default income and expense categories available across Campus Coin."
            : "Create personal categories while keeping the built-in student categories."
        }
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus />

            Add Category
          </Button>
        }
      />

      {/* Category tabs */}

      <div className="mb-5 flex gap-2 overflow-x-auto border-b border-border">
        <Button
          variant="ghost"
          onClick={() =>
            setTab(
              "expense",
            )
          }
          className={`shrink-0 rounded-none border-b-2 px-4 ${tab ===
            "expense"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground"
            }`}
        >
          Expense Categories
        </Button>

        <Button
          variant="ghost"
          onClick={() =>
            setTab(
              "income",
            )
          }
          className={`shrink-0 rounded-none border-b-2 px-4 ${tab ===
            "income"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground"
            }`}
        >
          Income Categories
        </Button>
      </div>

      <Panel className="!p-0">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto size-9 animate-spin rounded-full border-4 border-muted border-t-primary" />

              <p className="mt-3 text-sm text-muted-foreground">
                Loading categories...
              </p>
            </div>
          </div>
        ) : visibleCategories.length ? (
          <div className="divide-y divide-border">
            {visibleCategories.map(
              (
                category,
              ) => {
                const Icon =
                  categoryIcon(
                    category.name,
                  );

                const isDefault =
                  Number(
                    category.is_default,
                  ) === 1;

                const isActive =
                  Number(
                    category.is_active,
                  ) === 1;

                const editable =
                  admin ||
                  !isDefault;

                return (
                  <div
                    key={
                      category.id
                    }
                    className="flex flex-wrap items-center gap-3 px-5 py-4"
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${isActive
                        ? "bg-sage text-primary"
                        : "bg-muted text-muted-foreground"
                        }`}
                    >
                      <Icon
                        size={18}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {
                          category.name
                        }
                      </p>

                      <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                        {
                          category.type
                        }{" "}
                        category
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isDefault
                          ? "bg-sage text-primary"
                          : "bg-blue-soft text-foreground"
                          }`}
                      >
                        {isDefault
                          ? "Default"
                          : "Personal"}
                      </span>

                      {admin &&
                        !isActive && (
                          <span className="rounded-full bg-peach px-2.5 py-1 text-xs font-semibold text-destructive">
                            Disabled
                          </span>
                        )}
                    </div>

                    {editable && (
                      <div className="ml-auto flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          aria-label={`Edit ${category.name}`}
                          onClick={() => {
                            setEditing(
                              category,
                            );

                            setTab(
                              category.type,
                            );

                            setOpen(
                              true,
                            );
                          }}
                        >
                          <Pencil
                            size={
                              16
                            }
                          />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          aria-label={`Delete ${category.name}`}
                          onClick={() =>
                            remove(
                              category,
                            )
                          }
                        >
                          <Trash2
                            size={
                              16
                            }
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No categories found"
              description={
                admin
                  ? "Create a default category for Campus Coin."
                  : "Create your first personal category."
              }
              action={
                <Button
                  onClick={() => {
                    setEditing(
                      null,
                    );

                    setOpen(
                      true,
                    );
                  }}
                >
                  <Plus />

                  Add Category
                </Button>
              }
            />
          </div>
        )}
      </Panel>

      {/* Create / edit category */}

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
        <DialogContent className="max-w-md rounded-[26px] border-border bg-card shadow-[var(--shadow-lift)]">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? "Edit"
                : "Add"}{" "}
              {admin
                ? "Default Category"
                : "Personal Category"}
            </DialogTitle>

            <DialogDescription>
              {admin
                ? "This category will be available as a Campus Coin system category."
                : `Create your own ${tab} category.`}
            </DialogDescription>
          </DialogHeader>

          <form
            key={
              editing?.id ??
              `new-${tab}`
            }
            onSubmit={save}
            className="space-y-4"
          >
            <label className="block text-sm font-semibold">
              Category name

              <Input
                name="name"
                defaultValue={
                  editing?.name ||
                  ""
                }
                maxLength={80}
                required
                placeholder={
                  tab ===
                    "expense"
                    ? "e.g. Gym"
                    : "e.g. Freelancing"
                }
                className="mt-2 h-10"
              />
            </label>

            <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              Type:{" "}

              <strong className="capitalize text-foreground">
                {tab}
              </strong>
            </div>

            {!admin && (
              <p className="text-xs leading-5 text-muted-foreground">
                Default Campus Coin
                categories cannot be
                edited by students.
                Personal categories
                belong only to your
                account.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={
                  saving
                }
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
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* Reports */

export function ReportsPage() {
  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  function getMonthBounds(
    selectedMonth: string,
  ) {
    const [
      yearText,
      monthText,
    ] = selectedMonth.split("-");

    const year = Number(yearText);
    const monthNumber =
      Number(monthText);

    const lastDay = new Date(
      year,
      monthNumber,
      0,
    ).getDate();

    return {
      from: `${selectedMonth}-01`,
      to: `${selectedMonth}-${String(
        lastDay,
      ).padStart(2, "0")}`,
    };
  }

  const initialRange =
    getMonthBounds(currentMonth);

  const [
    month,
    setMonth,
  ] = useState(currentMonth);

  const [
    dateFrom,
    setDateFrom,
  ] = useState(initialRange.from);

  const [
    dateTo,
    setDateTo,
  ] = useState(initialRange.to);

  const [
    reportType,
    setReportType,
  ] = useState<
    "all" | "income" | "expense"
  >("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    summary,
    setSummary,
  ] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [
    categories,
    setCategories,
  ] = useState<
    MonthlyReport["categories"]
  >([]);

  const [
    transactions,
    setTransactions,
  ] = useState<
    MonthlyReport["transactions"]
  >([]);

  const [
    trend,
    setTrend,
  ] = useState<
    Array<{
      month: string;
      income: number;
      expense: number;
    }>
  >([]);

  const [
    daily,
    setDaily,
  ] = useState<
    Array<{
      date: string;
      expense: number | string;
    }>
  >([]);

  const [
    weekly,
    setWeekly,
  ] = useState<
    Array<{
      week_number: number;
      week_start: string;
      week_end: string;
      expense: number | string;
    }>
  >([]);

  /* Load report data */

  const loadReports =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          if (
            !dateFrom ||
            !dateTo ||
            dateFrom > dateTo
          ) {
            throw new Error(
              "Please choose a valid date range.",
            );
          }

          const [
            customReport,
            sixMonths,
            dailyWeekly,
          ] =
            await Promise.all([
              reportService.custom(
                dateFrom,
                dateTo,
              ),
              reportService.sixMonths(),
              reportService.dailyWeekly(
                month,
              ),
            ]);

          setSummary(
            customReport.data.summary,
          );

          setCategories(
            customReport.data.categories,
          );

          setTransactions(
            customReport.data.transactions,
          );

          setTrend(
            sixMonths.data.months,
          );

          setDaily(
            dailyWeekly.data.daily,
          );

          setWeekly(
            dailyWeekly.data.weekly,
          );
        } catch (requestError) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Please try again.";

          setError(message);

          await notice(
            "Reports unavailable",
            message,
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
      [month, dateFrom, dateTo],
    );

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  /* Reset category when report type changes */

  useEffect(() => {
    setCategoryFilter("all");
  }, [reportType]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

          <p className="mt-3 text-sm text-muted-foreground">
            Generating your reports...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Reports unavailable"
        description={error}
        action={
          <Button
            onClick={() =>
              void loadReports()
            }
          >
            Try Again
          </Button>
        }
      />
    );
  }

  /* Filter options */

  const availableCategories =
    categories.filter((category) => {
      if (reportType === "all") {
        return true;
      }

      return (
        category.type === reportType
      );
    });

  const monthRange =
    getMonthBounds(month);

  const filtersActive =
    reportType !== "all" ||
    categoryFilter !== "all" ||
    dateFrom !== monthRange.from ||
    dateTo !== monthRange.to;

  /* Filter monthly transactions */

  const filteredTransactions =
    transactions.filter(
      (transaction) => {
        const matchesType =
          reportType === "all" ||
          transaction.type ===
          reportType;

        const matchesCategory =
          categoryFilter === "all" ||
          transaction.category_name ===
          categoryFilter;

        const matchesFrom =
          !dateFrom ||
          transaction.transaction_date >=
          dateFrom;

        const matchesTo =
          !dateTo ||
          transaction.transaction_date <=
          dateTo;

        return (
          matchesType &&
          matchesCategory &&
          matchesFrom &&
          matchesTo
        );
      },
    );

  /* Filtered summary */

  const filteredIncome =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === "income",
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount),
        0,
      );

  const filteredExpense =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense",
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount),
        0,
      );

  const visibleSummary =
    filtersActive
      ? {
        income: filteredIncome,
        expense: filteredExpense,
        balance:
          filteredIncome -
          filteredExpense,
      }
      : {
        income: Number(
          summary.income,
        ),
        expense: Number(
          summary.expense,
        ),
        balance: Number(
          summary.balance,
        ),
      };

  /* Expense category breakdown */

  const expenseCategoryMap =
    new Map<string, number>();

  filteredTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .forEach((transaction) => {
      expenseCategoryMap.set(
        transaction.category_name,
        (expenseCategoryMap.get(
          transaction.category_name,
        ) ?? 0) +
        Number(transaction.amount),
      );
    });

  const expenseCategories =
    Array.from(
      expenseCategoryMap.entries(),
    )
      .map(([name, total]) => ({
        name,
        total,
      }))
      .sort(
        (a, b) =>
          b.total - a.total,
      );

  /* Daily summary */

  const filteredDailyMap =
    new Map<string, number>();

  filteredTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .forEach((transaction) => {
      filteredDailyMap.set(
        transaction.transaction_date,
        (filteredDailyMap.get(
          transaction.transaction_date,
        ) ?? 0) +
        Number(transaction.amount),
      );
    });

  const calculatedDaily =
    Array.from(
      filteredDailyMap.entries(),
    )
      .sort(
        ([dateA], [dateB]) =>
          dateA.localeCompare(dateB),
      )
      .map(([date, expense]) => ({
        date,
        expense,
      }));

  const dailyChartData =
    filtersActive
      ? calculatedDaily
      : daily.map((item) => ({
        date: item.date,
        expense: Number(
          item.expense,
        ),
      }));

  /* Weekly summary across month boundaries */

  const filteredWeeklyMap =
    new Map<
      string,
      {
        weekStart: string;
        expense: number;
      }
    >();

  filteredTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .forEach((transaction) => {
      const date = new Date(
        `${transaction.transaction_date}T12:00:00`,
      );

      const day = date.getDay();
      const diffToMonday =
        day === 0 ? -6 : 1 - day;

      const monday = new Date(date);
      monday.setDate(
        date.getDate() + diffToMonday,
      );

      const weekStart =
        monday.toISOString().slice(0, 10);

      const current =
        filteredWeeklyMap.get(weekStart);

      filteredWeeklyMap.set(
        weekStart,
        {
          weekStart,
          expense:
            (current?.expense ?? 0) +
            Number(transaction.amount),
        },
      );
    });

  const calculatedWeekly =
    Array.from(
      filteredWeeklyMap.values(),
    )
      .sort((a, b) =>
        a.weekStart.localeCompare(
          b.weekStart,
        ),
      )
      .map((item, index) => ({
        week_number: index + 1,
        expense: item.expense,
        label: new Date(
          `${item.weekStart}T12:00:00`,
        ).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        ),
      }));

  const weeklyChartData =
    filtersActive
      ? calculatedWeekly
      : weekly.map((item) => ({
        week_number:
          item.week_number,
        expense: Number(
          item.expense,
        ),
        label: `Week ${item.week_number}`,
      }));

  const weeklyTotal =
    weeklyChartData.reduce(
      (total, item) =>
        total +
        Number(item.expense),
      0,
    );

  const dailyAverage =
    dailyChartData.length > 0
      ? dailyChartData.reduce(
        (total, item) =>
          total +
          Number(item.expense),
        0,
      ) /
      dailyChartData.length
      : 0;

  const monthLabel =
    new Date(
      `${month}-01T12:00:00`,
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      },
    );

  function formatReportDate(
    value: string,
  ) {
    return new Date(
      `${value}T12:00:00`,
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  }

  const rangeLabel =
    dateFrom === monthRange.from &&
      dateTo === monthRange.to
      ? monthLabel
      : `${formatReportDate(
        dateFrom,
      )} – ${formatReportDate(
        dateTo,
      )}`;

  /* Reset filters */

  function resetFilters() {
    const range =
      getMonthBounds(month);

    setDateFrom(range.from);
    setDateTo(range.to);
    setReportType("all");
    setCategoryFilter("all");
  }

  /* Print and PDF export */

  function escapeHtml(
    value: string,
  ) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function exportPdf() {
    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1050,height=800",
      );

    if (!printWindow) {
      await notice(
        "Export blocked",
        "Please allow pop-ups for Campus Coin and try again.",
        "warning",
      );

      return;
    }

    const rows =
      filteredTransactions
        .map((transaction) => {
          const description =
            escapeHtml(
              transaction.description ||
              "Transaction",
            );

          const category =
            escapeHtml(
              transaction.category_name,
            );

          const type =
            escapeHtml(
              transaction.type,
            );

          const date =
            escapeHtml(
              transaction.transaction_date,
            );

          return `
            <tr>
              <td>${date}</td>
              <td>${description}</td>
              <td>${category}</td>
              <td style="text-transform:capitalize">${type}</td>
              <td style="text-align:right">${money(
            Number(
              transaction.amount,
            ),
          )}</td>
            </tr>
          `;
        })
        .join("");

    const reportTypeLabel =
      reportType === "all"
        ? "All transactions"
        : reportType === "income"
          ? "Income"
          : "Expenses";

    const categoryLabel =
      categoryFilter === "all"
        ? "All categories / sources"
        : categoryFilter;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Campus Coin Report - ${escapeHtml(
      rangeLabel,
    )}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 36px;
              color: #17251d;
              font-family: Arial, Helvetica, sans-serif;
              background: #ffffff;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 24px;
              padding-bottom: 20px;
              border-bottom: 2px solid #dfe7e1;
            }

            .brand {
              font-size: 24px;
              font-weight: 800;
            }

            .brand span {
              color: #2f6f4e;
            }

            h1 {
              margin: 8px 0 0;
              font-size: 30px;
            }

            .muted {
              color: #637269;
            }

            .filters {
              margin-top: 22px;
              padding: 14px 16px;
              border: 1px solid #dfe7e1;
              border-radius: 10px;
              font-size: 13px;
              line-height: 1.7;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              margin-top: 20px;
            }

            .card {
              padding: 16px;
              border: 1px solid #dfe7e1;
              border-radius: 10px;
            }

            .card small {
              display: block;
              margin-bottom: 7px;
              color: #637269;
            }

            .card strong {
              font-size: 21px;
            }

            table {
              width: 100%;
              margin-top: 24px;
              border-collapse: collapse;
              font-size: 12px;
            }

            th,
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #e7ece8;
              text-align: left;
            }

            th {
              background: #f4f7f5;
            }

            .footer {
              margin-top: 24px;
              color: #637269;
              font-size: 11px;
            }

            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div>
              <div class="brand">
                Campus<span>Coin</span>
              </div>

              <h1>
                ${escapeHtml(
      rangeLabel,
    )} Financial Report
              </h1>

              <p class="muted">
                Student finance summary generated from Campus Coin.
              </p>
            </div>

            <div class="muted">
              Generated:
              ${escapeHtml(
      new Date().toLocaleString(),
    )}
            </div>
          </div>

          <div class="filters">
            <strong>Applied filters</strong><br />
            Type: ${escapeHtml(
      reportTypeLabel,
    )}<br />
            Category / Income Source:
            ${escapeHtml(
      categoryLabel,
    )}<br />
            Date range:
            ${escapeHtml(
      dateFrom,
    )}
            to
            ${escapeHtml(
      dateTo,
    )}
          </div>

          <div class="summary">
            <div class="card">
              <small>Income</small>
              <strong>
                ${money(
      Number(
        visibleSummary.income,
      ),
    )}
              </strong>
            </div>

            <div class="card">
              <small>Expenses</small>
              <strong>
                ${money(
      Number(
        visibleSummary.expense,
      ),
    )}
              </strong>
            </div>

            <div class="card">
              <small>Balance</small>
              <strong>
                ${money(
      Number(
        visibleSummary.balance,
      ),
    )}
              </strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category / Source</th>
                <th>Type</th>
                <th style="text-align:right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              ${rows ||
      `
                  <tr>
                    <td colspan="5">
                      No transactions match the selected filters.
                    </td>
                  </tr>
                `
      }
            </tbody>
          </table>

          <p class="footer">
            Campus Coin · Smart Spending, Student Style.
          </p>

          <script>
            window.addEventListener(
              "load",
              function () {
                setTimeout(
                  function () {
                    window.print();
                  },
                  250
                );
              }
            );
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Review any date range, compare income and expenses, apply filters, and export a PDF."
        action={
          <Button
            type="button"
            onClick={() =>
              void exportPdf()
            }
          >
            <Download size={17} />

            Export PDF
          </Button>
        }
      />

      {/* Report filters */}

      <Panel className="mb-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold">
              Report Filters
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Choose any date range, then filter by
              transaction type, category, or income
              source.
            </p>
          </div>

          {filtersActive && (
            <Button
              type="button"
              variant="ghost"
              onClick={
                resetFilters
              }
            >
              Reset Filters
            </Button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">

          {/* Report month */}

          <label className="text-xs font-semibold text-muted-foreground">
            Report Month

            <PremiumMonthPicker
              value={month}
              onValueChange={(
                nextMonth,
              ) => {
                if (
                  !nextMonth
                ) {
                  return;
                }

                const nextRange =
                  getMonthBounds(
                    nextMonth,
                  );

                setMonth(
                  nextMonth,
                );

                setDateFrom(
                  nextRange.from,
                );

                setDateTo(
                  nextRange.to,
                );

                setReportType(
                  "all",
                );

                setCategoryFilter(
                  "all",
                );
              }}
              placeholder="Select report month"
              className="mt-1.5"
            />
          </label>

          {/* Transaction type */}

          <label className="text-xs font-semibold text-muted-foreground">
            Transaction Type

            <Select
              value={reportType}
              onValueChange={(
                value,
              ) =>
                setReportType(
                  value as
                  | "all"
                  | "income"
                  | "expense",
                )
              }
            >
              <SelectTrigger className="mt-1.5 h-10 w-full">
                <SelectValue placeholder="All Transactions" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Transactions
                </SelectItem>

                <SelectItem value="expense">
                  Expenses
                </SelectItem>

                <SelectItem value="income">
                  Income
                </SelectItem>
              </SelectContent>
            </Select>
          </label>

          {/* Category or income source */}

          <label className="text-xs font-semibold text-muted-foreground">
            {reportType === "income"
              ? "Income Source"
              : reportType ===
                "expense"
                ? "Expense Category"
                : "Category / Income Source"}

            <Select
              value={
                categoryFilter
              }
              onValueChange={(
                value,
              ) =>
                setCategoryFilter(
                  value,
                )
              }
            >
              <SelectTrigger className="mt-1.5 h-10 w-full">
                <SelectValue
                  placeholder={
                    reportType ===
                      "income"
                      ? "All Income Sources"
                      : reportType ===
                        "expense"
                        ? "All Expense Categories"
                        : "All Categories / Sources"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  {reportType ===
                    "income"
                    ? "All Income Sources"
                    : reportType ===
                      "expense"
                      ? "All Expense Categories"
                      : "All Categories / Sources"}
                </SelectItem>

                {availableCategories.map(
                  (category) => (
                    <SelectItem
                      key={`${category.type}-${category.category_id}`}
                      value={
                        category.name
                      }
                    >
                      {category.name}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </label>

          {/* Start date */}

          <label className="text-xs font-semibold text-muted-foreground">
            From Date

            <PremiumDatePicker
              value={dateFrom}
              max={dateTo}
              required
              onValueChange={(
                nextDate,
              ) => {
                if (
                  nextDate
                ) {
                  setDateFrom(
                    nextDate,
                  );
                }
              }}
              placeholder="From date"
              className="mt-1.5"
            />
          </label>

          {/* End date */}

          <label className="text-xs font-semibold text-muted-foreground">
            To Date

            <PremiumDatePicker
              value={dateTo}
              min={dateFrom}
              required
              onValueChange={(
                nextDate,
              ) => {
                if (
                  nextDate
                ) {
                  setDateTo(
                    nextDate,
                  );
                }
              }}
              placeholder="To date"
              className="mt-1.5"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays
            size={15}
          />

          <span>
            Showing{" "}
            {
              filteredTransactions.length
            }{" "}
            transaction
            {filteredTransactions.length ===
              1
              ? ""
              : "s"}{" "}
            for {rangeLabel}.
          </span>
        </div>
      </Panel>

      {/* Summary cards */}

      <div className="grid gap-4 sm:grid-cols-3">
        <Panel>
          <p className="text-sm text-muted-foreground">
            Income
          </p>

          <strong className="mt-2 block text-2xl text-success">
            {money(
              Number(
                visibleSummary.income,
              ),
            )}
          </strong>
        </Panel>

        <Panel>
          <p className="text-sm text-muted-foreground">
            Expenses
          </p>

          <strong className="mt-2 block text-2xl text-destructive">
            {money(
              Number(
                visibleSummary.expense,
              ),
            )}
          </strong>
        </Panel>

        <Panel>
          <p className="text-sm text-muted-foreground">
            Balance
          </p>

          <strong className="mt-2 block text-2xl">
            {money(
              Number(
                visibleSummary.balance,
              ),
            )}
          </strong>
        </Panel>
      </div>

      {/* Six month trend + category breakdown */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">

        <Panel>
          <PanelHeading
            title="Income vs. Expense — Last 6 Months"
          />

          {trend.length ? (
            <div className="h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={trend}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(
                      value,
                    ) =>
                      money(
                        Number(
                          value,
                        ),
                      )
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="income"
                    fill="var(--chart-1)"
                    name="Income"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="expense"
                    fill="var(--chart-2)"
                    name="Expense"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No trend data"
              description="Add transactions across different months to build your six-month trend."
            />
          )}
        </Panel>

        <Panel>
          <PanelHeading
            title="Category Spending"
          />

          {expenseCategories.length ? (
            <div className="space-y-3">
              {expenseCategories.map(
                (category) => (
                  <div
                    key={
                      category.name
                    }
                    className="flex items-center justify-between gap-4 rounded-[16px] border border-border bg-card/60 p-3"
                  >
                    <CategoryBadge
                      category={
                        category.name
                      }
                    />

                    <strong>
                      {money(
                        Number(
                          category.total,
                        ),
                      )}
                    </strong>
                  </div>
                ),
              )}
            </div>
          ) : (
            <EmptyState
              title="No spending data"
              description="No expense transactions match the selected filters."
            />
          )}
        </Panel>
      </div>

      {/* Daily + weekly summary */}

      <div className="mt-5 grid gap-5 xl:grid-cols-2">

        <Panel>
          <PanelHeading
            title="Daily Spending Summary"
          />

          {dailyChartData.length ? (
            <>
              <div className="h-[280px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={
                      dailyChartData
                    }
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                    />

                    <XAxis
                      dataKey="date"
                      tickFormatter={(
                        value,
                      ) =>
                        String(
                          value,
                        ).slice(
                          8,
                          10,
                        )
                      }
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(
                        value,
                      ) =>
                        money(
                          Number(
                            value,
                          ),
                        )
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="expense"
                      name="Expense"
                      stroke="var(--chart-2)"
                      fill="var(--chart-2)"
                      fillOpacity={
                        0.16
                      }
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 rounded-xl bg-muted/45 p-4">
                <p className="text-xs text-muted-foreground">
                  Average spending on
                  active spending days
                </p>

                <strong className="mt-1 block text-xl">
                  {money(
                    dailyAverage,
                  )}
                </strong>
              </div>
            </>
          ) : (
            <EmptyState
              title="No daily spending"
              description="No expense transactions match the selected date range."
            />
          )}
        </Panel>

        <Panel>
          <PanelHeading
            title="Weekly Spending Summary"
          />

          {weeklyChartData.length ? (
            <>
              <div className="h-[280px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={
                      weeklyChartData
                    }
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                    />

                    <XAxis
                      dataKey="label"
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(
                        value,
                      ) =>
                        money(
                          Number(
                            value,
                          ),
                        )
                      }
                    />

                    <Bar
                      dataKey="expense"
                      name="Expense"
                      fill="var(--chart-2)"
                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 rounded-xl bg-muted/45 p-4">
                <p className="text-xs text-muted-foreground">
                  Total spending in
                  selected period
                </p>

                <strong className="mt-1 block text-xl">
                  {money(
                    weeklyTotal,
                  )}
                </strong>
              </div>
            </>
          ) : (
            <EmptyState
              title="No weekly spending"
              description="No expense transactions match the selected filters."
            />
          )}
        </Panel>
      </div>

      {/* Filtered transaction detail */}

      <div className="mt-5">
        <Panel>
          <PanelHeading
            title="Report Transactions"
            action={
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText
                  size={14}
                />

                {
                  filteredTransactions.length
                }{" "}
                record
                {filteredTransactions.length ===
                  1
                  ? ""
                  : "s"}
              </span>
            }
          />

          {filteredTransactions.length ? (
            <>
              {/* Desktop view */}

              <div className="table-shell hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-y border-border bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="p-3">
                        Date
                      </th>

                      <th className="p-3">
                        Description
                      </th>

                      <th className="p-3">
                        Category / Source
                      </th>

                      <th className="p-3">
                        Type
                      </th>

                      <th className="p-3 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map(
                      (
                        transaction,
                      ) => (
                        <tr
                          key={
                            transaction.id
                          }
                          className="border-b border-border"
                        >
                          <td className="whitespace-nowrap p-3 text-muted-foreground">
                            {new Date(
                              `${transaction.transaction_date}T12:00:00`,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month:
                                  "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </td>

                          <td className="p-3 font-medium">
                            {transaction.description ||
                              "Transaction"}
                          </td>

                          <td className="p-3">
                            <CategoryBadge
                              category={
                                transaction.category_name
                              }
                            />
                          </td>

                          <td className="p-3 capitalize">
                            {
                              transaction.type
                            }
                          </td>

                          <td
                            className={`p-3 text-right font-bold ${transaction.type ===
                              "income"
                              ? "text-success"
                              : "text-destructive"
                              }`}
                          >
                            {transaction.type ===
                              "income"
                              ? "+"
                              : "−"}

                            {money(
                              Number(
                                transaction.amount,
                              ),
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}

              <div className="space-y-3 md:hidden">
                {filteredTransactions.map(
                  (
                    transaction,
                  ) => (
                    <div
                      key={
                        transaction.id
                      }
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {transaction.description ||
                              "Transaction"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              transaction.transaction_date
                            }
                          </p>
                        </div>

                        <strong
                          className={
                            transaction.type ===
                              "income"
                              ? "text-success"
                              : "text-destructive"
                          }
                        >
                          {transaction.type ===
                            "income"
                            ? "+"
                            : "−"}

                          {money(
                            Number(
                              transaction.amount,
                            ),
                          )}
                        </strong>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <CategoryBadge
                          category={
                            transaction.category_name
                          }
                        />

                        <span className="text-xs capitalize text-muted-foreground">
                          {
                            transaction.type
                          }
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </>
          ) : (
            <EmptyState
              title="No matching report data"
              description="Try changing the report filters or add transactions for this month."
            />
          )}
        </Panel>
      </div>
    </>
  );
}

/* Insights and saving tips */

export function InsightPage({
  tips = false,
}: {
  tips?: boolean;
}) {
  const [
    insights,
    setInsights,
  ] = useState<InsightRecord[]>([]);

  const [
    tipItems,
    setTipItems,
  ] = useState<TipRecord[]>([]);

  const [
    bookmarkedTipIds,
    setBookmarkedTipIds,
  ] = useState<Set<number>>(
    () => new Set<number>(),
  );

  const [
    bookmarkedInsightIds,
    setBookmarkedInsightIds,
  ] = useState<Set<number>>(
    () => new Set<number>(),
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    bookmarkingId,
    setBookmarkingId,
  ] = useState<number | null>(
    null,
  );

  /* Load tips, insights, and bookmark status */

  const loadData =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const bookmarkResponse =
            await bookmarkService.list();

          const tipBookmarks =
            new Set<number>();

          const insightBookmarks =
            new Set<number>();

          bookmarkResponse.data.bookmarks.forEach(
            (bookmark) => {
              if (
                bookmark.item_type ===
                "tip"
              ) {
                tipBookmarks.add(
                  Number(
                    bookmark.item_id,
                  ),
                );
              }

              if (
                bookmark.item_type ===
                "insight"
              ) {
                insightBookmarks.add(
                  Number(
                    bookmark.item_id,
                  ),
                );
              }
            },
          );

          setBookmarkedTipIds(
            tipBookmarks,
          );

          setBookmarkedInsightIds(
            insightBookmarks,
          );

          if (tips) {
            const response =
              await tipService.list();

            setTipItems(
              response.data.tips,
            );
          } else {
            const response =
              await insightService.list();

            setInsights(
              response.data.insights,
            );
          }
        } catch (error) {
          await notice(
            "Unable to load data",
            error instanceof Error
              ? error.message
              : "Please try again.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
      [tips],
    );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /* Generate tips or insights */

  async function generate() {
    try {
      setGenerating(true);

      if (tips) {
        await tipService.generate();

        await notice(
          "Saving tips generated",
          "Your latest spending has been analyzed.",
          "success",
        );
      } else {
        await insightService.generate(
          new Date()
            .toISOString()
            .slice(0, 7),
        );

        await notice(
          "Insight generated",
          "Your monthly financial insight is ready.",
          "success",
        );
      }

      await loadData();
    } catch (error) {
      await notice(
        "Generation failed",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    } finally {
      setGenerating(false);
    }
  }

  /* Pin or unpin saving tip */

  async function pinTip(
    item: TipRecord,
  ) {
    try {
      await tipService.pin(
        item.id,
        Number(
          item.is_pinned,
        ) !== 1,
      );

      await notice(
        Number(
          item.is_pinned,
        ) === 1
          ? "Tip unpinned"
          : "Tip pinned",
        "",
        "success",
      );

      await loadData();
    } catch (error) {
      await notice(
        "Unable to update tip",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    }
  }

  /* Dismiss saving tip */

  async function dismissTip(
    id: number,
  ) {
    try {
      await tipService.dismiss(id);

      await notice(
        "Tip dismissed",
        "This tip has been removed from your active list.",
        "success",
      );

      await loadData();
    } catch (error) {
      await notice(
        "Unable to dismiss tip",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    }
  }

  /* Bookmark or unbookmark item */

  async function toggleBookmark(
    itemType: "tip" | "insight",
    itemId: number,
  ) {
    if (
      bookmarkingId !== null
    ) {
      return;
    }

    const isAlreadyBookmarked =
      itemType === "tip"
        ? bookmarkedTipIds.has(
          itemId,
        )
        : bookmarkedInsightIds.has(
          itemId,
        );

    try {
      setBookmarkingId(itemId);

      await bookmarkService.toggle(
        itemType,
        itemId,
      );

      if (itemType === "tip") {
        setBookmarkedTipIds(
          (current) => {
            const next =
              new Set(current);

            if (
              isAlreadyBookmarked
            ) {
              next.delete(itemId);
            } else {
              next.add(itemId);
            }

            return next;
          },
        );
      } else {
        setBookmarkedInsightIds(
          (current) => {
            const next =
              new Set(current);

            if (
              isAlreadyBookmarked
            ) {
              next.delete(itemId);
            } else {
              next.add(itemId);
            }

            return next;
          },
        );
      }

      await notice(
        isAlreadyBookmarked
          ? "Bookmark removed"
          : "Saved successfully",
        isAlreadyBookmarked
          ? "This item was removed from Saved Items."
          : "You can find this item in Saved Items.",
        "success",
      );
    } catch (error) {
      await notice(
        "Unable to update bookmark",
        error instanceof Error
          ? error.message
          : "Please try again.",
        "error",
      );
    } finally {
      setBookmarkingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading your{" "}
            {tips
              ? "saving tips"
              : "financial insights"}
            ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={
          tips
            ? "Saving Tips"
            : "Financial Insights"
        }
        subtitle={
          tips
            ? "Personalized recommendations based on your real spending."
            : "Monthly summaries generated from your transaction history."
        }
        action={
          <Button
            onClick={generate}
            disabled={
              generating
            }
          >
            <Sparkles />

            {generating
              ? "Generating..."
              : tips
                ? "Generate Tips"
                : "Generate Insight"}
          </Button>
        }
      />

      {tips ? (
        <div className="grid gap-4 md:grid-cols-2">
          {tipItems.map(
            (item) => {
              const bookmarked =
                bookmarkedTipIds.has(
                  item.id,
                );

              return (
                <Panel
                  key={item.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold capitalize text-primary">
                      {item.priority}{" "}
                      priority
                    </span>

                    {item.potential_saving !==
                      null && (
                        <strong className="text-sm text-success">
                          Save{" "}
                          {money(
                            Number(
                              item.potential_saving,
                            ),
                          )}
                        </strong>
                      )}
                  </div>

                  <h2 className="mt-4 font-bold">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.message}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {/* Bookmark action */}

                    <Button
                      variant={
                        bookmarked
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      disabled={
                        bookmarkingId ===
                        item.id
                      }
                      onClick={() =>
                        void toggleBookmark(
                          "tip",
                          item.id,
                        )
                      }
                    >
                      <Bookmark
                        size={15}
                        fill={
                          bookmarked
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {bookmarkingId ===
                        item.id
                        ? "Saving..."
                        : bookmarked
                          ? "Saved"
                          : "Save Tip"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void pinTip(
                          item,
                        )
                      }
                    >
                      <Pin
                        size={15}
                      />

                      {Number(
                        item.is_pinned,
                      ) === 1
                        ? "Unpin"
                        : "Pin"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        void dismissTip(
                          item.id,
                        )
                      }
                    >
                      <X
                        size={15}
                      />

                      Dismiss
                    </Button>
                  </div>
                </Panel>
              );
            },
          )}

          {!tipItems.length && (
            <EmptyState
              title="No saving tips yet"
              description="Generate tips after adding some expenses."
              action={
                <Button
                  onClick={
                    generate
                  }
                  disabled={
                    generating
                  }
                >
                  <Sparkles />

                  Generate Tips
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map(
            (item) => {
              const bookmarked =
                bookmarkedInsightIds.has(
                  item.id,
                );

              return (
                <Panel
                  key={item.id}
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {
                        item.insight_month
                      }
                    </span>

                    <span className="rounded-full bg-violet-soft px-2.5 py-1 text-xs">
                      {
                        item.source
                      }
                    </span>
                  </div>

                  <h2 className="mt-4 font-bold">
                    Monthly Financial
                    Summary
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {
                      item.summary_text
                    }
                  </p>

                  {item.advice_text && (
                    <div className="mt-4 rounded-xl bg-sage p-4">
                      <strong className="text-sm">
                        Suggested action
                      </strong>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {
                          item.advice_text
                        }
                      </p>
                    </div>
                  )}

                  <div className="mt-5">
                    <Button
                      variant={
                        bookmarked
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      disabled={
                        bookmarkingId ===
                        item.id
                      }
                      onClick={() =>
                        void toggleBookmark(
                          "insight",
                          item.id,
                        )
                      }
                    >
                      <Bookmark
                        size={15}
                        fill={
                          bookmarked
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {bookmarkingId ===
                        item.id
                        ? "Saving..."
                        : bookmarked
                          ? "Saved"
                          : "Save Insight"}
                    </Button>
                  </div>
                </Panel>
              );
            },
          )}

          {!insights.length && (
            <EmptyState
              title="No insights yet"
              description="Generate your first monthly financial insight."
              action={
                <Button
                  onClick={
                    generate
                  }
                  disabled={
                    generating
                  }
                >
                  <Sparkles />

                  Generate Insight
                </Button>
              }
            />
          )}
        </div>
      )}
    </>
  );
}

/* Bookmarks */

export function BookmarksPage() {
  const [items, setItems] = useState<BookmarkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);

      const response = await bookmarkService.list();

      setItems(response.data.bookmarks);
    } catch (error) {
      await notice(
        "Bookmarks unavailable",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookmarks();
  }, [loadBookmarks]);

  async function remove(bookmark: BookmarkRecord) {
    try {
      await bookmarkService.toggle(
        bookmark.item_type,
        bookmark.item_id,
      );

      await notice(
        "Removed from Saved Items",
        "The item has been removed from your saved list.",
        "success",
      );

      await loadBookmarks();
    } catch (error) {
      await notice(
        "Unable to remove saved item",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    }
  }

  function bookmarkPresentation(bookmark: BookmarkRecord) {
    const item = bookmark.item as Record<string, unknown> | null;

    if (bookmark.item_type === "tip") {
      return {
        label: "Saving Tip",
        title: String(item?.["title"] || "Saved Tip"),
        message: String(item?.["message"] || ""),
      };
    }

    if (bookmark.item_type === "insight") {
      return {
        label: "Insight",
        title: "Financial Insight",
        message: String(item?.["summary_text"] || ""),
      };
    }

    if (bookmark.item_type === "announcement") {
      return {
        label: "Announcement",
        title: String(item?.["title"] || "Saved Announcement"),
        message: String(item?.["message"] || ""),
      };
    }

    return {
      label: "Saving Tip",
      title: String(item?.["title"] || "Saved Tip"),
      message: String(item?.["message"] || ""),
    };
  }

  return (
    <>
      <PageHeader
        title="Saved Items"
        subtitle="Your saved tips, announcements, and financial insights."
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : items.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((bookmark) => {
            const presentation = bookmarkPresentation(bookmark);

            return (
              <Panel key={bookmark.id}>
                <span className="inline-flex rounded-full bg-sage px-3 py-1 text-xs font-semibold text-primary">
                  {presentation.label}
                </span>

                <h2 className="mt-4 font-bold">
                  {presentation.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {presentation.message}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => remove(bookmark)}
                >
                  <X size={15} />
                  Remove Saved Item
                </Button>
              </Panel>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Nothing saved yet"
          description="Saved tips, announcements, and insights will appear here."
        />
      )}
    </>
  );
}

/* Notifications */

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await notificationService.list();

      setItems(response.data.notifications);
    } catch (error) {
      await notice(
        "Notifications unavailable",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  async function markRead(id: number) {
    try {
      await notificationService.markRead(id);

      refreshNotificationBadge();

      await loadNotifications();
    } catch (error) {
      await notice(
        "Unable to update notification",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    }
  }

  async function toggleSave(item: NotificationRecord) {
    if (!item.source_type || !item.source_id || savingId !== null) {
      return;
    }

    try {
      setSavingId(item.id);

      const response = await bookmarkService.toggle(
        item.source_type,
        item.source_id,
      );

      await notice(
        response.data.bookmarked
          ? "Saved successfully"
          : "Removed from Saved Items",
        response.data.bookmarked
          ? "You can find it anytime in Saved Items."
          : "This item is no longer in your saved list.",
        "success",
      );

      await loadNotifications();
    } catch (error) {
      await notice(
        "Unable to save item",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setSavingId(null);
    }
  }

  async function markAll() {
    try {
      await notificationService.markAllRead();

      await notice(
        "All caught up",
        "All notifications are marked as read.",
        "success",
      );

      refreshNotificationBadge();

      await loadNotifications();
    } catch (error) {
      await notice(
        "Unable to update notifications",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Budget alerts, announcements, saving tips, and important account activity."
        action={
          <Button variant="outline" onClick={markAll}>
            <Check />
            Mark All Read
          </Button>
        }
      />

      <Panel className="!p-0 overflow-hidden">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        ) : items.length ? (
          <div className="divide-y divide-border">
            {items.map((item) => {
              const canSave = Boolean(item.source_type && item.source_id);
              const bookmarked = Number(item.is_bookmarked) === 1;
              const unread = Number(item.is_read) !== 1;
              const isAnnouncement = item.source_type === "announcement";
              const isTip = item.source_type === "tip_template";

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row ${unread ? "bg-sage/40" : "bg-card"}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (unread) {
                        void markRead(item.id);
                      }
                    }}
                    className="flex min-w-0 flex-1 gap-4 p-5 text-left transition hover:bg-sage/20"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                      {item.type === "budget" ? (
                        <AlertCircle size={19} />
                      ) : isTip ? (
                        <Sparkles size={19} />
                      ) : (
                        <Info size={19} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-bold">
                              {item.title}
                            </h2>

                            {isAnnouncement && (
                              <span className="rounded-full bg-sage px-2.5 py-1 text-[10px] font-bold text-primary">
                                Announcement
                              </span>
                            )}

                            {isTip && (
                              <span className="rounded-full bg-orange-soft px-2.5 py-1 text-[10px] font-bold text-warning">
                                Saving Tip
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.message}
                      </p>

                      {unread && (
                        <span className="mt-2 inline-block text-xs font-semibold text-primary">
                          New · Click to mark as read
                        </span>
                      )}
                    </div>
                  </button>

                  {canSave && (
                    <div className="flex items-center border-t border-border/60 px-5 pb-5 sm:border-l sm:border-t-0 sm:pb-0 sm:pl-4">
                      <Button
                        type="button"
                        variant={bookmarked ? "outline" : "default"}
                        size="sm"
                        className={bookmarked ? "outline-btn" : "premium-btn"}
                        disabled={savingId !== null}
                        onClick={() => void toggleSave(item)}
                      >
                        <Bookmark size={15} />

                        {savingId === item.id
                          ? "Saving..."
                          : bookmarked
                            ? "Saved"
                            : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No notifications"
              description="Budget alerts, announcements, saving tips, and updates will appear here."
            />
          </div>
        )}
      </Panel>
    </>
  );
}

/* CSV import */

export function ImportPage() {
  const input = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    inserted: number;
    skipped: number;
  } | null>(null);

  async function upload() {
    if (!file) {
      await notice(
        "Select a file",
        "Please choose a CSV file first.",
        "warning",
      );
      return;
    }

    try {
      setUploading(true);

      const response = await importService.upload(file);

      setResult(response.data);

      await notice(
        "Import complete",
        `${response.data.inserted} transactions imported successfully.`,
        "success",
      );
    } catch (error) {
      await notice(
        "Import failed",
        error instanceof Error ? error.message : "Please try again.",
        "error",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Import Transactions"
        subtitle="Import multiple transactions from a CSV file."
      />

      <Panel>
        <input
          ref={input}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={(event) => {
            setFile(event.target.files?.item(0) ?? null);
            setResult(null);
          }}
        />

        <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-10 text-center">
          <UploadCloud
            size={34}
            className="mx-auto text-primary"
          />

          <h2 className="mt-4 font-bold">
            Upload CSV File
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Maximum file size: 2 MB
          </p>

          <Button
            variant="outline"
            className="mt-5"
            onClick={() => input.current?.click()}
          >
            Choose CSV
          </Button>

          {file && (
            <p className="mt-3 text-sm font-semibold">
              {file.name}
            </p>
          )}
        </div>

        <div className="mt-5 rounded-xl bg-sage p-4 text-sm">
          <strong>Required CSV format:</strong>

          <pre className="mt-2 overflow-x-auto text-xs">
            {`date,type,category,amount,description
              2026-09-24,expense,Food,250,Lunch
              2026-09-24,income,Allowance,5000,Monthly allowance`}
          </pre>
        </div>

        <Button
          className="mt-5"
          disabled={!file || uploading}
          onClick={upload}
        >
          {uploading ? "Importing..." : "Import Transactions"}
        </Button>

        {result && (
          <div className="mt-5 rounded-xl border border-border p-4">
            <p className="font-semibold">Import Result</p>

            <p className="mt-2 text-sm text-muted-foreground">
              Imported: {result.inserted}
            </p>

            <p className="text-sm text-muted-foreground">
              Skipped: {result.skipped}
            </p>
          </div>
        )}
      </Panel>
    </>
  );
}

/* Profile and settings */

export function SettingsPage({
  profile = false,
  admin = false,
}: {
  profile?: boolean;
  admin?: boolean;
}) {
  const [user, setUser] =
    useState<ProfileRecord | null>(
      null,
    );

  const [loading, setLoading] =
    useState(!admin);

  const [saving, setSaving] =
    useState(false);

  const [
    passwordOpen,
    setPasswordOpen,
  ] =
    useState(false);

  const loadProfile =
    useCallback(async () => {
      if (admin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          await profileService.get();

        setUser(
          response.data.profile,
        );
      } catch (error) {
        await notice(
          "Profile unavailable",
          error instanceof Error
            ? error.message
            : "Please try again.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }, [admin]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function saveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form =
      new FormData(
        event.currentTarget,
      );

    try {
      setSaving(true);

      await profileService.update(
        {
          name:
            String(
              form.get(
                "name",
              ) ||
                "",
            ).trim(),

          academic_year:
            String(
              form.get(
                "academic_year",
              ) ||
                "",
            ),

          monthly_allowance:
            Number(
              form.get(
                "monthly_allowance",
              ),
            ),

          monthly_savings_goal:
            Number(
              form.get(
                "monthly_savings_goal",
              ),
            ),
        },
      );

      await notice(
        "Profile updated",
        "Your profile has been saved.",
        "success",
      );

      await loadProfile();
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

  async function changePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form =
      new FormData(
        event.currentTarget,
      );

    const currentPassword =
      String(
        form.get(
          "current_password",
        ) ||
          "",
      );

    const newPassword =
      String(
        form.get(
          "new_password",
        ) ||
          "",
      );

    try {
      await profileService.changePassword(
        {
          current_password:
            currentPassword,

          new_password:
            newPassword,
        },
      );

      setPasswordOpen(
        false,
      );

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
    }
  }

  /* Admin settings */

  if (admin) {
    return (
      <div className="admin-settings-premium">
        <PageHeader
          title="Admin Settings"
          subtitle="Personalize the administrator workspace and manage account security."
          action={
            <div className="admin-live-pill">
              <Shield
                size={14}
              />

              <span>
                Admin workspace
              </span>
            </div>
          }
        />

        <section className="admin-settings-hero">
          <div className="admin-settings-hero-glow" />

          <div className="relative z-10">
            <span className="admin-settings-hero-icon">
              <Shield
                size={22}
              />
            </span>

            <div>
              <p className="admin-settings-kicker">
                Workspace preferences
              </p>

              <h2>
                Keep your admin workspace comfortable and secure.
              </h2>

              <p>
                Appearance and text-size preferences are saved for this browser. Account security changes use your existing Campus Coin credentials.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">

          {/* Appearance and accessibility */}

          <Panel className="admin-settings-panel">
            <PanelHeading
              title="Appearance & Accessibility"
              action={
                <span className="admin-panel-chip">
                  Browser preference
                </span>
              }
            />

            <div className="admin-settings-option">
              <div className="admin-settings-option-copy">
                <span className="admin-settings-option-icon is-theme">
                  <Globe
                    size={17}
                  />
                </span>

                <div>
                  <h3>
                    Theme
                  </h3>

                  <p>
                    Switch between Campus Coin light and dark appearance.
                  </p>
                </div>
              </div>

              <ThemeToggle />
            </div>

            <div className="admin-settings-divider" />

            <div className="admin-settings-option admin-settings-option-stack">
              <div className="admin-settings-option-copy">
                <span className="admin-settings-option-icon is-text">
                  <Info
                    size={17}
                  />
                </span>

                <div>
                  <h3>
                    Text size
                  </h3>

                  <p>
                    Adjust interface text size for easier reading across the dashboard.
                  </p>
                </div>
              </div>

              <div className="admin-settings-font-control">
                <FontSizeControl />
              </div>
            </div>
          </Panel>

          {/* Account security */}

          <Panel className="admin-settings-panel">
            <PanelHeading
              title="Account Security"
              action={
                <span className="admin-settings-security-badge">
                  <Shield
                    size={12}
                  />
                  Security
                </span>
              }
            />

            <div className="admin-settings-security-card">
              <span className="admin-settings-security-icon">
                <Shield
                  size={20}
                />
              </span>

              <div>
                <h3>
                  Administrator password
                </h3>

                <p>
                  Change your Campus Coin password if you need to refresh your account credentials.
                </p>
              </div>

              <Button
                variant="outline"
                className="outline-btn mt-5 w-full"
                onClick={() =>
                  setPasswordOpen(
                    true,
                  )
                }
              >
                Change Password
              </Button>
            </div>

            <div className="admin-settings-note mt-4">
              <Info
                size={14}
              />

              <span>
                Appearance settings affect only this browser and do not change student data, APIs, or system configuration.
              </span>
            </div>
          </Panel>
        </div>

        <Dialog
          open={
            passwordOpen
          }
          onOpenChange={
            setPasswordOpen
          }
        >
          <DialogContent className="admin-settings-dialog max-w-md">
            <div className="admin-settings-dialog-glow" />

            <DialogHeader className="relative z-10">
              <div className="mb-2 flex items-center gap-3">
                <span className="admin-settings-dialog-icon">
                  <Shield
                    size={17}
                  />
                </span>

                <div>
                  <DialogTitle className="text-xl font-bold tracking-[-0.025em]">
                    Change Password
                  </DialogTitle>

                  <DialogDescription className="mt-1">
                    Enter your current password and choose a new one.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form
              onSubmit={
                changePassword
              }
              className="relative z-10 mt-2 space-y-4"
            >
              <label className="block text-sm font-semibold">
                Current password

                <Input
                  name="current_password"
                  type="password"
                  placeholder="Enter current password"
                  required
                  className="admin-settings-input mt-2 h-11"
                />
              </label>

              <label className="block text-sm font-semibold">
                New password

                <Input
                  name="new_password"
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  className="admin-settings-input mt-2 h-11"
                />
              </label>

              <div className="admin-settings-password-note">
                <Shield
                  size={14}
                />

                <span>
                  Use a password with at least 8 characters.
                </span>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="outline-btn sm:min-w-28"
                  onClick={() =>
                    setPasswordOpen(
                      false,
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="premium-btn sm:min-w-36"
                >
                  Change Password
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  /* Student profile and settings */

  if (
    loading ||
    !user
  ) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={
          profile
            ? "My Profile"
            : "Settings"
        }
        subtitle="Manage your personal and account information."
      />

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel>
          <PanelHeading title="Personal Information" />

          <form
            onSubmit={
              saveProfile
            }
            className="grid gap-4 sm:grid-cols-2"
          >
            <label className="text-sm font-semibold">
              Full Name

              <Input
                name="name"
                defaultValue={
                  user.name
                }
                required
                className="mt-2"
              />
            </label>

            <label className="text-sm font-semibold">
              Email

              <Input
                value={
                  user.email
                }
                readOnly
                className="mt-2 bg-muted"
              />
            </label>

            <label className="text-sm font-semibold">
              Academic Year

              <Input
                name="academic_year"
                defaultValue={
                  user.academic_year ??
                  ""
                }
                className="mt-2"
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
                    user.monthly_allowance,
                  )
                }
                className="mt-2"
              />
            </label>

            <label className="text-sm font-semibold">
              Monthly Savings Goal

              <Input
                name="monthly_savings_goal"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  Number(
                    user.monthly_savings_goal,
                  )
                }
                className="mt-2"
              />
            </label>

            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={
                  saving
                }
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </Button>
            </div>
          </form>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeading title="Appearance" />

            <ThemeToggle />

            <div className="mt-5">
              <FontSizeControl />
            </div>
          </Panel>

          <Panel>
            <PanelHeading title="Security" />

            <Button
              variant="outline"
              onClick={() =>
                setPasswordOpen(
                  true,
                )
              }
            >
              Change Password
            </Button>
          </Panel>
        </div>
      </div>

      <Dialog
        open={
          passwordOpen
        }
        onOpenChange={
          setPasswordOpen
        }
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
            onSubmit={
              changePassword
            }
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
              className="w-full"
            >
              Change Password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

