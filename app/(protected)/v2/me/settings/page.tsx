"use client";

import { useContext, useState } from "react";
import {
  Save,
  ArrowLeft,
  UserIcon,
  AtSignIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResizablePanel } from "@/components/ui/resizable";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { useRouter } from "next/navigation";
import RenderFormFields from "@/components/formFields/RenderFormFields";
import { TimezoneList } from "@/components/TimezoneList";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";

const PROFILE_SETTINGS_FORM_ITEMS = [
  {
    title: 'Profile',
    type: 'card',
    description: 'This information can be displayed on your profile.',
    children: [
      {
        label: "Name",
        name: 'name',
        field: 'name',
        type: "input",
        Icon: UserIcon,
        props: {
          autoComplete: "name",
          name: "name"
        }
      },
      {
        label: "Username",
        name: 'username',
        field: 'username',
        type: "input",
        Icon: AtSignIcon,
        props: {
          autoComplete: "username",
          name: "username",
          disabled: true
        }
      },
      {
        label: "Description",
        name: 'description',
        field: 'description',
        type: "textarea",
        hideLabel: false,
        placeholder: 'Tell people a little about yourself',
        rows: 4,
        maxLength: 500,
        props: {
          autoComplete: "description",
          name: "description",
        }
      },
      {
        type: 'custom',
        Component: TimezoneList,
        name: 'preferred_timezones'
      }
    ]
  },
]


export default function ProfileSettingsPage() {

  const router = useRouter();
  const [progress, setProgress] = useState<'creating' | 'submitting' | 'error' | 'done'>('creating');


  const { user } = useContext(OverplannerSessionContext)

  const [data, setData] = useState<any>(user)
  const [metadata, setMetadata] = useState<any>({});
  const handleChangeData = (e: any) => {

    setData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = () => {
    setProgress('submitting')
    fetch("/api/me", {
      method: "PATCH",
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
        toast.success("Profile successfully updated!")
        return;
      })
      .catch(err => {
        console.log({
          success: false,
          err
        })
        toast.error("Failed to login")
        setProgress('error') 
      })

    return;
  };

  if (!user) {
    return <p>No user found.</p>
  }

  return (
    <ResizablePanel defaultSize={75}>

      <main className="h-full w-full bg-background">
        <div className="mx-auto max-w-3xl px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex py-4 px-0">
              <Button variant={'ghost'} onClick={e => {
                router.back()
              }}>
                <ArrowLeft /> Back to calendar
              </Button>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Profile settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your profile information and account details.
            </p>
          </div>

          <div className="space-y-6">

            {/* <p className="debug">{JSON.stringify(data, null, 2)}</p> */}

            <RenderFormFields
              data={data}
              handleChangeData={handleChangeData}
              schema={PROFILE_SETTINGS_FORM_ITEMS as any}
              setData={setData}

            />



            {/* Save */}
            <div className="flex justify-end gap-3">
              <Button variant="outline">
                Cancel
              </Button>

              <Button onClick={handleSave}>
                {progress === "submitting" ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (

                  <Save className="mr-2 h-4 w-4" />
                )}
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ResizablePanel>
  );
}