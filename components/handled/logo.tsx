"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type HandledLogoProps = {
    className?: string
    iconClassName?: string
    textClassName?: string
    /** text shown next to icon */
    label?: string
    noText?: boolean
}

export default function Logo({
                                        className,
                                        iconClassName,
                                        textClassName,
                                        label = "Handled",
                                        noText = false
                                    }: HandledLogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Image
                src="/brand/logo.png"
                alt="Handled icon"
                width={169}
                height={161}
                className={cn("h-8 w-8", iconClassName)}
                priority
            />
            { !noText && <span
                className={cn(
                    "text-lg font-semibold tracking-tight text-foreground",
                    textClassName
                )}
            >
        {label}
      </span>}
        </div>
    )
}