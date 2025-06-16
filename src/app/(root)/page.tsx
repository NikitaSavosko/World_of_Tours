import TourCard from "@/components/TourCard";
import { GetAllTourPosts } from "@/actions/tour-post-action";
import { auth } from "../../../auth";
import { getUserId } from "@/actions/user-actions";

export default async function Home() {

  const tour = await GetAllTourPosts();
  const userId = await getUserId();
  const session = await auth()

  return (
    <div className="flex flex-col gap-6 max-lg:gap-4 items-center container-indent">
      {
        tour.map((item) => (
          <TourCard key={item.id} dbUserId={userId} tour={item} session={session} />
        ))
      }
    </div>
  );
}
