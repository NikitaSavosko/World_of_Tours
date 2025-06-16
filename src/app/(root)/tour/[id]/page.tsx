import Reviews from "@/components/Reviews";
import SaveButton from "@/components/SaveButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from '@imagekit/next';
import { getFilterTourPost } from "@/actions/tour-post-action";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";
import { getUserId } from "@/actions/user-actions";
import TourLike from "@/components/TourLike";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const session = await auth()
    if (!session) redirect("/sign-in")

    const { id } = await params;

    const tour = await getFilterTourPost(id);
    const userId = await getUserId()

    return (
        <div className="flex flex-col">
            {
                tour.map((item) => (
                    <div key={item.id} className="w-full border-b border-dashed">
                        <div className="flex max-lg:flex-col max-lg:gap-4 container-indent">
                            <Image src={item.photo} alt={item.title} width={500} loading="lazy" height={500} className="w-auto h-auto md:rounded-md object-cover max-lg:size-full" />
                            <div className="flex flex-col px-4 gap-4 lg:justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold">{item.title}</h1>
                                    <p>{item.content}</p>
                                </div>
                                <div className="flex flex-row items-center gap-4 max-md:justify-between">
                                    <TourLike dbUserId={userId} tour={item} session={session} />
                                    <SaveButton tour={item} userId={userId} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className="container-indent">
                <Tabs defaultValue="description">
                    <TabsList>
                        <TabsTrigger value={"description"}>Описание</TabsTrigger>
                        <TabsTrigger value={"reviews"}>Отзывы</TabsTrigger>
                    </TabsList>
                    <TabsContent value={"description"}>
                        {
                            tour.map((item, index) => (
                                <p key={index} className="text-wrap whitespace-pre-wrap">{item.description}</p>
                            ))
                        }
                    </TabsContent>
                    <TabsContent value={"reviews"}>
                        <div className='flex flex-col gap-4 items-start w-full'>
                            {
                                tour.map((item, index) => (
                                    <div key={index} className="flex flex-col w-full gap-2">
                                        <ReviewForm key={index} id={item.id} />
                                        {
                                            item.reviews.map(review => (
                                                <Reviews key={review.id} name={review.author.name} review={review.content} id={review.authorId} image={review.author.image} />
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}