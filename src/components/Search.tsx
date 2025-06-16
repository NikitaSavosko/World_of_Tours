"use client"
import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { LoaderCircleIcon, SearchIcon } from 'lucide-react'
import { User } from '@/generated/prisma'
import { useDebounce } from "@uidotdev/usehooks";
import { getUserByName } from '@/actions/user-actions'
import { Session } from 'next-auth'

const Search = ({ session }: { session: Session | null }) => {

    const [isSearching, setIsSearching] = React.useState(false)
    const [searchResult, setSearchResult] = React.useState('')
    const [user, setUser] = React.useState<User[]>([])
    const debounced = useDebounce(searchResult, 700)

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
    }, [debounced])



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} className='text-sm font-light min-w-[200px]'>
                    <p className='text-start w-full'>Поиск</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader aria-description='search'>
                    <div className='flex flex-row items-center px-4 border-b'>
                        <SearchIcon size={20} className='text-foreground/40' strokeWidth={1} />
                        <Input
                            className='border-none shadow-none max-w-[440px] dark:bg-background'
                            placeholder='Найти пользователя'
                            onChange={(e) => setSearchResult(e.target.value)}
                            value={searchResult} />
                    </div>
                    <DialogTitle className='p-0'>
                    </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col items-center w-full gap-3 px-4 pb-4 max-h-[200px] min-h-[200px] overflow-y-auto'>
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
            </DialogContent>
        </Dialog>
    )
}

export default Search