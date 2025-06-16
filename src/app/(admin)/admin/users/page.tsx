import { getAllUsers } from '@/actions/user-actions'
import AdmDeleteUser from '@/components/AdminComponents/AdmDeleteUser'
import Container from '@/components/Container'
import { redirect } from 'next/navigation'
import React from 'react'
import { auth } from '../../../../../auth'

const page = async () => {

    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        redirect("/sign-in")
    }

    const users = await getAllUsers()

    return (
        <div className='w-full h-full'>
            <Container>
                <h1 className='text-2xl font-bold mb-4 text-center'>Таблица данных пользователей</h1>
                <div className='flex flex-col border border-b-0'>
                    {
                        users?.map(item => (
                            <div key={item.id} className='flex'>
                                {
                                    item.role === "ADMIN" ? (
                                        <span></span>
                                    ) : (
                                        <div className='flex items-center px-4 py-2 border-b justify-between w-full'>
                                            <p>{item.name}</p>
                                            <AdmDeleteUser id={item.id} />
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            </Container>
            <Container>
                <div className='min-h-screen'></div>
            </Container>
        </div>
    )
}

export default page