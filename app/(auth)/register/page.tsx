'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RenderFormFields from "@/components/formFields/RenderFormFields";
import { Spinner } from "@/components/Spinner";

const MONTHS_ARRAY = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const REGISTRATION_PAGE_FORM_SCHEMA = [
    // {
    //     name: 'Name',
    //     field: 'name',
    //     type: "input",
    // },
    {
        name: 'Username',
        field: 'username',
        type: "input",
    },
    // {
    //     name: 'Email',
    //     field: 'email',
    //     type: "input",
    // },
    // {
    //     name: 'Password',
    //     field: "password",
    //     type: "password",
    // },
    // {
    //     name: 'Confirm Password',
    //     field: "confirm_password",
    //     type: "password",
    // },
    // {
    //     name: 'Preferred Timezone',
    //     field: "timezone",
    //     type: "select",
    //     placeholder: "Select timezone",
    //     options: [
    //         {
    //             label: 'America/Chicago',
    //             value: 'America/Chicago'
    //         },
    //         {
    //             label: 'America/New York',
    //             value: 'America/New York'
    //         },
    //         {
    //             label: 'America/Denver',
    //             value: 'America/Denver'
    //         },
    //         {
    //             label: 'America/Los Angeles',
    //             value: 'America/Los Angeles'
    //         }
    //     ]
    // },
    // {
    //     name: "🎉 Birthday",
    //     field: "birthday",
    //     type: 'birthday'
    // },
]

export default function RegisterPage() {

    const router = useRouter();


    const [progress, setProgress] = useState<'creating' | 'submitting' | 'error' | 'done'>('creating');

    const [data, setData] = useState<any>({})
    const [metadata, setMetadata] = useState<any>({});

    const handleSubmit = () => {

        setProgress('submitting')
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(res => {
                router.push('/login')
                return;
            })
            .catch(err => {
                console.log(err)
                alert("Something went wrong.")
            })

        return;
    }

    const handleChangeData = (e: any) => {

        setData((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }



    return (
        <div className="flex flex-col min-h-[calc(100vh-8rem)] max-w-[420px] w-full items-center justify-center px-4">
            <div className="flex w-full w-full  flex-col gap-8 rounded-lg border bg-card p-8 shadow-sm">
                {progress === "creating" ? (
                    <>
                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Create an account
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                Create your account to get started.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <RenderFormFields
                                schema={REGISTRATION_PAGE_FORM_SCHEMA as any}
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
                                Register
                            </Button>


                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <Spinner />

                        <p className="text-sm text-muted-foreground">
                            Creating your account...
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 w-full py-4">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        // TODO: GitHub OAuth
                    }}
                >
                    <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill={ "#ffffff"} />
                    </svg>
                    Continue with GitHub
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        // TODO: Google OAuth
                    }}
                >
                    <svg
                        className="mr-2 size-4"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            fill="#4285F4"
                            d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.32h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.43Z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.09.31-1.58V7.89H3.3A9.5 9.5 0 0 0 2.25 12c0 1.53.37 2.98 1.05 4.11l3.24-2.53Z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 6.39c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.46 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
                        />
                    </svg>
                    Continue with Google
                </Button>

                <Button
                    onClick={() => router.push("/login")}
                    variant="link"
                    className="w-full"
                >
                    Already have an account? Login
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