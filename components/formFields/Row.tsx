'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormFieldProps } from "./RenderFormFields";

export default function RowFormField({ props, data, setData, handleChangeData }: FormFieldProps) {

    return (
        <div className="flex w-full">
            <p>This is a row.</p>
        </div>
    )
}