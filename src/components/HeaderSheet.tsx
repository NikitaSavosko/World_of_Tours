"use client"
import React from 'react'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import Link from 'next/link'
import { Button } from './ui/button'
import { ModeToggle } from './ModeToggle'
import SignOutButton from './SignOutButton'
import { useSession } from 'next-auth/react'
import { AlignJustify } from 'lucide-react'

const HeaderSheet = () => {

    const { data: session } = useSession()

    const [open, setOpen] = React.useState(false)

    const data = [
        {
            name: "Аккаунт",
            url: `/user/${session?.user.id}`
        },
        {
            name: "Туры",
            url: "/"
        },
        {
            name: "Посты",
            url: "/posts"
        },
        {
            name: "Новости",
            url: "/news"
        },
        {
            name: "Друзья",
            url: "/friends"
        },
        {
            name: "Чат",
            url: "/chat"
        },
        {
            name: "Сохранённое",
            url: `/saved/${session?.user.id}`
        },
        {
            name: "Поиск",
            url: "/search"
        }
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                    <AlignJustify />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <ModeToggle />
                    <SheetTitle></SheetTitle>
                </SheetHeader>
                <div className='w-full flex flex-col gap-2'>
                    {
                        data.map((item, index) => (
                            <Link key={index} href={item.url}>
                                <Button
                                    variant={'ghost'}
                                    className='w-full rounded-none'
                                    onClick={() => (
                                        setOpen(!open)
                                    )}
                                >{item.name}</Button>
                            </Link>
                        ))
                    }
                </div>
                <SheetFooter>
                    {session ? (
                        <SignOutButton />
                    ) : (
                        <Link href={'/sign-in'}>
                            <Button>Войти</Button>
                        </Link>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default HeaderSheet