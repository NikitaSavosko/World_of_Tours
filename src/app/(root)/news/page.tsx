import { getNews } from '@/actions/news-action';
import { format, setDefaultOptions } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import Link from 'next/link';
import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';

setDefaultOptions({ locale: ru })

const page = async () => {

    const session = await auth()
    if (!session) redirect("/sign-in");

    const news = await getNews()

    return (
        <div className={'w-full px-4 md:container-indent py-4'}>
            <div className={'flex flex-col gap-4'}>
                {
                    news.result?.map(item => (
                        <div key={item.id} className='flex flex-col bg-accent/50 p-4 gap-2 rounded-lg border'>
                            <div>
                                <h1 className='text-2xl font-bold'>{item.title}</h1>
                                <p className='whitespace-pre-wrap'>{item.content}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <Link href={`/tour-firm/${item.tourFirmId}`} className='text-sm underline text-foreground/40 w-fit'>{item.tourFirm.name}</Link>
                                <p>{format(item.createdAt, "PPP")}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page