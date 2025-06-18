import React from 'react'
import { ModeToggle } from '../ModeToggle'
import Link from 'next/link'
import AdmToMain from "@/components/AdminComponents/AdmToMain";

const AdmHeader = () => {

    const data = [
        {
            title: "Туры",
            url: "/admin"
        },
        {
            title: "Добавить тур",
            url: "/admin/make-tour"
        },
        {
            title: "Новости",
            url: "/admin/add-news"
        },
        {
            title: "Турфирма",
            url: "/admin/tour-firm"
        },
        {
            title: "Пользователи",
            url: "/admin/users"
        },
    ]

    return (
        <div className='w-full flex sticky top-0 backdrop-blur-3xl bg-background/80 border-b border-dashed z-50'>
            <div className='container-wrapper'>
                <div className='w-full px-6 flex flex-row py-2 items-center justify-between'>
                    <div className='flex flex-row items-center gap-6'>
                        <Link href={''}>
                            <h1 className='text-lg font-bold'>admin <span className='font-normal'>/</span> World of travel</h1>
                        </Link>
                        <div className='hidden md:flex items-center gap-6'>
                            {
                                data.map((item, index) => (
                                    <Link key={index} href={item.url}>
                                        <p className='text-sm'>
                                            {item.title}
                                        </p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <AdmToMain />
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdmHeader