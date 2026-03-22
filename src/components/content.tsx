import { Divider } from "./page-utils"

export function Text({ children, centered, tail }: { children?: any, centered?: boolean, tail?: string }) {
    return (
        <div class={`font-serif text-xl ${centered ? "text-center" : "text-justify"} ${tail}`}>
            {children}
        </div>
    )
}

export function Link({ label, href }: { label: string, href: string }) {
    return (
        <a href={href} class="text-blue-500">
            {label}
        </a>
    )
}

export function Quote({ children, label, href }: { children?: any, label: string, href: string }) {
    return (
        <div class="flex flex-col gap-1">
            <div class="font-serif text-end">
                <a href={href} target="_blank" class="text-blue-500">{label}</a>
            </div>
            <Divider />
            <div class="text-justify italic font-serif">
                {children}
            </div>
        </div>
    )
}