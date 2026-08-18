'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BaseField, FormFieldProps } from "./RenderFormFields";
import ComboboxEditor from "@/components/editor/ComboboxEditor";
import { JSX, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export type InputField = BaseField & {
    type: "input";
    placeholder: string;
    Icon?: LucideIcon,
    showLabel?: boolean;
    autoFocus?: boolean;
    className?: string;
};

export function HorizontalInputFormField({ props, data, setData, handleChangeData }: FormFieldProps<InputField>) {

    return (
        <Field
            className="flex flex-row items-center gap-2 w-full"
            key={props.field}
        >
            <FieldLabel className="max-w-[30%] w-fit">{props.name}</FieldLabel>
            <div className="w-full">
                <ComboboxEditor
                    value={data[props.field] ?? ""}
                    name={props.field}
                    onChange={handleChangeData}
                    placeholder={props.placeholder}
                    autoFocus={props.autoFocus}
                />
            </div>
        </Field>
    )
}

export function ComboboxInputFormField({ props, data, setData, handleChangeData }: FormFieldProps<InputField>) {

    return (
        <Field
            key={props.field}
            className={props.className ?? ""}
        >
            {(props.showLabel === undefined || props.showLabel != false) && <FieldLabel>{props.name}</FieldLabel>}
            <div className="flex w-full relative">

                <ComboboxEditor
                    placeholder={props.placeholder}
                    value={data[props.field] ?? ""}
                    name={props.field}
                    onChange={handleChangeData}
                />
            </div>
        </Field>
    )
}

export function InputFormField({ props, data, setData, handleChangeData }: FormFieldProps<InputField>) {

    return (
        <Field
            key={props.field}
            className={props.className ?? ""}
        >
            {(props.showLabel === undefined || props.showLabel != false) && <FieldLabel>{props.label ?? props.name}</FieldLabel>}
            <div className="relative">
                <div className="flex w-full relative">
                    {props.Icon && <props.Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
                    <Input
                        {...{
                            ...props,
                            ...props.props,
                            value: data[props.field] ?? "",
                            name: props.field,
                            onChange: handleChangeData,
                            className: props.Icon ? 'pl-9' : ''
                        }}
                    />
                </div>
            </div>
        </Field>
    )
}