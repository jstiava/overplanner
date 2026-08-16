'use client'

import { Dispatch, JSX } from "react";
import SelectFormField, { SelectField } from "./Select";
import DateFormField from "./Date";
import PasswordFormField from "./Password";
import RowFormField from "./Row";
import TextAreaFormField from "./Textarea";
import ColumnFormField from "./Column";
import CommandFormField from "./Command";
import { ComboboxInputFormField, HorizontalInputFormField, InputField, InputFormField } from "./Input";

export type FormFieldProps<A = BaseField> = {
    props: A,
    data: any,
    setData: Dispatch<any>,
    handleChangeData: any,
}

export type BaseField = {
    label: string;
    name: string;
    field: string;
    type: string;
    props?: any;
};


type FormField = BaseField | SelectField | InputField;


const FORM_FIELDS: Record<string, any> = {
    'date': DateFormField,
    'password': PasswordFormField,
    'row': RowFormField,
    'select': SelectFormField,
    'input': InputFormField,
    'combobox_input': ComboboxInputFormField,
    'horizontal_input': HorizontalInputFormField,
    'textarea': TextAreaFormField,
    'column': ColumnFormField,
    'command': CommandFormField
}

export default function RenderFormFields({
    schema,
    data,
    setData,
    handleChangeData
}: {
    schema: FormField[],
    data: any,
    setData: Dispatch<any>,
    handleChangeData: any
}) {


    return (
        <>
            {schema.map(item => {
                return <RenderFormField key={item.field} props={item} data={data} setData={setData} handleChangeData={handleChangeData} />
            })}
        </>
    )
}


export function RenderFormField({ props, data, setData, handleChangeData }: FormFieldProps) {

    const Component = FORM_FIELDS[props.type as string]

    if (!Component) {
        return <div>Unknown field type: {props.type}</div>;
    }

    return (
        <Component props={props} data={data} setData={setData} handleChangeData={handleChangeData} />
    )
}