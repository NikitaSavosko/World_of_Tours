import LogInForm from '@/components/LogInForm';
import { auth, signIn } from '../../../../auth';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {

    const session = await auth()
    if (session) redirect("/")

    return (
        <div className='flex flex-col items-center gap-10'>
            <LogInForm />
        </div>
    )
}

export default Page