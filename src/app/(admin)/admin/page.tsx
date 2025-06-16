import { redirect } from 'next/navigation'
import React from 'react'
import { auth } from '../../../../auth'
import { GetAllTourPosts } from '@/actions/tour-post-action'
import { Heart } from 'lucide-react'
import AdmDeleteTour from '@/components/AdminComponents/AdmDeleteTour'

const page = async () => {

    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        redirect("/sign-in")
    }

    const tours = await GetAllTourPosts()

    return (
        <div className='w-full'>
            <div className='container-wrapper min-h-screen'>
                <div className='container-pad'>
                    <h1 className='text-2xl font-bold mb-4 text-center'>Таблица данных туров</h1>
                    <div className='flex flex-col border border-b-0'>
                        {
                            tours.map(item => (
                                <div key={item.id} className='px-4 py-2 grid grid-cols-7 border-b items-center'>
                                    <div className='col-span-2'>
                                        <p className='font-semibold'>{item.title}</p>
                                    </div>
                                    <div className='col-span-3'>
                                        <p className='text-sm text-foreground/50'>{item.tourFirm.name}</p>
                                    </div>
                                    <div className='flex items-center gap-4 justify-end col-span-2'>
                                        <div className='flex flex-row items-center gap-2 text-foreground/50'>
                                            <Heart strokeWidth={1} size={16} />
                                            <p>{item._count.likes}</p>
                                        </div>
                                        <AdmDeleteTour tourId={item.id} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page