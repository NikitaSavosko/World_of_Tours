import React from 'react'
import { Button } from './ui/button'
import { MessageCircleIcon } from 'lucide-react'
import Link from 'next/link'

interface Props {
    id: string;
    count: number;
}

const Comment = ({ id, count }: Props) => {
    return (
        <Link href={`/posts/${id}`}>
            <div className='flex flex-row items-center group'>
                <Button variant={'ghost'} size={'icon'} className={'text-muted-foreground hover:bg-transparent dark:hover:bg-transparent rounded-full hover:text-primary group-hover:text-primary text-sm gap-2 cursor-pointer'}>
                    <MessageCircleIcon />
                </Button>
                <span className='text-muted-foreground text-sm font-light'>{count} комментариев</span>
            </div>
        </Link>
    )
}

export default Comment