import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "cn"

function Callout({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout"
      className={cn(
        "group/callout flex w-full flex-col items-center gap-4 rounded-xl bg-card p-6 text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10 lg:flex-row",
        className
      )}
      {...props}
    />
  )
}

function CalloutIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout-icon"
      className={cn(
        "grid size-12 shrink-0 place-content-center rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CalloutContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout-content"
      className={cn("flex w-full flex-col gap-1 text-center lg:flex-1 lg:text-left", className)}
      {...props}
    />
  )
}

function CalloutTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout-title"
      className={cn("font-heading text-base leading-normal font-medium", className)}
      {...props}
    />
  )
}

function CalloutDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout-description"
      className={cn("text-balance text-muted-foreground text-sm md:text-pretty", className)}
      {...props}
    />
  )
}

function CalloutAction({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn("w-full shrink-0 lg:w-auto", className),
      },
      props
    ),
    state: { slot: "callout-action" },
  })
}

export { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction }
