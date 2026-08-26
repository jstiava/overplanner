'use client'


import { useRouter } from "next/navigation";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { BaseField, FormFieldProps } from "./RenderFormFields";
import { DatePicker } from "@/components/datepicker";
import { Switch } from "@/components/ui/switch";

export type SwitchField = BaseField & {
    description?: string;
}

export default function SwitchFormField({ props, data, setData, handleChangeData }: FormFieldProps<SwitchField>) {

    return (
        <Field key={props.field} orientation="horizontal" className="w-full">
            <FieldContent>
                <FieldLabel htmlFor="switch-focus-mode">
                    {props.name}
                </FieldLabel>
                {props.description && (
                    <FieldDescription>
                        {props.description}
                    </FieldDescription>
                )}
            </FieldContent>
            <Switch id="switch-focus-mode" />
        </Field>

    )

}
