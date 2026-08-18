'use client'

import { MenuIcon, MoonIcon, XIcon } from "lucide-react"
import { useContext, useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import * as Dialog from "@/components/ui/dialog"


export default function MarketingHeader() {

    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isDark = true;

    return (
        <div className="flex w-full justify-between p-8">
            <div className="flex">
                <Button variant={'link'} className="flex gap-4 font-bold text-xl tracking-tight" onClick={e => {
                    router.push('/')
                }} >
                    <Image alt="" src={"/logo_example_aug14.png"} width={36} height={36} />
                    <h1 >Overplanner</h1>
                </Button>
            </div>

            {/* DESKTOP MENU */}
            <div className={cn(
                "gap-2 hidden",
                "md:flex"
            )}>
                <div className="flex gap-1">
                    {HEADER_MENU_ITEMS.map((item, i) => {
                        if (item.type == 'link') {
                            return (
                                <Button key={item.slug} variant={'link'} onClick={e => {
                                    router.push(item.slug)
                                }}>{item.label}</Button>
                            )
                        }
                        return null
                    })}
                    <div className="flex items-center px-4 gap-2">
                        <Button size={'lg'} onClick={e => {
                            router.push('/register');
                            setIsMenuOpen(false)
                        }}>Register</Button>
                        <Button key={'login'} variant={'link'} onClick={e => {
                            router.push('/login')
                        }}>Login</Button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div className={cn(
                "flex gap-2",
                "md:hidden"
            )}>
                <Dialog.Dialog open={isMenuOpen} onOpenChange={(open) => {
                    setIsMenuOpen(open)
                }}>
                    <Dialog.DialogTrigger>
                        <Button size={'lg'} variant={'default'}>
                            <MenuIcon />
                        </Button>
                    </Dialog.DialogTrigger>
                    <Dialog.DialogContent className={'max-w-none w-screen h-screen rounded-none border-0 p-0 pt-16'}>
                        <div className="flex flex-col">
                            {HEADER_MENU_ITEMS.map(item => (
                                <Button key={item.slug} variant={'link'} className={'flex justify-start w-full p-4 px-8 h-fit rounded-none text-2xl font-bold tracking-tight '} onClick={e => {
                                    router.push(item.slug);
                                    setIsMenuOpen(false)
                                }}>{item.label}</Button>
                            ))}
                        </div>
                        <div className="flex flex-col fixed bottom-2 left-0 w-full p-2 gap-2">
                            <Button size={'lg'} className={'w-full h-10'} onClick={e => {
                                router.push('/register');
                                setIsMenuOpen(false)
                            }}>Register</Button>
                            <Button variant={'link'} size={'lg'} className={'w-full h-10'} onClick={e => {
                                router.push('/login');
                                setIsMenuOpen(false)
                            }}>Login</Button>
                        </div>
                    </Dialog.DialogContent>
                </Dialog.Dialog>

            </div>
        </div>
    )
}


const HEADER_MENU_ITEMS = [
    {
        label: "Home",
        slug: '/',
        type: 'link'
    },
    {
        label: "Problem",
        slug: "/problem",
        type: 'link'
    },
    {
        label: "Features",
        slug: "/features",
        type: 'link'
    },
    {
        label: "Pricing",
        slug: "/pricing",
        type: 'link'
    }
]