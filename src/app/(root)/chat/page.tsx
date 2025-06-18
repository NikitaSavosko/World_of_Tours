import { getUserChats } from '@/actions/message-action'
import React from 'react'
import { auth } from '../../../../auth'
import { format } from 'date-fns'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const page = async () => {

    const session = await auth()
    if (!session) redirect("/sign-in");
    const messages = await getUserChats(session?.user.id as string)

    return (
        <div className='flex flex-col container-indent'>
            {
                messages.map((item, index) => (
                    <Link key={index} href={`/chat/${item.user.id}`} className='w-full'>
                        <div className='hover:bg-accent/70 transition-colors rounded-md px-4 py-2 w-full flex items-end justify-between'>
                            <div className='flex items-center gap-2'>
                                <Avatar>
                                    <AvatarImage loading='lazy' src={item.user.image ?? "/user.png"} className='object-cover aspect-square size-full' />
                                </Avatar>
                                <div className='flex flex-col'>
                                    <p>{item.user.name}</p>
                                    <p className='text-sm text-foreground/50'>{item.lastMessage}</p>
                                </div>
                            </div>
                            <p className='text-sm text-foreground/50'>{format(new Date(item.lastMessageTime), "HH:mm")}</p>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default page