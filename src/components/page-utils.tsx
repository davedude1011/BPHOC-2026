import { A } from "@solidjs/router";
import katex from "katex";
import "katex/dist/katex.min.css";
import { createEffect, createMemo } from "solid-js";
import { give_credit } from "../logic/credit-store";

export function PageContainer({ children }: { children?: any }) {
    return (
        <div class="w-screen h-fit overflow-x-hidden overflow-y-auto flex items-center justify-center py-24">
            <div class="w-200 h-fit">
                {children}
            </div>
        </div>
    )
}

export function Break({ count }: { count?: number }) {
    return (
        <div style={{ height: (count ?? 1) * 32 + "px" }} />
    )
}

export function Divider() {
    return (
        <div class="h-0 border border-muted/45" />
    )
}

export function PathButton({ index, title, subtitle, href }: { index: number, title: string, subtitle: string, href: string }) {
    const string_index = index < 10 ? "0" + index : index.toString();
    
    return (
        <A href={href} class="flex flex-row hover:bg-muted/5 transition-colors rounded cursor-pointer">
            <div class="p-6 font-serif text-muted font-bold">
                {string_index}
            </div>
            <div class="flex flex-1 flex-col font-serif justify-center">
                <div class="">
                    {title}
                </div>
                <div class="text-sm text-muted font-serif">
                    {subtitle}
                </div>
            </div>
        </A>
    )
}

export function TaskVisual({ task, filename }: { task: number, filename: string }) {
    return (
        <div class="flex items-center justify-center w-full">
            <img src={`./task-visuals/task-${task}/${filename}`} />
        </div>
    )
}

export function Latex(props: { children: string; block?: boolean }) {
  let el: HTMLSpanElement | undefined;

  createEffect(() => {
    if (el) {
      katex.render(props.children, el, {
        displayMode: props.block,
        throwOnError: false
      });
    }
  });

  return <span ref={el} />;
}

export function Credit(props: { label: string, author: string, href: string, task: number }) {
    const credit_id = createMemo(() => give_credit(props));

    return (
        <a href={props.href} target="_blank" class="text-purple-600">
            <span class="hover:underline">{props.label}</span>
            <sup  class="hover:underline">{credit_id()}</sup>
        </a>
    )
}