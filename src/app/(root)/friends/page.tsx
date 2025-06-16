import { getFollowed, getUserId } from '@/actions/user-actions';
import CommentButton from '@/components/CommentButton';
import PostLike from '@/components/PostLike';
import UserProfile from '@/components/UserProfile';
import { Image } from '@imagekit/next';
import React from 'react';
import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';

const page = async () => {

  const session = await auth()
  if (!session) redirect("/sign-in");

  const user = await getUserId()
  const friends = await getFollowed(user as string)

  return (
    <div className='container-indent max-md:px-4'>
      <div className='flex flex-col gap-6 w-full'>
        <div className='flex flex-col gap-4 items-center w-full'>
          {
            friends?.map((item, index) => (
              item.following.length > 0 ? (
                item.following.map(friend => (
                  friend.following.posts.map(post => (
                    <div key={post.id} className='flex flex-col gap-2 border-b border-dashed w-full max-w-xl rounded-md md:border md:border-solid dark:md:bg-accent/30'>
                      <div className='flex flex-row items-center gap-2 px-4 pt-3'>
                        <UserProfile id={post.authorId} image={post.author.image} />
                        <p className='text-sm text-foreground/50'>{post.author.name}</p>
                      </div>
                      {
                        post.image && (
                          <div>
                            <Image priority={true} alt={'image'} src={`${post.image}`} width={500} height={500} className='object-cover aspect-square size-full' />
                          </div>
                        )
                      }
                      <div className='flex flex-col p-4 gap-2'>
                        <p className='whitespace-pre-wrap'>{post.content}</p>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex flex-row items-center gap-4'>
                            <PostLike userId={user} post={post} />
                            <CommentButton id={post.id} count={post._count.comments} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ))
              ) : (
                <div key={index}>Здесь пока ничего нет, подпишитесь на друзей, чтобы увидеть их посты</div>
              )
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default page