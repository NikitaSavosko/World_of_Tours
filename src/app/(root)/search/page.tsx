'use client'
import { getUserByName } from '@/actions/user-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/generated/prisma'
import { useDebounce } from '@uidotdev/usehooks'
import { LoaderCircleIcon, Search } from 'lucide-react'
import React, { useEffect } from 'react'

const page = () => {

    const [searchResult, setSearchResult] = React.useState('')
    const [user, setUser] = React.useState<User[]>([])
    const [isSearching, setIsSearching] = React.useState(false)
    const debounce = useDebounce(searchResult, 700)

    async function handleSearch() {
        try {
            setIsSearching(true)

            const result = await getUserByName(searchResult)
            setUser(result)

        } catch (error) {
            console.error("Поиск не прошёл успешно", error)

        } finally {
            setIsSearching(false)
        }
    }

    useEffect(() => {
        handleSearch()
    }, [debounce])

    return (
        <div className='px-4 py-4 md:container-indent'>
            <div className='flex flex-col gap-4 items-center w-full'>
                <div className='flex items-center border rounded-md px-4 w-full'>
                    <Search size={20} strokeWidth={1} className='text-foreground/40' />
                    <Input
                        placeholder='Поиск'
                        className='rounded-none border-none shadow-none dark:bg-background'
                        value={searchResult}
                        onChange={(e) => setSearchResult(e.target.value)} />
                </div>
                <div className='flex flex-col items-center w-full gap-3 px-4 pb-4'>
                    {
                        isSearching ? (
                            <LoaderCircleIcon className='animate-spin text-foreground/40 ' size={42} />
                        ) : (
                            user.length > 0 ? (
                                user.map(item => (
                                    <div key={item.id} className='w-full'>
                                        {
                                            item.role === "ADMIN" ? (
                                                <div className='hidden'></div>
                                            ) : (
                                                <Button
                                                    variant={'ghost'}
                                                    className='w-full flex justify-start'
                                                    onClick={() => window.location.href = `/user/${item.id}`}
                                                >
                                                    {item.name}
                                                </Button>
                                            )
                                        }
                                    </div>
                                ))
                            ) : (
                                <div>Ничего не найдено</div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default page