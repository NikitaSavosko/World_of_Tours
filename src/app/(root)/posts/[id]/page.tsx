import { getFilteredPosts } from '@/actions/post-action'
import { getUserId } from '@/actions/user-actions'
import AddComments from '@/components/AddComments'
import Comments from '@/components/Comments'
import PostLike from '@/components/PostLike'
import { Image } from '@imagekit/next'
import { MessageSquareIcon } from 'lucide-react'
import React from 'react'

export const dynamic = 'force-dynamic';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = await params
    const post = await getFilteredPosts(id)
    const user = await getUserId()

    return (
        <div className='w-full min-h-screen h-full flex flex-col'>
            <div className='container-indent border-b border-dashed '>
                {
                    post.map((item, index) => (
                        <div key={index} className='flex flex-col gap-2'>
                            {item.image && (
                                <div className='max-w-md w-full mx-auto'>
                                    <Image src={`${item.image}`} alt='image' width={500} height={500} loading='lazy' className='object-cover md:rounded-md aspect-square size-full' />
                                </div>
                            )}
                            <p className='whitespace-pre-wrap'>{item.content}</p>
                            <div className='flex flex-row gap-4 items-center'>
                                <PostLike userId={user} post={item} />
                                <div className='flex flex-row gap-2 items-center text-foreground/40 text-sm'>
                                    <MessageSquareIcon size={24} strokeWidth={1} />
                                    <span>{item._count.comments}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                post.map((item, index) => (
                    <div key={index} className='container-indent flex flex-col items-center py-4 gap-4'>
                        <h1 className='text-2xl font-bold'>Комментарии</h1>
                        <div className='flex flex-row items-end gap-2 w-full max-w-lg'>
                            <AddComments post={item} />

                        </div>
                        {
                            item.comments.map(comment => (
                                <Comments key={comment.id} userId={comment.authorId} name={comment.author.name} content={comment.content} />
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default page