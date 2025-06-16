import { getTourFirmById } from '@/actions/tour-firm-action'
import { getUserId } from '@/actions/user-actions'
import TourCard from '@/components/TourCard'
import React from 'react'
import { auth } from '../../../../../auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = await (params)
    const session = await auth()
    if (!session) redirect("/sign-in");

    const tourFirm = await getTourFirmById(id)
    const user = await getUserId()

    return (
        <div className='w-full flex flex-col'>
            <div className='container-indent max-md:px-4 border-b border-dashed'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-3xl font-bold'>{tourFirm?.name}</h1>
                    <p className='whitespace-pre-wrap md:text-sm text-foreground/70'>{tourFirm?.description}</p>
                </div>
            </div>
            <div className='container-indent pt-4 max-md:px-4'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-2xl font-bold'>Туры</h1>
                    <div className='flex flex-col gap-2 items-center'>
                        {
                            tourFirm?.tourPosts.map(item => (
                                <TourCard key={item.id} firm dbUserId={user} tour={item} session={session} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page