'use client'


import { useRouter } from "next/navigation";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { BaseField, FormFieldProps } from "./RenderFormFields";
import { DatePicker } from "@/components/datepicker";

export default function DateFormField({props, data, setData, handleChangeData} : FormFieldProps ) 
{

    return (
        <Field key={props.field}>
            <FieldLabel>{props.name}</FieldLabel>
            <DatePicker
                value={data[props.field] ?? ""}
                onSelect={(newDate) => {
                    handleChangeData({
                        e: {
                            target: {
                                name: props.field,
                                value: newDate
                            }
                        }
                    })
                }}
            />
        </Field>
    )

}