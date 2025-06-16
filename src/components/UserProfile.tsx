import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'

interface Props {
    id: string | null;
    image?: string | null;
}

const UserProfile = ({ id, image }: Props) => {
    return (
        <Link href={`/user/${id}`} className='w-fit h-fit'>
            <Avatar>
                <AvatarImage loading='lazy' src={image ?? "/user.png"} className='object-cover aspect-square size-full' />
            </Avatar>
        </Link>
    )
}

export default UserProfile