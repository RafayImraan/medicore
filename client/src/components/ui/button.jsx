import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-luxury-gold shadow-lg shadow-primary-900/25 border border-primary-700/60 hover:from-primary-800 hover:to-primary-600 hover:shadow-primary-900/40",
        destructive:
          "bg-gradient-to-r from-accent-700 via-accent-600 to-accent-500 text-white shadow-lg shadow-accent-900/30 border border-accent-700/60 hover:from-accent-600 hover:to-accent-500",
        outline:
          "border border-primary-800/40 text-primary-900 dark:text-luxury-gold bg-transparent hover:bg-primary-900/10 dark:hover:bg-primary-900/30",
        secondary:
          "bg-charcoal-800/60 text-luxury-gold border border-primary-800/30 hover:bg-charcoal-800/80",
        ghost:
          "hover:bg-primary-900/10 dark:hover:bg-primary-900/30 text-primary-900 dark:text-luxury-gold",
        link: "text-primary-900 dark:text-luxury-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
