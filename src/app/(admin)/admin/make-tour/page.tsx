import AdmMakeTour from '@/components/AdminComponents/AdmMakeTour'
import { auth } from '../../../../../auth'
import { redirect } from 'next/navigation'

const page = async () => {

    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        redirect("/sign-in")
    }

    return (
        <AdmMakeTour />
    )
}

export default page