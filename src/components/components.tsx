import { Button as KobalteButton } from "@kobalte/core/button";
import { NumberField } from "@kobalte/core/number-field";
import { Slider } from "@kobalte/core/slider";
import type { Accessor, Setter } from "solid-js";
import { Latex } from "./page-utils";

interface number_props {
    label: string,

    from: number,
    to:   number,

    step: number,

    value: Accessor<number>,
    set_value: Setter<number>,
}

export function Range(props: number_props) {
    return (
        <Slider
            class="w-full"

            value={[props.value()]}
            onChange={e => props.set_value(e[0])}

            minValue={props.from}
            maxValue={props.to}

            step={props.step}
        >
            <Slider.Track class="h-2 w-full rounded-full bg-muted/25 relative">
                <Slider.Fill class="h-full rounded-e-full absolute" />
                <Slider.Thumb class="w-4 h-4 bg-muted rounded-full -top-1 cursor-pointer outline-0!">
                    <Slider.Input />
                </Slider.Thumb>
            </Slider.Track>
        </Slider>
    )
}

export function Field(props: number_props) {
    return (
        <NumberField
            class="flex text-muted hover:bg-muted/5 rounded flex-1 w-0"

            rawValue={props.value()}
            onRawValueChange={e => props.set_value(e)}

            minValue={props.from}
            maxValue={props.to}

            step={props.step}
        >
            <NumberField.Input class="flex p-2 flex-1 outline-0! min-w-0" />
        </NumberField>
    )
}

export function DualInput(props: number_props) {
    return (
        <div class="flex flex-col flex-1 p-4 gap-2">
            <div class="flex flex-row gap-2 w-full items-center">
                <Latex>
                    {"\\large " + props.label}
                </Latex>
                <Field {...props} />
            </div>
            <Range {...props} />
        </div>
    )
}

interface button_props {
    label: string,
    onclick: () => void,
}

export function Button(props: button_props) {
    return (
        <KobalteButton
            class="appearance-none inline-flex justify-center items-center h-10 w-fit outline-0! rounded px-4
            hover:bg-muted/25 transition-all border-2 border-muted/25 cursor-pointer active:scale-95
            font-serif"
            onClick={props.onclick}
        >
            {props.label}
        </KobalteButton>
    )
}