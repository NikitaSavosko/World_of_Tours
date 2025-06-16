import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { getAllUser } from '@/actions/user-actions'

const Profile = async () => {

    const user = await getAllUser()

    return (
        <Link href={`/user/${user?.id}`} className='w-fit h-fit'>
            <Avatar className='outline-1 outline-foreground/10 hover:bg-accent'>
                <AvatarImage loading='lazy' src={user?.image ?? "/user.png"} className='object-cover aspect-square size-full' />
            </Avatar>
        </Link>
    )
}

export default Profile