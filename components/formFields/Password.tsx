'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormFieldProps } from "./RenderFormFields";

export default function PasswordFormField({ props, data, setData, handleChangeData }: FormFieldProps) {

    return (
        <Field key={props.field}>
            <FieldLabel>{props.label ?? props.name}</FieldLabel>
            <Input
                {...{
                    ...props,
                    ...props.props,
                    value: data[props.field] ?? "",
                    type: 'password',
                    name: props.field,
                    onChange: handleChangeData
                }}
            />
        </Field>
    )
}