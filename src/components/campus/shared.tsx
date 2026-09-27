import {

  Link,

  useNavigate,

  useRouterState,

} from "@tanstack/react-router";



import {

  useEffect,

  useRef,

  useState,

  type ReactNode,

} from "react";



import {

  LayoutDashboard,

  ReceiptText,

  Wallet,

  ChartPie,

  Target,

  ChartNoAxesCombined,

  Sparkles,

  Lightbulb,

  Bookmark,

  Bell,

  Settings,

  Upload,

  Tags,

  LogOut,

  Menu,

  X,

  ChevronDown,

  ChevronRight,

  ChevronUp,


  CircleHelp,

  ArrowRight,

  Sun,

  Moon,

  UserRound,

  Megaphone,

  Users,

  ShieldCheck,

  MessageCircle,

} from "lucide-react";



import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {

  authService,

  type AuthUser,

} from "@/services/authService";



import {
  apiRequest,
  resolveApiAssetUrl,
} from "@/services/api";



import { notice } from "./alerts";

import { CampusAiWidget } from "./campus-ai";

import campusCoinLogo from "@/assets/campus/visuals/campuscoin-logo-icon.png";





/* Brand */



export function Brand({
  compact = false,
  homeTo = "/",
}: {
  compact?: boolean;
  homeTo?: "/" | "/admin/dashboard" | null;
}) {
  const content = (
    <>
      <span
        className={cn(
          "campus-brand-logo-wrap",
          compact && "is-compact",
        )}
      >
        <img
          src={campusCoinLogo}
          alt=""
          aria-hidden="true"
          className="campus-brand-logo"
        />
      </span>

      {!compact && (
        <span className="campus-brand-wordmark" aria-hidden="true">
          <span className="campus-brand-campus">Campus</span>
          <span className="campus-brand-coin">Coin</span>
        </span>
      )}
    </>
  );

  if (homeTo === null) {
    return (
      <div className="campus-brand" aria-label="CampusCoin admin">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={homeTo}
      className="campus-brand"
      aria-label="CampusCoin home"
    >
      {content}
    </Link>
  );
}


/* Navigation */



export const studentNav = [

  {

    to: "/dashboard",

    label: "Dashboard",

    icon: LayoutDashboard,

  },

  {

    to: "/transactions",

    label: "Expenses",

    icon: ReceiptText,

  },

  {

    to: "/income",

    label: "Income",

    icon: Wallet,

  },

  {

    to: "/categories",

    label: "Categories",

    icon: Tags,

  },

  {

    to: "/budgets",

    label: "Budgets",

    icon: ChartPie,

  },

  {

    to: "/goals",

    label: "Goals",

    icon: Target,

  },

  {

    to: "/reports",

    label: "Reports",

    icon: ChartNoAxesCombined,

  },

  {

    to: "/insights",

    label: "AI Insights",

    icon: Sparkles,

  },

  {

    to: "/assistant",

    label: "Campus AI",

    icon: MessageCircle,

  },

  {

    to: "/tips",

    label: "Saving Tips",

    icon: Lightbulb,

  },

  {

    to: "/bookmarks",

    label: "Saved Items",

    icon: Bookmark,

  },

  {

    to: "/import",

    label: "CSV Import",

    icon: Upload,

  },

  {

    to: "/notifications",

    label: "Notifications",

    icon: Bell,

  },

  {

    to: "/profile",

    label: "Profile",

    icon: UserRound,

  },

  {

    to: "/settings",

    label: "Settings",

    icon: Settings,

  },

] as const;





export const adminNav = [

  {

    to: "/admin/dashboard",

    label: "Dashboard",

    icon: LayoutDashboard,

  },

  {

    to: "/admin/users",

    label: "Users",

    icon: Users,

  },

  {

    to: "/admin/categories",

    label: "Categories",

    icon: Tags,

  },

  {

    to: "/admin/content",

    label: "Content",

    icon: Megaphone,

  },

  {

    to: "/admin/statistics",

    label: "Statistics",

    icon: ChartNoAxesCombined,

  },

  {

    to: "/admin/profile",

    label: "Profile",

    icon: UserRound,

  },

  {

    to: "/admin/settings",

    label: "Settings",

    icon: Settings,

  },

] as const;





/* Public header */



export function PublicHeader() {

  const [open, setOpen] = useState(false);

  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const [

    navMenu,

    setNavMenu,

  ] = useState<

    "products" | "solutions" | "resources" | null

  >(null);



  const [student, setStudent] =

    useState<AuthUser | null>(null);



  useEffect(() => {

    let active = true;



    async function loadStudentSession() {

      try {

        const response =

          await authService.me();



        if (!active) {

          return;

        }



        if (

          response.data.user.role ===

          "student"

        ) {

          setStudent(

            response.data.user,

          );

        } else {

          setStudent(null);

        }

      } catch {

        if (active) {

          setStudent(null);

        }

      }

    }



    void loadStudentSession();



    return () => {

      active = false;

    };

  }, []);



  const firstName =

    student?.name

      .trim()

      .split(/\s+/)[0] ??

    "Student";



  const closeMenus = () => {

    setNavMenu(null);

    setWorkspaceOpen(false);

  };



  const desktopMenu = (

    type:

      | "products"

      | "solutions"

      | "resources",

  ) => {

    const items =

      type === "products"

        ? [

          {

            label:

              "Features Overview",

            description:

              "Explore the complete CampusCoin toolkit.",

            to: "/features" as const,

            icon: Sparkles,

          },

          {

            label:

              "Track Expenses",

            description:

              "Log and review everyday spending.",

            to: "/transactions" as const,

            icon: ReceiptText,

          },

          {

            label:

              "Budgets",

            description:

              "Plan monthly category limits.",

            to: "/budgets" as const,

            icon: ChartPie,

          },

          {

            label:

              "Saving Goals",

            description:

              "Turn plans into measurable progress.",

            to: "/goals" as const,

            icon: Target,

          },

        ]

        : type === "solutions"

          ? [

            {

              label:

                "How It Works",

              description:

                "See the full student money journey.",

              to: "/how-it-works" as const,

              icon: ArrowRight,

            },

            {

              label:

                "Reports",

              description:

                "Understand trends and spending patterns.",

              to: "/reports" as const,

              icon:

                ChartNoAxesCombined,

            },

            {

              label:

                "AI Insights",

              description:

                "Review optional smart financial guidance.",

              to: "/insights" as const,

              icon: Sparkles,

            },

            {

              label:

                "Saving Tips",

              description:

                "Build better habits from your activity.",

              to: "/tips" as const,

              icon: Lightbulb,

            },

          ]

          : [

            {

              label:

                "Website Sitemap",

              description:

                "See every public, student and admin area.",

              href: "/#sitemap",

              icon: LayoutDashboard,

            },

            {

              label:

                "CSV Import",

              description:

                "Bring supported historical transactions in.",

              to: "/import" as const,

              icon: Upload,

            },

            {

              label:

                "Saved Items",

              description:

                "Return to bookmarked tips and insights.",

              to: "/bookmarks" as const,

              icon: Bookmark,

            },

            {

              label:

                "Notifications",

              description:

                "Review budget alerts and account updates.",

              to: "/notifications" as const,

              icon: Bell,

            },

          ];



    return (

      <div className="public-nav-mega absolute left-1/2 top-[calc(100%+14px)] z-50 w-[620px] -translate-x-1/2 p-3">

        <div className="grid grid-cols-2 gap-2">

          {items.map((item) => {

            const content = (

              <>

                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-sage text-primary">

                  <item.icon

                    size={18}

                  />

                </span>



                <span className="min-w-0">

                  <span className="block text-sm font-bold text-foreground">

                    {item.label}

                  </span>



                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">

                    {

                      item.description

                    }

                  </span>

                </span>

              </>

            );



            if (

              "href" in item

            ) {

              return (

                <a

                  key={item.label}

                  href={item.href}

                  onClick={

                    closeMenus

                  }

                  className="public-nav-mega-item"

                >

                  {content}

                </a>

              );

            }



            return (

              <Link

                key={item.label}

                to={item.to}

                onClick={

                  closeMenus

                }

                className="public-nav-mega-item"

              >

                {content}

              </Link>

            );

          })}

        </div>

      </div>

    );

  };



  return (

    <header className="public-header-wrap sticky top-0 z-50">

      <div className="public-header-shell">

        <Brand />



        <nav className="relative hidden items-center gap-1 lg:flex">

          {(

            [

              [

                "products",

                "Products",

              ],

              [

                "solutions",

                "Solutions",

              ],

              [

                "resources",

                "Resources",

              ],

            ] as const

          ).map(

            ([value, label]) => (

              <div

                key={value}

                className="relative"

              >

                <button

                  type="button"

                  className={cn(

                    "public-nav-trigger",

                    navMenu ===

                    value &&

                    "is-open",

                  )}

                  aria-expanded={

                    navMenu ===

                    value

                  }

                  onClick={() =>

                    setNavMenu(

                      (

                        current,

                      ) =>

                        current ===

                          value

                          ? null

                          : value,

                    )

                  }

                >

                  {label}

                  <ChevronDown

                    size={14}

                    className={cn(

                      "transition-transform",

                      navMenu ===

                      value &&

                      "rotate-180",

                    )}

                  />

                </button>



                {navMenu ===

                  value &&

                  desktopMenu(

                    value,

                  )}

              </div>

            ),

          )}



          <Link

            to={

              student

                ? "/dashboard"

                : "/register"

            }

            className="public-nav-trigger"

            onClick={closeMenus}

          >

            For Students

          </Link>



          <Link

            to="/how-it-works"

            className="public-nav-trigger"

            onClick={closeMenus}

          >

            How It Works

          </Link>

        </nav>



        <div className="hidden items-center gap-2 lg:flex">

          <ThemeToggle />



          {student ? (

            <>

              <div className="relative">

                <Button

                  type="button"

                  variant="ghost"

                  className="h-11 rounded-full px-4 text-sm"

                  aria-expanded={

                    workspaceOpen

                  }

                  aria-label="Open student workspace"

                  onClick={() => {

                    setWorkspaceOpen(

                      (current) =>

                        !current,

                    );

                    setNavMenu(

                      null,

                    );

                  }}

                >

                  Hi, {firstName}



                  <ChevronDown

                    size={15}

                    className={cn(

                      "transition-transform",

                      workspaceOpen &&

                      "rotate-180",

                    )}

                  />

                </Button>



                {workspaceOpen && (

                  <div className="absolute right-0 top-14 z-50 w-72 rounded-[24px] border border-border bg-card/98 p-2.5 shadow-[var(--shadow-lift)] backdrop-blur-xl">

                    <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">

                      Student

                      workspace

                    </p>



                    <div className="max-h-[430px] overflow-y-auto pr-1">

                      {studentNav.map(

                        (item) => (

                          <Link

                            key={

                              item.to

                            }

                            to={

                              item.to

                            }

                            onClick={

                              closeMenus

                            }

                            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sage hover:text-primary"

                          >

                            <item.icon

                              size={

                                17

                              }

                            />



                            {

                              item.label

                            }

                          </Link>

                        ),

                      )}



                      <Link

                        to="/profile"

                        onClick={

                          closeMenus

                        }

                        className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sage hover:text-primary"

                      >

                        <UserRound

                          size={17}

                        />



                        My Profile

                      </Link>

                    </div>

                  </div>

                )}

              </div>



              <Button

                asChild

                className="premium-btn h-11 px-6"

              >

                <Link to="/dashboard">

                  Dashboard

                  <ArrowRight

                    size={16}

                  />

                </Link>

              </Button>

            </>

          ) : (

            <>

              <Button

                asChild

                variant="outline"

                className="outline-btn h-11 px-5"

              >

                <Link to="/login">

                  Login

                </Link>

              </Button>



              <Button

                asChild

                className="premium-btn h-11 px-6"

              >

                <Link to="/register">

                  Get Started

                  <ArrowRight

                    size={16}

                  />

                </Link>

              </Button>

            </>

          )}

        </div>



        <Button

          className="rounded-full lg:hidden"

          size="icon"

          variant="outline"

          aria-label={

            open

              ? "Close menu"

              : "Open menu"

          }

          onClick={() =>

            setOpen(

              (current) =>

                !current,

            )

          }

        >

          {open ? (

            <X />

          ) : (

            <Menu />

          )}

        </Button>

      </div>



      {open && (

        <nav

          className="public-mobile-menu lg:hidden"

          onClick={() =>

            setOpen(false)

          }

        >

          <div className="grid gap-2">

            <Link

              to="/features"

              className="public-mobile-link"

            >

              Products & Features

            </Link>



            <Link

              to="/how-it-works"

              className="public-mobile-link"

            >

              How It Works

            </Link>



            <a

              href="/#sitemap"

              className="public-mobile-link"

            >

              Sitemap

            </a>



            <Link

              to={

                student

                  ? "/dashboard"

                  : "/register"

              }

              className="public-mobile-link"

            >

              For Students

            </Link>

          </div>



          {student ? (

            <div className="mt-4 border-t border-border pt-4">

              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">

                Your workspace

              </p>



              <div className="grid gap-1">

                {studentNav.map(

                  (item) => (

                    <Link

                      key={

                        item.to

                      }

                      to={

                        item.to

                      }

                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-sage"

                    >

                      <item.icon

                        size={17}

                      />

                      {

                        item.label

                      }

                    </Link>

                  ),

                )}



                <Link

                  to="/profile"

                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-sage"

                >

                  <UserRound

                    size={17}

                  />

                  My Profile

                </Link>

              </div>

            </div>

          ) : (

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">

              <Link

                to="/login"

                className="outline-btn flex h-11 items-center justify-center px-4 text-sm font-semibold"

              >

                Login

              </Link>



              <Link

                to="/register"

                className="premium-btn flex h-11 items-center justify-center px-4 text-sm font-semibold"

              >

                Get Started

              </Link>

            </div>

          )}



          <div className="mt-4 border-t border-border pt-4">

            <ThemeToggle />

          </div>

        </nav>

      )}

    </header>

  );

}





/* Public footer */



export function PublicFooter() {

  return (

    <>

      <CampusAiWidget />



      <footer className="border-t border-border bg-card/80">

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-end lg:px-12">

        <div>

          <Brand />

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">

            Smarter student money habits, clearer goals, and a brighter financial routine.

          </p>

        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground md:justify-end">

          <Link to="/features" className="hover:text-primary">Features</Link>

          <Link to="/how-it-works" className="hover:text-primary">How it works</Link>

          <Link to="/login" className="hover:text-primary">Login</Link>

          <Link to="/register" className="hover:text-primary">Join Campus Coin</Link>

        </div>

        <div className="border-t border-border pt-5 text-xs text-muted-foreground md:col-span-2">

          © 2026 Campus Coin · Smart Spending, Student Style.

        </div>

      </div>

      </footer>

    </>

  );

}





/* Shared UI components */



export function PageHeader({

  title,

  subtitle,

  action,

}: {

  title: string;

  subtitle?: string;

  action?: ReactNode;

}) {

  return (

    <div className="mb-7 flex flex-wrap items-start justify-between gap-4 md:mb-8">

      <div>

        <h1 className="editorial text-[32px] leading-[1.05] text-foreground md:text-[40px]">

          {title}

        </h1>



        {subtitle && (

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">

            {subtitle}

          </p>

        )}

      </div>



      {action}

    </div>

  );

}





export function Panel({

  children,

  className = "",

}: {

  children: ReactNode;

  className?: string;

}) {

  return (

    <div

      className={cn(

        "surface-card p-5 md:p-6",

        className,

      )}

    >

      {children}

    </div>

  );

}





export function PanelHeading({

  title,

  action,

}: {

  title: string;

  action?: ReactNode;

}) {

  return (

    <div className="mb-5 flex items-center justify-between gap-3">

      <h2 className="text-base font-bold tracking-tight md:text-lg">

        {title}

      </h2>



      {action}

    </div>

  );

}





export function EmptyState({

  title,

  description,

  action,

}: {

  title: string;

  description: string;

  action?: ReactNode;

}) {

  return (

    <div className="empty-state-card flex min-h-48 flex-col items-center justify-center p-8 text-center">

      <CircleHelp

        className="mb-3 text-muted-foreground"

        size={27}

      />



      <h3 className="font-semibold">

        {title}

      </h3>



      <p className="mt-1 max-w-xs text-sm text-muted-foreground">

        {description}

      </p>



      {action && (

        <div className="mt-4">

          {action}

        </div>

      )}

    </div>

  );

}





export function CategoryBadge({

  category,

}: {

  category: string;

}) {

  const tone = [

    "Food",

    "Allowance",

    "Part-time Job",

    "Other Income",

  ].includes(category)

    ? "bg-sage text-primary"

    : [

      "Shopping",

      "Entertainment",

    ].includes(category)

      ? "bg-peach text-warning"

      : [

        "Education",

        "Academics",

        "Scholarship",

      ].includes(category)

        ? "bg-orange-soft text-warning"

        : ["Transport"].includes(category)

          ? "bg-blue-soft text-foreground"

          : "bg-muted text-muted-foreground";



  return (

    <span

      className={cn(

        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",

        tone,

      )}

    >

      {category}

    </span>

  );

}





/* Theme controls */



export function ThemeToggle() {

  const [dark, setDark] = useState(() => {

    return (

      localStorage.getItem(

        "campus_coin_theme",

      ) === "dark"

    );

  });



  useEffect(() => {

    document.documentElement.classList.toggle(

      "dark",

      dark,

    );



    localStorage.setItem(

      "campus_coin_theme",

      dark ? "dark" : "light",

    );

  }, [dark]);



  return (

    <Button

      variant="outline"

      size="icon"

      aria-label={

        dark

          ? "Use light theme"

          : "Use dark theme"

      }

      title="Toggle theme"

      className="glass-control rounded-full"

      onClick={() =>

        setDark((current) => !current)

      }

    >

      {dark ? <Sun /> : <Moon />}

    </Button>

  );

}





/* Font size accessibility */



export function FontSizeControl() {

  const [size, setSize] = useState(() => {

    const saved = Number(

      localStorage.getItem(

        "campus_coin_font_size",

      ),

    );



    return saved >= 14 && saved <= 20

      ? saved

      : 16;

  });



  useEffect(() => {

    document.documentElement.style.fontSize =

      `${size}px`;



    localStorage.setItem(

      "campus_coin_font_size",

      String(size),

    );

  }, [size]);



  return (

    <div className="flex items-center gap-2">

      <span className="text-sm text-muted-foreground">

        Text size

      </span>



      <Button

        variant="outline"

        size="icon"

        aria-label="Decrease text size"

        onClick={() =>

          setSize((current) =>

            Math.max(

              14,

              current - 1,

            ),

          )

        }

      >

        A−

      </Button>



      <Button

        variant="outline"

        size="icon"

        aria-label="Increase text size"

        onClick={() =>

          setSize((current) =>

            Math.min(

              20,

              current + 1,

            ),

          )

        }

      >

        A+

      </Button>

    </div>

  );

}





/* User display helpers */



function getInitials(name: string) {

  const parts = name

    .trim()

    .split(/\s+/)

    .filter(Boolean);



  if (parts.length === 0) {

    return "CC";

  }



  const firstName = parts.at(0) ?? "";

  const lastName = parts.at(-1) ?? "";



  if (parts.length === 1) {

    return firstName

      .slice(0, 2)

      .toUpperCase();

  }



  return (

    firstName.charAt(0) +

    lastName.charAt(0)

  ).toUpperCase();

}





type ShellUser = AuthUser & {

  profile_image_url?: string | null;

};





function WorkspaceAvatar({

  name,

  imageUrl,

  className,

}: {

  name: string;

  imageUrl?: string | null;

  className: string;

}) {

  return (

    <span

      className={cn(

        "relative flex shrink-0 items-center justify-center overflow-hidden bg-sage font-bold text-primary ring-1 ring-primary/10",

        className,

      )}

    >

      <span>{getInitials(name)}</span>



      {imageUrl && (

        <img

          src={resolveApiAssetUrl(imageUrl) ?? undefined}

          alt={`${name} profile`}

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





/* Shared student and admin app shell */



export function AppShell({

  children,

  admin = false,

}: {

  children: ReactNode;

  admin?: boolean;

}) {

  const navigate = useNavigate();



  const path = useRouterState({

    select: (state) =>

      state.location.pathname,

  });



  const [

    sidebarOpen,

    setSidebarOpen,

  ] = useState(false);



  const sidebarNavRef =

    useRef<HTMLDivElement | null>(null);



  const [

    canScrollSidebarUp,

    setCanScrollSidebarUp,

  ] = useState(false);



  const [

    canScrollSidebarDown,

    setCanScrollSidebarDown,

  ] = useState(false);



  const [

    profileOpen,

    setProfileOpen,

  ] = useState(false);



  const [

    user,

    setUser,

  ] = useState<ShellUser | null>(null);



  const [

    loadingUser,

    setLoadingUser,

  ] = useState(true);



  const [

    loggingOut,

    setLoggingOut,

  ] = useState(false);



  const [

    unreadNotifications,

    setUnreadNotifications,

  ] = useState(0);



  const [

    notificationPulse,

    setNotificationPulse,

  ] = useState(false);



  const previousUnreadRef =

    useRef<number | null>(null);



  const audioContextRef =

    useRef<AudioContext | null>(null);



  const userInteractedRef =

    useRef(false);



  const nav = admin

    ? adminNav

    : studentNav;



  const dashboardPath = admin

    ? "/admin/dashboard"

    : "/dashboard";



  const currentNavItem =

    nav.find(

      (item) => item.to === path,

    );



  const breadcrumbLabel =

    currentNavItem?.label ??

    (path === "/profile"

      ? "Profile"

      : path

        .split("/")

        .filter(Boolean)

        .at(-1)

        ?.replaceAll("-", " ")

        .replace(/\b\w/g, (letter) =>

          letter.toUpperCase(),

        ) ?? "Workspace");





  /* Sidebar scrolling */



  function updateSidebarScrollState() {

    const element =

      sidebarNavRef.current;



    if (!element) {

      setCanScrollSidebarUp(false);

      setCanScrollSidebarDown(false);

      return;

    }



    const threshold = 8;



    setCanScrollSidebarUp(

      element.scrollTop > threshold,

    );



    setCanScrollSidebarDown(

      element.scrollTop +

      element.clientHeight <

      element.scrollHeight -

      threshold,

    );

  }





  function scrollSidebar(

    direction: "up" | "down",

  ) {

    sidebarNavRef.current?.scrollBy({

      top:

        direction === "up"

          ? -190

          : 190,

      behavior: "smooth",

    });

  }





  useEffect(() => {

    const frame =

      window.requestAnimationFrame(

        () => {

          const activeLink =

            sidebarNavRef.current

              ?.querySelector<HTMLElement>(

                ".sidebar-link.active",

              );



          activeLink?.scrollIntoView({

            block: "nearest",

          });



          updateSidebarScrollState();

        },

      );



    window.addEventListener(

      "resize",

      updateSidebarScrollState,

    );



    return () => {

      window.cancelAnimationFrame(

        frame,

      );



      window.removeEventListener(

        "resize",

        updateSidebarScrollState,

      );

    };

  }, [

    admin,

    path,

    loadingUser,

  ]);





  /* Load the signed-in user */



  useEffect(() => {

    let active = true;



    async function loadCurrentUser() {

      try {

        const response =

          await authService.me();



        const currentUser =

          response.data.user;



        if (!active) {

          return;

        }



        const expectedRole = admin

          ? "admin"

          : "student";



        if (

          currentUser.role !==

          expectedRole

        ) {

          if (admin) {

            navigate({

              to: "/admin/login",

            });

          } else {

            navigate({

              to: "/login",

            });

          }



          return;

        }



        setUser(currentUser);



      } catch {

        if (!active) {

          return;

        }



        if (admin) {

          navigate({

            to: "/admin/login",

          });

        } else {

          navigate({

            to: "/login",

          });

        }

      } finally {

        if (active) {

          setLoadingUser(false);

        }

      }

    }



    loadCurrentUser();



    return () => {

      active = false;

    };

  }, [admin, navigate]);





  /* Notification badge and sound */



  useEffect(() => {

    if (admin) {

      return;

    }



    function unlockNotificationSound() {

      userInteractedRef.current = true;

    }



    window.addEventListener(

      "pointerdown",

      unlockNotificationSound,

      { once: true },

    );



    window.addEventListener(

      "keydown",

      unlockNotificationSound,

      { once: true },

    );



    return () => {

      window.removeEventListener(

        "pointerdown",

        unlockNotificationSound,

      );



      window.removeEventListener(

        "keydown",

        unlockNotificationSound,

      );

    };

  }, [admin]);





  useEffect(() => {

    if (

      admin ||

      user?.role !== "student"

    ) {

      previousUnreadRef.current = null;

      setUnreadNotifications(0);

      setNotificationPulse(false);



      return;

    }



    let active = true;

    let pulseTimer:

      | ReturnType<typeof setTimeout>

      | undefined;





    async function playNotificationTone() {

      if (

        !userInteractedRef.current

      ) {

        return;

      }



      try {

        const context =

          audioContextRef.current ??

          new AudioContext();



        audioContextRef.current =

          context;



        if (

          context.state ===

          "suspended"

        ) {

          await context.resume();

        }



        const oscillator =

          context.createOscillator();



        const gain =

          context.createGain();



        oscillator.type = "sine";



        oscillator.frequency.setValueAtTime(

          880,

          context.currentTime,

        );



        gain.gain.setValueAtTime(

          0.0001,

          context.currentTime,

        );



        gain.gain.exponentialRampToValueAtTime(

          0.11,

          context.currentTime + 0.02,

        );



        gain.gain.exponentialRampToValueAtTime(

          0.0001,

          context.currentTime + 0.28,

        );



        oscillator.connect(gain);

        gain.connect(

          context.destination,

        );



        oscillator.start();

        oscillator.stop(

          context.currentTime + 0.3,

        );

      } catch {

        /*

         * Browsers may block audio until the user has interacted

         * with the page. The visual badge still works normally.

         */

      }

    }





    async function refreshUnreadNotifications(

      playFeedback = true,

    ) {

      try {

        const response =

          await apiRequest<{

            notifications: Array<{

              id: number;

              is_read: number;

            }>;

          }>(

            "/notifications/list.php?unread=1",

          );



        if (!active) {

          return;

        }



        const nextCount =

          response.data.notifications

            .length;



        const previousCount =

          previousUnreadRef.current;





        if (

          playFeedback &&

          previousCount !== null &&

          nextCount > previousCount

        ) {

          setNotificationPulse(

            true,

          );



          if (pulseTimer) {

            clearTimeout(

              pulseTimer,

            );

          }



          pulseTimer =

            setTimeout(

              () => {

                if (active) {

                  setNotificationPulse(

                    false,

                  );

                }

              },

              2600,

            );



          void playNotificationTone();

        }





        previousUnreadRef.current =

          nextCount;



        setUnreadNotifications(

          nextCount,

        );

      } catch {

        /*

         * Keep the previous badge value on a temporary network error.

         * It will retry automatically.

         */

      }

    }





    /*

     * Initial check: show the badge immediately, but do not play

     * a sound for notifications that were already waiting.

     */

    void refreshUnreadNotifications(

      false,

    );





    /*

     * Poll so server-generated notifications appear without

     * reloading or opening the Notifications page.

     */

    const interval =

      window.setInterval(

        () => {

          void refreshUnreadNotifications(

            true,

          );

        },

        5000,

      );





    /*

     * Refresh immediately when the user returns to this tab.

     */

    const handleFocus = () => {

      void refreshUnreadNotifications(

        true,

      );

    };





    const handleVisibility =

      () => {

        if (

          document.visibilityState ===

          "visible"

        ) {

          void refreshUnreadNotifications(

            true,

          );

        }

      };





    /*

     * Student pages can dispatch this after an action that may

     * create, remove, or read a notification.

     */

    const handleNotificationChange =

      () => {

        void refreshUnreadNotifications(

          true,

        );

      };





    window.addEventListener(

      "focus",

      handleFocus,

    );



    document.addEventListener(

      "visibilitychange",

      handleVisibility,

    );



    window.addEventListener(

      "campuscoin:notifications-changed",

      handleNotificationChange,

    );





    return () => {

      active = false;



      window.clearInterval(

        interval,

      );



      if (pulseTimer) {

        clearTimeout(

          pulseTimer,

        );

      }



      window.removeEventListener(

        "focus",

        handleFocus,

      );



      document.removeEventListener(

        "visibilitychange",

        handleVisibility,

      );



      window.removeEventListener(

        "campuscoin:notifications-changed",

        handleNotificationChange,

      );

    };

  }, [admin, user?.role]);









  /* Keep profile details in sync */



  useEffect(() => {

    const handleProfileUpdate = (

      event: Event,

    ) => {

      const detail =

        (

          event as CustomEvent<{

            name?: string;

            profile_image_url?:

              string | null;

          }>

        ).detail;



      if (!detail) {

        return;

      }



      setUser((current) =>

        current

          ? {

              ...current,

              ...(detail.name

                ? {

                    name:

                      detail.name,

                  }

                : {}),

              ...(Object.prototype.hasOwnProperty.call(

                detail,

                "profile_image_url",

              )

                ? {

                    profile_image_url:

                      detail.profile_image_url ??

                      null,

                  }

                : {}),

            }

          : current,

      );

    };



    window.addEventListener(

      "campuscoin:profile-updated",

      handleProfileUpdate,

    );



    return () => {

      window.removeEventListener(

        "campuscoin:profile-updated",

        handleProfileUpdate,

      );

    };

  }, []);





  /* Sign out */



  async function handleLogout() {

    if (loggingOut) {

      return;

    }



    try {

      setLoggingOut(true);



      await authService.logout();



      setUser(null);

      setProfileOpen(false);



      await notice(

        "Logged out",

        "You have been signed out successfully.",

        "success",

      );



      if (admin) {

        navigate({

          to: "/admin/login",

        });

      } else {

        navigate({

          to: "/login",

        });

      }

    } catch (error) {

      await notice(

        "Logout failed",

        error instanceof Error

          ? error.message

          : "Unable to logout. Please try again.",

        "error",

      );

    } finally {

      setLoggingOut(false);

    }

  }





  /* Loading state */



  if (loadingUser) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-background">

        <div className="text-center">

          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />



          <p className="mt-4 text-sm font-medium text-muted-foreground">

            Loading your workspace...

          </p>

        </div>

      </div>

    );

  }





  if (!user) {

    return null;

  }





  return (

    <div className="dashboard-glass-bg min-h-screen">

      <div

        className="dashboard-glow dashboard-glow-green"

        aria-hidden="true"

      />



      <div

        className="dashboard-glow dashboard-glow-coral"

        aria-hidden="true"

      />



      {/* Sidebar */}



      <aside

        className={cn(

          "glass-sidebar fixed inset-y-0 left-0 z-50 flex w-[236px] flex-col border-r border-sidebar-border/60 transition-transform duration-200 lg:translate-x-0",

          sidebarOpen

            ? "translate-x-0"

            : "-translate-x-full",

        )}

      >

        <div className="flex h-[76px] items-center justify-between border-b border-sidebar-border px-5">

          <Brand homeTo={admin ? null : "/"} />



          <Button

            variant="ghost"

            size="icon"

            className="lg:hidden"

            aria-label="Close navigation"

            onClick={() =>

              setSidebarOpen(false)

            }

          >

            <X />

          </Button>

        </div>





        {/* User summary */}



        <div className="border-b border-sidebar-border px-4 py-4">

          <div className="flex items-center gap-3">

            <WorkspaceAvatar

              name={user.name}

              imageUrl={

                user.profile_image_url ?? null

              }

              className="size-10 rounded-full text-xs"

            />



            <div className="min-w-0">

              <p className="truncate text-sm font-semibold">

                {user.name}

              </p>



              <p className="truncate text-xs text-muted-foreground">

                {user.email}

              </p>

            </div>

          </div>

        </div>





        {/* Navigation */}



        <div className="relative min-h-0 flex-1">



          {/* Scroll up */}



          {canScrollSidebarUp && (

            <button

              type="button"

              aria-label="Scroll navigation up"

              title="Scroll up"

              onClick={() =>

                scrollSidebar("up")

              }

              className="absolute left-1/2 top-2 z-20 flex h-7 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-white/55 text-primary shadow-[0_8px_22px_rgba(37,58,44,0.12)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-primary/20 dark:bg-primary/15 dark:text-primary dark:shadow-[0_8px_24px_rgba(0,0,0,0.28)] dark:hover:bg-primary/25"

            >

              <ChevronUp size={17} />

            </button>

          )}





          {/* Scrollable navigation with the native scrollbar hidden */}



          <div

            ref={sidebarNavRef}

            onScroll={

              updateSidebarScrollState

            }

            className="h-full overflow-y-auto overscroll-contain px-3 py-9 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"

          >

            <p className="px-3 pb-3 text-[11px] font-bold uppercase text-muted-foreground">

              {admin

                ? "Administration"

                : "Workspace"}

            </p>



            <nav className="space-y-0.5">

              {nav.map((item) => (

                <Link

                  key={item.to}

                  to={item.to}

                  onClick={() =>

                    setSidebarOpen(false)

                  }

                  className={cn(

                    "sidebar-link min-h-10",

                    path === item.to &&

                    "active",

                  )}

                >

                  <item.icon

                    size={18}

                    strokeWidth={1.8}

                  />



                  {item.label}

                </Link>

              ))}

            </nav>

          </div>





          {/* Scroll down */}



          {canScrollSidebarDown && (

            <button

              type="button"

              aria-label="Scroll navigation down"

              title="Scroll down"

              onClick={() =>

                scrollSidebar("down")

              }

              className="absolute bottom-2 left-1/2 z-20 flex h-7 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-white/55 text-primary shadow-[0_8px_22px_rgba(37,58,44,0.12)] backdrop-blur-xl transition-all duration-200 hover:translate-y-0.5 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-primary/20 dark:bg-primary/15 dark:text-primary dark:shadow-[0_8px_24px_rgba(0,0,0,0.28)] dark:hover:bg-primary/25"

            >

              <ChevronDown size={17} />

            </button>

          )}

        </div>





        {/* Sign out */}



        <div className="border-t border-sidebar-border p-3">

          <Button

            type="button"

            variant="ghost"

            disabled={loggingOut}

            onClick={handleLogout}

            className="h-11 w-full justify-start gap-3 px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"

          >

            <LogOut size={18} />



            {loggingOut

              ? "Logging out..."

              : "Logout"}

          </Button>

        </div>

      </aside>





      {/* Mobile backdrop */}



      {sidebarOpen && (

        <div

          className="fixed inset-0 z-40 bg-foreground/35 lg:hidden"

          onClick={() =>

            setSidebarOpen(false)

          }

        />

      )}





      {/* Main content area */}



      <div className="relative z-[1] min-w-0 lg:ml-[236px]">



        {/* Header */}



        <header className="app-shell-glass-header sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b px-3 sm:px-5 md:px-8 lg:h-[76px] lg:px-9">

          <div className="flex items-center gap-3">

            <Button

              variant="ghost"

              size="icon"

              className="lg:hidden"

              aria-label="Open navigation"

              onClick={() =>

                setSidebarOpen(true)

              }

            >

              <Menu />

            </Button>



            <span className="hidden text-sm text-muted-foreground sm:block">

              {admin

                ? "Admin workspace"

                : `Welcome back, ${user.name.split(" ")[0]}`}

            </span>

          </div>





          <div className="flex items-center gap-2 sm:gap-3">



            {/* Theme */}



            <ThemeToggle />





            {/* Notifications */}



            {!admin && (

              <Link

                to="/notifications"

                aria-label={

                  unreadNotifications > 0

                    ? `${unreadNotifications} unread notifications`

                    : "Notifications"

                }

                title={

                  unreadNotifications > 0

                    ? `${unreadNotifications} new notification${unreadNotifications === 1

                      ? ""

                      : "s"

                    }`

                    : "Notifications"

                }

                className={cn(

                  "glass-control relative flex size-10 items-center justify-center rounded-full text-muted-foreground",

                  unreadNotifications > 0 &&

                  "text-destructive",

                  notificationPulse &&

                  "animate-bounce",

                )}

              >

                <Bell

                  size={19}

                  className={cn(

                    "transition-colors",

                    unreadNotifications > 0 &&

                    "fill-destructive/15 text-destructive",

                  )}

                />



                {unreadNotifications >

                  0 && (

                    <>

                      {notificationPulse && (

                        <span className="absolute -right-1 -top-1 size-4 animate-ping rounded-full bg-destructive/60" />

                      )}



                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-none text-white shadow-sm">

                        {unreadNotifications >

                          9

                          ? "9+"

                          : unreadNotifications}

                      </span>



                      <span className="sr-only">

                        {

                          unreadNotifications

                        }{" "}

                        unread notifications

                      </span>

                    </>

                  )}

              </Link>

            )}





            {/* Profile menu */}



            <div className="relative">

              <Button

                variant="ghost"

                className="h-11 gap-2 rounded-full px-1.5"

                aria-label="Profile menu"

                onClick={() =>

                  setProfileOpen(

                    (current) =>

                      !current,

                  )

                }

              >

                <WorkspaceAvatar

                  name={user.name}

                  imageUrl={

                    user.profile_image_url ?? null

                  }

                  className="size-8 rounded-full text-xs"

                />



                <span className="hidden max-w-[120px] truncate text-sm font-semibold sm:block">

                  {user.name}

                </span>



                <ChevronDown

                  size={14}

                />

              </Button>





              {profileOpen && (

                <div className="glass-surface absolute right-0 top-12 z-50 w-56 p-1.5">

                  <div className="border-b border-border px-3 py-2.5">

                    <p className="truncate text-sm font-semibold">

                      {user.name}

                    </p>



                    <p className="truncate text-xs text-muted-foreground">

                      {user.email}

                    </p>

                  </div>





                  <Link

                    to={

                      admin

                        ? "/admin/profile"

                        : "/profile"

                    }

                    onClick={() =>

                      setProfileOpen(false)

                    }

                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"

                  >

                    <UserRound size={16} />



                    My Profile

                  </Link>





                  <Button

                    type="button"

                    variant="ghost"

                    disabled={loggingOut}

                    onClick={handleLogout}

                    className="h-9 w-full justify-start gap-2 px-3 text-sm font-normal"

                  >

                    <LogOut size={16} />



                    {loggingOut

                      ? "Logging out..."

                      : "Logout"}

                  </Button>

                </div>

              )}

            </div>

          </div>

        </header>





        {/* Page content */}



        <main className="page-enter mx-auto max-w-[1440px] px-4 pb-28 pt-5 sm:px-5 md:px-8 md:pt-7 lg:px-9 lg:pb-12">

          <nav

            aria-label="Breadcrumb"

            className="mb-5 flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

          >

            <Link

              to={dashboardPath}

              className={cn(

                "rounded-md px-1 py-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",

                path === dashboardPath &&

                "font-semibold text-foreground",

              )}

              aria-current={

                path === dashboardPath

                  ? "page"

                  : undefined

              }

            >

              Dashboard

            </Link>



            {path !== dashboardPath && (

              <>

                <ChevronRight

                  size={13}

                  className="shrink-0 opacity-60"

                  aria-hidden="true"

                />



                <span

                  className="truncate font-semibold text-foreground"

                  aria-current="page"

                >

                  {breadcrumbLabel}

                </span>

              </>

            )}

          </nav>



          {children}

        </main>

      </div>





      {/* Mobile student navigation */}



      {!admin && (

        <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_rgba(25,35,29,0.06)] backdrop-blur-xl lg:hidden">

          {[

            {

              to: "/dashboard",

              label: "Dashboard",

              icon: LayoutDashboard,

            },

            {

              to: "/transactions",

              label: "Expenses",

              icon: ReceiptText,

            },

            {

              to: "/budgets",

              label: "Budgets",

              icon: ChartPie,

            },

            {

              to: "/reports",

              label: "Reports",

              icon: ChartNoAxesCombined,

            },

          ].map((item) => (

            <Link

              key={item.to}

              to={item.to}

              className={cn(

                "flex min-h-16 min-w-16 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground",

                path === item.to &&

                "text-primary",

              )}

            >

              <item.icon size={19} />



              {item.label}

            </Link>

          ))}



          <Button

            variant="ghost"

            className="flex min-h-16 min-w-16 flex-col gap-1 rounded-none px-0 text-[10px] text-muted-foreground"

            onClick={() =>

              setSidebarOpen(true)

            }

          >

            <Menu size={19} />

            More

          </Button>

        </nav>

      )}

    </div>

  );

}





/* Small security note */



export function SecureNote() {

  return (

    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">

      <ShieldCheck size={14} />

      Made for your student life

    </span>

  );

}