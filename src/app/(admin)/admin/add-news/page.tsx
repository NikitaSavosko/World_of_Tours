import React from 'react';
import AdmNews from '@/components/AdminComponents/AdmNews';
import { getAllNews } from '@/actions/news-action';
import Container from '@/components/Container';
import AdmDeleteNews from '@/components/AdminComponents/AdmDeleteNews';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';

const Page = async () => {

    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        redirect("/sign-in")
    }

    const news = await getAllNews()

    return (
        <div className={'w-full flex flex-col'}>
            <h1 className='text-2xl font-bold text-center mt-4'>Добавить новость</h1>
            <AdmNews />
            <Container>
                <h1 className='text-2xl font-bold text-center mb-4'>Таблица данных новостей</h1>
                <div className='flex flex-col border border-b-0'>
                    {
                        news?.map(item => (
                            <div key={item.id} className='flex items-center px-4 py-2 border-b justify-between'>
                                <p>{item.title}</p>
                                <AdmDeleteNews id={item.id} />
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}

export default Page