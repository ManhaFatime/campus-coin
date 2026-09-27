"use client";

import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* Date helpers */

function parseDateValue(
  value?: string,
) {
  if (
    !value ||
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  ) {
    return undefined;
  }

  const parts =
    value
      .split("-")
      .map(Number);

  const year =
    parts[0];

  const month =
    parts[1];

  const day =
    parts[2];

  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return undefined;
  }

  const date =
    new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0,
    );

  if (
    Number.isNaN(
      date.getTime(),
    ) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function toDateValue(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(
  value?: string,
) {
  const date =
    parseDateValue(
      value,
    );

  if (!date) {
    return "";
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

function parseMonthValue(
  value?: string,
) {
  if (
    !value ||
    !/^\d{4}-\d{2}$/.test(
      value,
    )
  ) {
    return undefined;
  }

  const parts =
    value
      .split("-")
      .map(Number);

  const year =
    parts[0];

  const month =
    parts[1];

  if (
    year === undefined ||
    month === undefined ||
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    year < 1 ||
    month < 1 ||
    month > 12
  ) {
    return undefined;
  }

  return {
    year,
    month,
  };
}

function formatMonthLabel(
  value?: string,
) {
  const parsed =
    parseMonthValue(
      value,
    );

  if (!parsed) {
    return "";
  }

  return new Date(
    parsed.year,
    parsed.month - 1,
    1,
    12,
  ).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );
}

function toMonthValue(
  year: number,
  monthIndex: number,
) {
  return `${year}-${String(
    monthIndex + 1,
  ).padStart(2, "0")}`;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* Shared picker trigger styles */

const triggerClass =
  [
    "group h-11 w-full justify-between rounded-[14px]",
    "border border-border/80 bg-card/70 px-3.5",
    "text-left text-[13px] font-semibold text-foreground",
    "shadow-[0_6px_18px_rgba(28,55,39,0.06),inset_0_1px_0_rgba(255,255,255,0.55)]",
    "backdrop-blur-xl",
    "transition-[border-color,background-color,box-shadow,transform] duration-200",
    "hover:border-primary/25 hover:bg-card/90",
    "hover:shadow-[0_10px_24px_rgba(28,55,39,0.09),inset_0_1px_0_rgba(255,255,255,0.72)]",
    "focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10",
    "data-[state=open]:border-primary/35 data-[state=open]:bg-card/95",
    "dark:border-white/[0.09] dark:bg-white/[0.055]",
    "dark:shadow-[0_8px_22px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.035)]",
    "dark:hover:border-primary/25 dark:hover:bg-white/[0.075]",
    "dark:data-[state=open]:border-primary/30 dark:data-[state=open]:bg-[#173629]/88",
  ].join(" ");

/* Date picker */

type PremiumDatePickerProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    value: string,
  ) => void;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
};

export function PremiumDatePicker({
  name,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Select date",
  required = false,
  min,
  max,
  disabled = false,
  clearable,
  className,
}: PremiumDatePickerProps) {
  const controlled =
    value !== undefined;

  const [
    internalValue,
    setInternalValue,
  ] =
    React.useState(
      defaultValue,
    );

  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const currentValue =
    controlled
      ? value ?? ""
      : internalValue;

  const selected =
    parseDateValue(
      currentValue,
    );

  const minDate =
    parseDateValue(min);

  const maxDate =
    parseDateValue(max);

  const canClear =
    clearable ??
    !required;

  function commit(
    nextValue: string,
  ) {
    if (!controlled) {
      setInternalValue(
        nextValue,
      );
    }

    onValueChange?.(
      nextValue,
    );
  }

  function isDisabledDate(
    date: Date,
  ) {
    const current =
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12,
      );

    if (
      minDate &&
      current < minDate
    ) {
      return true;
    }

    if (
      maxDate &&
      current > maxDate
    ) {
      return true;
    }

    return false;
  }

  const today =
    new Date();

  const normalizedToday =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12,
    );

  const todayDisabled =
    isDisabledDate(
      normalizedToday,
    );

  return (
    <div
      className={cn(
        "w-full",
        className,
      )}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            currentValue
          }
        />
      )}

      <Popover
        open={open}
        onOpenChange={
          setOpen
        }
      >
        <PopoverTrigger
          asChild
        >
          <Button
            type="button"
            variant="outline"
            disabled={
              disabled
            }
            aria-required={
              required
            }
            className={cn(
              triggerClass,
              !currentValue &&
              "text-muted-foreground",
            )}
          >
            <span
              className="min-w-0 truncate"
            >
              {currentValue
                ? formatDateLabel(
                  currentValue,
                )
                : placeholder}
            </span>

            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-[9px]",
                "bg-primary/[0.075] text-primary",
                "dark:bg-primary/10 dark:text-[#a9d8b9]",
              )}
            >
              <CalendarDays
                className="size-4"
                strokeWidth={
                  2
                }
              />
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className={cn(
            "z-[100000] w-auto overflow-hidden rounded-[22px] border border-white/70 p-0",
            "bg-[#fbfaf7]/96 text-popover-foreground",
            "shadow-[0_28px_80px_rgba(19,44,30,0.22),0_8px_24px_rgba(19,44,30,0.09),inset_0_1px_0_rgba(255,255,255,0.92)]",
            "backdrop-blur-2xl",
            "dark:border-white/[0.10] dark:bg-[#10281e]/97",
            "dark:shadow-[0_32px_90px_rgba(0,0,0,0.50),0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.045)]",
          )}
        >
          <div
            className="border-b border-border/60 px-4 py-3 dark:border-white/[0.07]"
          >
            <p
              className="text-[11px] font-bold uppercase tracking-[0.11em] text-muted-foreground"
            >
              Choose date
            </p>

            <p
              className="mt-0.5 text-sm font-semibold text-foreground"
            >
              {currentValue
                ? formatDateLabel(
                  currentValue,
                )
                : "Pick a day"}
            </p>
          </div>

          <Calendar
            mode="single"
            selected={
              selected
            }
            defaultMonth={
              selected ??
              minDate ??
              new Date()
            }
            onSelect={(
              nextDate,
            ) => {
              if (
                !nextDate
              ) {
                return;
              }

              commit(
                toDateValue(
                  nextDate,
                ),
              );

              setOpen(
                false,
              );
            }}
            disabled={
              isDisabledDate
            }
            showOutsideDays
            className={cn(
              "bg-transparent p-3",
              "[--cell-size:2.25rem]",
            )}
            classNames={{
              month_caption:
                "flex h-9 w-full items-center justify-center px-10",
              caption_label:
                "text-sm font-bold tracking-[-0.02em] text-foreground",
              weekday:
                "flex-1 select-none rounded-md text-[0.72rem] font-semibold text-muted-foreground",
              today:
                "rounded-[10px] bg-primary/[0.08] text-primary",
              day:
                "group/day relative aspect-square h-full w-full select-none p-0 text-center",
              outside:
                "text-muted-foreground/45",
            }}
          />

          <div
            className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2.5 dark:border-white/[0.07]"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={
                todayDisabled
              }
              onClick={() => {
                commit(
                  toDateValue(
                    normalizedToday,
                  ),
                );

                setOpen(
                  false,
                );
              }}
              className="h-8 rounded-[10px] px-3 text-xs"
            >
              Today
            </Button>

            {canClear &&
              currentValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    commit("");
                    setOpen(
                      false,
                    );
                  }}
                  className="h-8 rounded-[10px] px-3 text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear
                </Button>
              )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* Month picker */

type PremiumMonthPickerProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    value: string,
  ) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
};

export function PremiumMonthPicker({
  name,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Select month",
  min,
  max,
  disabled = false,
  className,
}: PremiumMonthPickerProps) {
  const controlled =
    value !== undefined;

  const [
    internalValue,
    setInternalValue,
  ] =
    React.useState(
      defaultValue,
    );

  const currentValue =
    controlled
      ? value ?? ""
      : internalValue;

  const parsed =
    parseMonthValue(
      currentValue,
    );

  const [
    visibleYear,
    setVisibleYear,
  ] =
    React.useState(
      parsed?.year ??
      new Date().getFullYear(),
    );

  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  React.useEffect(() => {
    if (
      open &&
      parsed?.year
    ) {
      setVisibleYear(
        parsed.year,
      );
    }
  }, [
    open,
    parsed?.year,
  ]);

  function commit(
    nextValue: string,
  ) {
    if (!controlled) {
      setInternalValue(
        nextValue,
      );
    }

    onValueChange?.(
      nextValue,
    );
  }

  function monthDisabled(
    monthIndex: number,
  ) {
    const nextValue =
      toMonthValue(
        visibleYear,
        monthIndex,
      );

    if (
      min &&
      nextValue < min
    ) {
      return true;
    }

    if (
      max &&
      nextValue > max
    ) {
      return true;
    }

    return false;
  }

  return (
    <div
      className={cn(
        "w-full",
        className,
      )}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            currentValue
          }
        />
      )}

      <Popover
        open={open}
        onOpenChange={
          setOpen
        }
      >
        <PopoverTrigger
          asChild
        >
          <Button
            type="button"
            variant="outline"
            disabled={
              disabled
            }
            className={cn(
              triggerClass,
              !currentValue &&
              "text-muted-foreground",
            )}
          >
            <span
              className="min-w-0 truncate"
            >
              {currentValue
                ? formatMonthLabel(
                  currentValue,
                )
                : placeholder}
            </span>

            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-[9px]",
                "bg-primary/[0.075] text-primary",
                "dark:bg-primary/10 dark:text-[#a9d8b9]",
              )}
            >
              <CalendarDays
                className="size-4"
                strokeWidth={
                  2
                }
              />
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className={cn(
            "z-[100000] w-[320px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[22px]",
            "border border-white/70 bg-[#fbfaf7]/96 p-0",
            "shadow-[0_28px_80px_rgba(19,44,30,0.22),0_8px_24px_rgba(19,44,30,0.09),inset_0_1px_0_rgba(255,255,255,0.92)]",
            "backdrop-blur-2xl",
            "dark:border-white/[0.10] dark:bg-[#10281e]/97",
            "dark:shadow-[0_32px_90px_rgba(0,0,0,0.50),0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.045)]",
          )}
        >
          <div
            className="flex items-center justify-between border-b border-border/60 px-3 py-3 dark:border-white/[0.07]"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-[10px]"
              aria-label="Previous year"
              onClick={() =>
                setVisibleYear(
                  (
                    current,
                  ) =>
                    current -
                    1,
                )
              }
            >
              <ChevronLeft
                size={16}
              />
            </Button>

            <div
              className="text-center"
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted-foreground"
              >
                Choose month
              </p>

              <p
                className="mt-0.5 text-sm font-bold text-foreground"
              >
                {visibleYear}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-[10px]"
              aria-label="Next year"
              onClick={() =>
                setVisibleYear(
                  (
                    current,
                  ) =>
                    current +
                    1,
                )
              }
            >
              <ChevronRight
                size={16}
              />
            </Button>
          </div>

          <div
            className="grid grid-cols-3 gap-1.5 p-3"
          >
            {months.map(
              (
                monthName,
                monthIndex,
              ) => {
                const nextValue =
                  toMonthValue(
                    visibleYear,
                    monthIndex,
                  );

                const selected =
                  currentValue ===
                  nextValue;

                const monthIsDisabled =
                  monthDisabled(
                    monthIndex,
                  );

                return (
                  <button
                    key={
                      monthName
                    }
                    type="button"
                    disabled={
                      monthIsDisabled
                    }
                    onClick={() => {
                      commit(
                        nextValue,
                      );

                      setOpen(
                        false,
                      );
                    }}
                    className={cn(
                      "min-h-11 rounded-[12px] px-2 py-2 text-[12px] font-semibold",
                      "transition-[background-color,color,transform,box-shadow] duration-150",
                      "hover:bg-primary/[0.08] hover:text-primary",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
                      selected &&
                      "bg-primary text-primary-foreground shadow-[0_7px_18px_rgba(30,92,61,0.20)] hover:bg-primary hover:text-primary-foreground",
                      !selected &&
                      "text-foreground",
                      monthIsDisabled &&
                      "cursor-not-allowed opacity-35 hover:bg-transparent hover:text-foreground",
                      "dark:hover:bg-primary/[0.14] dark:hover:text-[#c8ead3]",
                      selected &&
                      "dark:text-primary-foreground dark:hover:text-primary-foreground",
                    )}
                  >
                    {monthName.slice(
                      0,
                      3,
                    )}
                  </button>
                );
              },
            )}
          </div>

          <div
            className="border-t border-border/60 px-3 py-2.5 text-center text-[11px] text-muted-foreground dark:border-white/[0.07]"
          >
            {currentValue
              ? `Selected · ${formatMonthLabel(
                currentValue,
              )}`
              : "Select a month to update the report"}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
