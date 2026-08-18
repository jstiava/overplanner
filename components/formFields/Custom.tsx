'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import RenderFormFields, { BaseField, FormField, FormFieldProps, RenderFormField } from "./RenderFormFields";
import ComboboxEditor from "@/components/editor/ComboboxEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JSX } from "react/jsx-runtime";

export type CustomField = BaseField & {
    type: "custom";
    value: any;
    name: string,
    // @ts-ignore
    Component: JSX.Element<any>;
};


export function CustomFormField({ props, data, setData, handleChangeData }: FormFieldProps<CustomField>) {

    const {Component, ...rest} = props;

    return (
        <Component {...{
            ...rest,
            data,
            setData,
            value: rest.name in data ? data[rest.name] : null,
            onChange: (newValue) => {
                handleChangeData({
                    target: {
                        name: props.name,
                        value: newValue
                    }
                })
            }
        }} />
    )
}