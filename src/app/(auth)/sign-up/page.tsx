import RegisterForm from "@/components/RegisterForm"
import { auth, signIn } from "../../../../auth"
import { redirect } from "next/navigation"

const Page = async () => {

    const session = await auth()
    if (session) redirect("/")

    return (
        <div className="flex flex-col items-center gap-10">
            <RegisterForm />
        </div>
    )
}

export default Page