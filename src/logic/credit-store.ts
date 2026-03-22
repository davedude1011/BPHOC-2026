import { createSignal } from "solid-js";

interface credit_t {
    id: number,
    author: string,
    href: string,
    label: string,
    task: number,
}

export const [credits, set_credits] = createSignal<credit_t[]>([]);

export function give_credit(props: Omit<credit_t, "id">) {
    const matching_credit = credits()
        .find(credit =>
            credit.author == props.author &&
            credit.href   == props.href   &&
            credit.task   == props.task
        );
    if (matching_credit) return matching_credit.id;

    const id = credits().length + 1;
    set_credits(credits => [...credits, {id, ...props}]);

    return id;
}