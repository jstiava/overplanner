'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import RenderFormFields from "@/components/formFields/RenderFormFields";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";

const LOGIN_PAGE_FORM_SCHEMA = [
    {
        label: "Username",
        name: 'username',
        field: 'username',
        type: "input",
        props: {
            autoComplete: "username",
            name: "username"
        }
    },
    {
        label: "Password",
        name: 'password',
        field: "password",
        type: "password",
    },
]

export default function LoginPage() {

    const router = useRouter();
    const [progress, setProgress] = useState<'creating' | 'submitting' | 'error' | 'done'>('creating');

    const [data, setData] = useState<any>({})
    const [metadata, setMetadata] = useState<any>({});
    const handleChangeData = (e: any) => {

        setData((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = () => {

        setProgress('submitting')
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(error.message ?? `Request failed (${res.status})`);
                }
                // router.push('/login')
                toast.success("Login successful!")
                router.push(`/v2/me`)
                return;
            })
            .catch(err => {
                console.log({
                    success: false,
                    err
                })
                toast.error("Failed to login")
                setProgress('error')
                alert("Something went wrong.")
            })

        return;
    }


    return (
        <div className="flex flex-col min-h-[calc(100vh-8rem)] w-full items-center justify-center px-4">
            <div className="flex w-full max-w-[420px] flex-col gap-8 rounded-lg border bg-card p-8 shadow-sm">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Login
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue.
                    </p>
                </div>

                {progress === "submitting" ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <Spinner />
                        <p className="text-sm text-muted-foreground">
                            Validating username and password...
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4">
                            <RenderFormFields
                                schema={LOGIN_PAGE_FORM_SCHEMA}
                                data={data}
                                setData={setData}
                                handleChangeData={handleChangeData}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => handleSubmit()}
                                className="w-full h-10"
                            >
                                Login
                            </Button>

                          
                        </div>
                    </>
                )}
            </div>
              <div className="flex flex-col gap-2 w-full py-4">
                <Button
                                onClick={() => router.push("/register")}
                                variant="link"
                                className="w-full"
                            >
                                No account? Create one for free.
                            </Button>
              </div>
        </div>
    );
}


function filterByDay<T>(data: T[], dayIndex: number): T[] {
    const start = dayIndex * 24;
    const end = start + 24;
    return data.slice(start, end);
}

function getDayFromObject(
    data: Record<string, number>,
    dayIndex: number
) {
    const start = dayIndex * 24;
    const end = start + 23;

    return Object.entries(data)
        .filter(([k]) => {
            const i = Number(k);
            return i >= start && i <= end;
        })
        .map(([k, v]) => ({ x: Number(k), y: v }));
}