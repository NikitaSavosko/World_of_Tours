import { Bookmark, Contact, MapPinned, MessageSquare, Newspaper, UserRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { getUserId } from '@/actions/user-actions';

async function Sidebar() {

    const userId = await getUserId()

    const items = [
        {
            title: "Туры",
            url: "/",
            icon: MapPinned,
        },
        {
            title: "Посты",
            url: "/posts",
            icon: MessageSquare,
        },
        {
            title: "Новости",
            url: "/news",
            icon: Newspaper,
        },
        {
            title: "Друзья",
            url: "/friends",
            icon: Contact,
        },
        {
            title: "Сохранённое",
            url: `/saved/${userId}`,
            icon: Bookmark,
        },

    ];

    return (
        <div className='sticky top-20'>
            <div className='flex flex-col gap-1'>
                {items.map((item, index) => (
                    <Link key={index} href={item.url}>
                        <Button variant={'ghost'} className='items-center justify-start cursor-pointer w-full border-primary transition-[border] rounded-none duration-75 focus-visible:border-b-4'>
                            <item.icon />
                            <p>{item.title}</p>
                        </Button>
                    </Link>
                ))}
            </div>
        </div >
    )
}

export default Sidebar
