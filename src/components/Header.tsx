import Link from 'next/link';
import React from 'react'
import { ModeToggle } from './ModeToggle';
import { MessagesSquare, Plus } from 'lucide-react';
import { Button } from './ui/button';
import Profile from './Profile';
import HeaderSheet from './HeaderSheet';
import Search from './Search';
import { auth } from "../../auth";
import { SessionProvider } from 'next-auth/react';

async function Header() {

    const session = await auth()

    return (
        <div className='w-full flex sticky top-0 backdrop-blur-3xl bg-background/80 border-b border-dashed z-50'>
            <div className='container-wrapper'>
                <div className='flex flex-row items-center justify-between py-3 px-6'>
                    <Link href='' className='flex flex-row items-center gap-2'>
                        <Plus size={22} className='animate-spin text-primary' />
                        <p className='text-xl font-bold'>World of travel</p>
                    </Link>
                    <div className='flex items-center gap-2 max-md:hidden'>
                        {
                            session?.user.role === 'ADMIN' && (
                                <div>
                                    <Link href='/admin' className='flex flex-row items-center gap-2'>
                                        <Button
                                            variant={'outline'}
                                            className='text-sm'
                                        >
                                            Перейти в админ-панель
                                        </Button>
                                    </Link>
                                </div>
                            )
                        }
                        <Search session={session} />
                        <Link href={'/chat'}>
                            <Button variant={'outline'} size={'icon'}>
                                <MessagesSquare />
                            </Button>
                        </Link>
                        <ModeToggle />
                        {session ? (
                            <Profile />
                        ) : (
                            <Link href={'/sign-in'}>
                                <Button>Войти</Button>
                            </Link>
                        )}
                    </div>
                    <div className='md:hidden flex items-center gap-2'>
                        <SessionProvider>
                            <HeaderSheet />
                        </SessionProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
