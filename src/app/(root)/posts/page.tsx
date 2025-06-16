import Post from '@/components/Post'
import React from 'react'
import { auth } from '../../../../auth'
import { redirect } from 'next/navigation'
import { getPosts } from '@/actions/post-action'
import { getUserId } from '@/actions/user-actions'
import CreatePost from '@/components/CreatePost'

const Posts = async () => {

    const session = await auth()
    if (!session) redirect("/sign-in")

    const posts = await getPosts()
    const user = await getUserId()

    return (
        <div className='flex flex-col w-full gap-4 items-center'>
            <div className='container-indent border-b border-dashed'>
                <CreatePost />
            </div>
            <div className='container-indent flex flex-col items-center gap-4'>
                {
                    posts.map(item => (
                        <Post key={item.id} post={item} userId={user} image={item.author.image} user id={item.authorId} name={item.author.name} />
                    ))
                }
            </div>
        </div>
    )
}

export default Posts