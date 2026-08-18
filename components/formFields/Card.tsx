'use client'

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import RenderFormFields, { BaseField, FormField, FormFieldProps, RenderFormField } from "./RenderFormFields";
import ComboboxEditor from "@/components/editor/ComboboxEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type CardField = BaseField & {
    type: "card";
    title: string;
    children: FormField[];
    description: string;
    className?: string;
};


export function CardFormField({ props, data, setData, handleChangeData }: FormFieldProps<CardField>) {

    return (
        <Card
            key={props.field}
            className={props.className ?? ""}
        >
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>
                    {props.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <RenderFormFields
                    {...{
                        schema: props.children,
                        data,
                        setData,
                        handleChangeData
                    }}
                />
            </CardContent>
        </Card>
    )
}