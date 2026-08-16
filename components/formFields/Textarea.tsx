'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BaseField, FormFieldProps } from "./RenderFormFields";
import { Textarea } from "../ui/textarea";


export type TextareaFieldType = BaseField & {
    hideLabel?: boolean;
    placeholder: string;
}

export default function TextAreaFormField({ props, data, setData, handleChangeData }: FormFieldProps<TextareaFieldType>) {

    return (
        <Field key={props.field}>
            {props.hideLabel === undefined || props.hideLabel === false && <FieldLabel>{props.name}</FieldLabel>}
            <Textarea
                value={data[props.field] ?? ""}
                name={props.field}
                onChange={handleChangeData}
                rows={6}
                placeholder={props.placeholder}
            />
        </Field>
    )
}