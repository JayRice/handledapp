"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

type EditTextProps = {
    value: string | null | undefined
    onChange: (value: string) => void
    onCommit?: (value: string) => Promise<void> | void
    className?: string
    placeholder?: string
}

export function EditText({
                             value,
                             onChange,
                             onCommit,
                             className = "",
                             placeholder = "",
                         }: EditTextProps) {
    const [editing, setEditing] = React.useState(false)
    const [draft, setDraft] = React.useState(value ?? "")
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        setDraft(value ?? "")
    }, [value])

    React.useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    const commit = async () => {
        const trimmed = draft.trim()
        onChange(trimmed)
        setEditing(false)
        if (onCommit) await onCommit(trimmed)
    }

    const cancel = () => {
        setDraft(value ?? "")
        setEditing(false)
    }

    if (editing) {
        return (
            <Input
                ref={inputRef}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(e) => {
            if (e.key === "Enter") void commit()
            if (e.key === "Escape") cancel()
        }}
        className="h-8"
            />
    )
    }

    return (
        <span
            onClick={() => setEditing(true)}
    className={`cursor-pointer hover:underline ${className}`}
>
    {value || placeholder}
    </span>
)
}