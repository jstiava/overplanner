'use client'

import { useState } from "react";


export default function useDataStoreState<T>(initialState : T) {



    const [data, setData] = useState<T | null>(initialState);
    const [metadata, setMetadata] = useState<any>({ });

    const handleChangeMetadata = (e: any) => {
        setMetadata((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleMultiChangeData = (newValues: Partial<T>) => {
        setData((prev: any) => ({
            ...prev,
            ...newValues
        }))
    }

    const handleMultiChangeMetadata = (newValues: Partial<T>) => {
        setMetadata((prev: any) => ({
            ...prev,
            ...newValues
        }))
    }

    const handleChangeData = (e: any) => {
        setData((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return { data, metadata, setData, setMetadata, handleChangeData, handleChangeMetadata, handleMultiChangeMetadata, handleMultiChangeData }
}