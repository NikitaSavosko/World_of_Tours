import { getAllSaved } from '@/actions/tour-post-action';
import React from 'react'
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import { prisma } from '../../../../../prisma/prisma';

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

const page = async ({ params }: { params: { id: string } }) => {

    const { id } = await params;
    const session = await auth()
    if (!session) redirect("/sign-in");

    const saved = await getAllSaved(id)

    return (
        <div className='px-4 md:container-indent flex flex-col gap-6 py-4'>
            <div className='w-full grid grid-cols-3 gap-1 max-lg:grid-cols-2 max-md:flex max-md:flex-col max-md:items-center'>
                {
                    saved.length > 0 ? (
                        saved.map((item, index) => (
                            <div key={index} className='border flex flex-col rounded-2xl gap-4 bg-accent/50 overflow-hidden w-full py-4 px-4'>
                                <div className='flex items-end justify-between gap-2'>
                                    <a href={`/tour/${item.id}`} className='text-2xl font-bold underline underline-offset-4'>{item.title}</a>
                                </div>
                                <a href={`/tour-firm/${item.tourFirm.id}`} className='text-sm underline underline-offset-2'>{item.tourFirm.name}</a>
                            </div>
                        ))
                    ) : (
                        <div>Здесь пока ничего нет</div>
                    )
                }
            </div>
        </div>
    )
}

export default page