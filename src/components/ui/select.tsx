"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";


const Select =
  SelectPrimitive.Root;

const SelectGroup =
  SelectPrimitive.Group;

const SelectValue =
  SelectPrimitive.Value;


/* =========================================================
   PREMIUM TRIGGER
   ========================================================= */

const SelectTrigger =
  React.forwardRef<
    React.ElementRef<
      typeof SelectPrimitive.Trigger
    >,
    React.ComponentPropsWithoutRef<
      typeof SelectPrimitive.Trigger
    >
  >(
    (
      {
        className,
        children,
        ...props
      },
      ref,
    ) => (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          [
            "group flex h-11 w-full items-center justify-between",
            "gap-3 whitespace-nowrap rounded-[14px]",
            "border border-border/80",
            "bg-card/70 px-3.5",
            "text-left text-[13px] font-semibold text-foreground",
            "shadow-[0_6px_18px_rgba(28,55,39,0.06),inset_0_1px_0_rgba(255,255,255,0.55)]",
            "backdrop-blur-xl",
            "outline-none",
            "transition-[border-color,background-color,box-shadow,transform] duration-200",
            "hover:border-primary/25 hover:bg-card/90",
            "hover:shadow-[0_10px_24px_rgba(28,55,39,0.09),inset_0_1px_0_rgba(255,255,255,0.72)]",
            "focus:border-primary/40",
            "focus:ring-4 focus:ring-primary/10",
            "data-[state=open]:border-primary/35",
            "data-[state=open]:bg-card/95",
            "data-[state=open]:shadow-[0_12px_28px_rgba(28,55,39,0.12),inset_0_1px_0_rgba(255,255,255,0.78)]",
            "data-[placeholder]:text-muted-foreground/80",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1",
            "dark:border-white/[0.09]",
            "dark:bg-white/[0.055]",
            "dark:shadow-[0_8px_22px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.035)]",
            "dark:hover:border-primary/25",
            "dark:hover:bg-white/[0.075]",
            "dark:data-[state=open]:border-primary/30",
            "dark:data-[state=open]:bg-[#173629]/88",
            "dark:focus:ring-primary/10",
          ].join(" "),
          className,
        )}
        {...props}
      >
        {children}

        <SelectPrimitive.Icon
          asChild
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-[9px]",
              "bg-primary/[0.075] text-primary",
              "transition-transform duration-200",
              "group-data-[state=open]:rotate-180",
              "dark:bg-primary/10 dark:text-[#a9d8b9]",
            )}
          >
            <ChevronDown
              className="size-4"
              strokeWidth={2}
            />
          </span>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    ),
  );

SelectTrigger.displayName =
  SelectPrimitive.Trigger.displayName;


/* =========================================================
   SCROLL CONTROLS
   ========================================================= */

const SelectScrollUpButton =
  React.forwardRef<
    React.ElementRef<
      typeof SelectPrimitive.ScrollUpButton
    >,
    React.ComponentPropsWithoutRef<
      typeof SelectPrimitive.ScrollUpButton
    >
  >(
    (
      {
        className,
        ...props
      },
      ref,
    ) => (
      <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn(
          "flex h-8 cursor-default items-center justify-center text-muted-foreground",
          className,
        )}
        {...props}
      >
        <ChevronUp
          className="size-4"
        />
      </SelectPrimitive.ScrollUpButton>
    ),
  );

SelectScrollUpButton.displayName =
  SelectPrimitive.ScrollUpButton.displayName;


const SelectScrollDownButton =
  React.forwardRef<
    React.ElementRef<
      typeof SelectPrimitive.ScrollDownButton
    >,
    React.ComponentPropsWithoutRef<
      typeof SelectPrimitive.ScrollDownButton
    >
  >(
    (
      {
        className,
        ...props
      },
      ref,
    ) => (
      <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn(
          "flex h-8 cursor-default items-center justify-center text-muted-foreground",
          className,
        )}
        {...props}
      >
        <ChevronDown
          className="size-4"
        />
      </SelectPrimitive.ScrollDownButton>
    ),
  );

SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;


/* =========================================================
   PREMIUM FLOATING MENU
   ========================================================= */

const SelectContent =
  React.forwardRef<
    React.ElementRef<
      typeof SelectPrimitive.Content
    >,
    React.ComponentPropsWithoutRef<
      typeof SelectPrimitive.Content
    >
  >(
    (
      {
        className,
        children,
        position = "popper",
        sideOffset = 7,
        ...props
      },
      ref,
    ) => (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          sideOffset={sideOffset}
          className={cn(
            [
              "relative z-[100000]",
              "max-h-[min(320px,var(--radix-select-content-available-height))]",
              "min-w-[10rem]",
              "overflow-hidden",
              "rounded-[18px]",
              "border border-white/70",
              "bg-[#fbfaf7]/95",
              "text-popover-foreground",
              "shadow-[0_24px_70px_rgba(19,44,30,0.20),0_8px_24px_rgba(19,44,30,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
              "backdrop-blur-2xl",
              "data-[state=open]:animate-in",
              "data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0",
              "data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95",
              "data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2",
              "data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2",
              "origin-[var(--radix-select-content-transform-origin)]",
              "dark:border-white/[0.10]",
              "dark:bg-[#10281e]/96",
              "dark:shadow-[0_28px_80px_rgba(0,0,0,0.48),0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.045)]",
            ].join(" "),
            position ===
              "popper" &&
              [
                "data-[side=bottom]:translate-y-1",
                "data-[side=top]:-translate-y-1",
                "data-[side=left]:-translate-x-1",
                "data-[side=right]:translate-x-1",
              ].join(" "),
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.Viewport
            className={cn(
              "max-h-[300px] w-full overflow-y-auto p-1.5",
              position ===
                "popper" &&
                "min-w-[var(--radix-select-trigger-width)]",
            )}
          >
            {children}
          </SelectPrimitive.Viewport>

          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    ),
  );

SelectContent.displayName =
  SelectPrimitive.Content.displayName;


/* =========================================================
   LABEL
   ========================================================= */

const SelectLabel =
  React.forwardRef<
    React.ElementRef<
      typeof SelectPrimitive.Label
    >,
    React.ComponentPropsWithoutRef<
      typeof SelectPrimitive.Label
    >
  >(
    (
      {
        className,
        ...props
      },
      ref,
    ) => (
      <SelectPrimitive.Label
        ref={ref}
        className={cn(
          "px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.11em] text-muted-foreground",
          className,
        )}
        {...props}
      />
    ),
  );

SelectLabel.displayName =
  SelectPrimitive.Label.displayName;


/* =========================================================
   ITEM
   ========================================================= */

const SelectItem =
  React.forwardRef<
    React.ElementRef<
      typeof SelectPrimitive.Item
    >,
    React.ComponentPropsWithoutRef<
      typeof SelectPrimitive.Item
    >
  >(
    (
      {
        className,
        children,
        ...props
      },
      ref,
    ) => (
      <SelectPrimitive.Item
        ref={ref}
        className={cn(
          [
            "relative flex min-h-10 w-full cursor-pointer select-none items-center",
            "rounded-[12px] py-2.5 pl-10 pr-3",
            "text-[13px] font-medium text-foreground",
            "outline-none",
            "transition-[background-color,color,transform] duration-150",
            "focus:bg-primary/[0.09] focus:text-primary",
            "data-[state=checked]:bg-primary/[0.11]",
            "data-[state=checked]:font-semibold",
            "data-[state=checked]:text-primary",
            "data-[disabled]:pointer-events-none",
            "data-[disabled]:opacity-45",
            "dark:focus:bg-primary/[0.13]",
            "dark:focus:text-[#c8ead3]",
            "dark:data-[state=checked]:bg-primary/[0.15]",
            "dark:data-[state=checked]:text-[#c8ead3]",
          ].join(" "),
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "absolute left-3 flex size-5 items-center justify-center",
            "rounded-full",
            "text-primary",
            "dark:text-[#9fd2b1]",
          )}
        >
          <SelectPrimitive.ItemIndicator>
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full",
                "bg-primary/10",
                "dark:bg-primary/15",
              )}
            >
              <Check
                className="size-3.5"
                strokeWidth={2.4}
              />
            </span>
          </SelectPrimitive.ItemIndicator>
        </span>

        <SelectPrimitive.ItemText>
          {children}
        </SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    ),
  );

SelectItem.displayName =
  SelectPrimitive.Item.displayName;


/* =========================================================
   SEPARATOR
   ========================================================= */

const SelectSeparator =
  React.forwardRef<
    React.ElementRef<
      typeof SelectPrimitive.Separator
    >,
    React.ComponentPropsWithoutRef<
      typeof SelectPrimitive.Separator
    >
  >(
    (
      {
        className,
        ...props
      },
      ref,
    ) => (
      <SelectPrimitive.Separator
        ref={ref}
        className={cn(
          "-mx-1 my-1 h-px bg-border/70 dark:bg-white/[0.07]",
          className,
        )}
        {...props}
      />
    ),
  );

SelectSeparator.displayName =
  SelectPrimitive.Separator.displayName;


export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
