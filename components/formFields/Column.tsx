'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BaseField, FormFieldProps, RenderFormField } from "./RenderFormFields";


export type GroupField = BaseField & {
    fields: BaseField[],
    name: string
}

export default function ColumnFormField({ props, data, setData, handleChangeData }: FormFieldProps<GroupField>) {

    return (
        <div className="flex flex-col gap-1 w-full py-4 h-fit">
            <div className="flex w-full py-2">
                <FieldLabel>{props.name}</FieldLabel>
            </div>
             {props.fields.map(item => {
                return <RenderFormField key={item.field} props={item} data={data} setData={setData} handleChangeData={handleChangeData} />
            })}
        </div>
    )
}