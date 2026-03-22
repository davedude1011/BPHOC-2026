import { Dot } from "lucide-solid";
import { children, For } from "solid-js";

export function Header({ children }: { children?: any }) {
    return (
        <div class="font-bold text-5xl font-serif">
            {children}
        </div>
    )
}

export function SubHeader({ children }: { children?: any }) {
    return (
        <div class="text-5xl font-serif italic">
            {children}
        </div>
    )
}

export function MutedHeader(props: { children?: any }) {
    const resolved = children(() => props.children);

    return (
        <div class="flex flex-wrap font-bold text-muted tracking-wider">
            <For each={resolved.toArray()}>
                {(child, index) => (
                    <>
                        {child}
                        {index() < resolved.toArray().length - 1 && <Dot />}
                    </>
                )}
            </For>
        </div>
    )
}