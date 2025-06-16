import { getChatMessages } from '@/actions/message-action';
import { getUser, getUserId } from '@/actions/user-actions';
import ChatInput from '@/components/ChatInput';
import DeleteMessage from '@/components/DeleteMessage';
import UserProfile from '@/components/UserProfile';
import { format } from 'date-fns';
import React from 'react'
import { prisma } from '../../../../../prisma/prisma';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
    const userIds = await prisma.user.findMany({
        select: {
            id: true,
        }
    })

    return userIds.map((userId) => ({
        id: userId.id.toString()
    }))
}

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {

    const session = await auth()
    if (!session) redirect("/sign-in");
    const { id } = params;
    const userId = await getUserId()
    const messages = await getChatMessages(userId as string, id)
    const user = await getUser(id)

    return (
        <div>
            <div className='flex items-center sticky z-50 top-[61px] bg-background w-full py-4 px-4 gap-4 border-b'>
                <UserProfile id={id} />
                <p>{user?.name}</p>
            </div>
            <div className='flex flex-col gap-1 px-4 py-4 min-h-screen'>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.authorId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className='flex items-end'>
                            <div
                                className={`max-w-[450px] md:max-w-[800px] px-3 py-1 ${message.authorId === userId ? 'bg-primary text-white rounded-xl rounded-br-none' : 'bg-foreground/10 rounded-xl rounded-bl-none'}`}
                            >
                                <div className='w-full flex gap-2 items-end'>
                                    <p className='whitespace-pre-wrap'>{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {format(new Date(message.createdAt), "HH:mm")}
                                    </p>
                                </div>
                            </div>
                            {
                                userId == message.authorId && (
                                    <DeleteMessage messageId={message.id} userId={message.authorId} />
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
            <ChatInput senderId={userId as string} getterId={id} />
        </div>
    )
}