'use client'
import React from 'react'
import { Image } from '@imagekit/next';
import { GetAllTourPosts } from '@/actions/tour-post-action';
import TourLike from './TourLike';
import { ru } from 'date-fns/locale/ru';
import { setDefaultOptions, format } from 'date-fns';
import { Session } from 'next-auth';
setDefaultOptions({ locale: ru })

type Tours = Awaited<ReturnType<typeof GetAllTourPosts>>
type Tour = Tours[number];

function TourCard({ dbUserId, tour, firm, session }: { dbUserId: string | null; tour: Tour; firm?: boolean; session: Session | null }) {


    return (
        <div className="border flex rounded-2xl dark:md:bg-accent/30 md:bg-accent/50 overflow-hidden w-full max-w-2xl max-md:flex-col max-md:border-0 max-md:rounded-none max-md:border-b max-md:border-dashed">
            <div>
                <Image src={tour.photo} alt={'castle'} loading='lazy' width={300} height={300} className='object-cover md:aspect-square size-full max-lg:size-full' />
            </div>
            <div className='flex flex-col w-full justify-between py-3 px-8 max-md:px-4 max-md:gap-4'>
                <div className='flex flex-col gap-2'>
                    <a href={`/tour/${tour.id}`} className='text-2xl font-bold underline underline-offset-4'>{tour.title}</a>
                    <p className='text-sm'>{tour.content}</p>
                </div>

                <div className='flex items-center justify-center gap-4'>
                    <p>{format(tour.createdAt, "PPP")}</p>
                    <p>-</p>
                    <p>{format(tour.endDate, "PPP")}</p>
                </div>

                <div className='w-full flex justify-between items-center'>

                    {!firm && (
                        <div className='flex items-center gap-2'>
                            <a href={`/tour-firm/${tour.tourFirm.id}`} className='text-sm underline underline-offset-2'>{tour.tourFirm.name}</a>
                        </div>
                    )}

                    <TourLike dbUserId={dbUserId} tour={tour} session={session} />
                </div>
            </div>
        </div>
    )
}

export default TourCard
