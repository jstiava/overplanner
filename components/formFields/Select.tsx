'use client'

import { useRouter } from "next/navigation";
import { Field, FieldLabel } from "@/components/ui/field";
import * as Select from "@/components/ui/select";
import { BaseField, FormFieldProps } from "./RenderFormFields";
import { Dispatch } from "react";

export type SelectField = BaseField & {
    type: "select";
    placeholder: string;
    options: {
        label: string;
        value: string;
    }[];
};


export default function SelectFormField({props, data, setData, handleChangeData} : FormFieldProps<SelectField>) {

    const router = useRouter();

    return (
        <Field key={props.field}>
            <FieldLabel>{props.name}</FieldLabel>
            <Select.Select
                name={props.name}
                value={data[props.field]}
                onValueChange={(value) => {
                    // onChange({
                    //     type: value
                    // })
                    // onSettingChange({
                    //     isEventTypeChanged: true
                    // })

                    handleChangeData({
                        target: {
                            name: props.field,
                            value
                        }
                    })
                    
                }}
            >
                <Select.SelectTrigger className="w-full">
                    <Select.SelectValue placeholder={props.placeholder} />
                </Select.SelectTrigger>
                <Select.SelectContent>
                    <Select.SelectGroup>
                        {props.options?.map(item => (
                            <Select.SelectItem
                                key={item.value}
                                value={item.value}
                            >
                                <span>{item.label}</span>
                            </Select.SelectItem>
                        ))}
                    </Select.SelectGroup>
                </Select.SelectContent>
            </Select.Select>
        </Field>
    )

}