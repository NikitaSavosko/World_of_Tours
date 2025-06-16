import { getAllTourFirm } from "@/actions/tour-firm-action";
import AdmDeleteTourFirm from "@/components/AdminComponents/AdmDeleteTourFirm";
import AdmTourFirm from "@/components/AdminComponents/AdmTourFirm";
import Container from "@/components/Container";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "../../../../../auth";

const Page = async () => {

    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        redirect("/sign-in")
    }

    const tourFirm = await getAllTourFirm()

    return (
        <div className='w-full'>
            <AdmTourFirm />
            <Container>
                <h1 className='text-2xl font-bold mb-4 text-center'>Таблица данных турфирм</h1>
                <div className="flex flex-col border border-b-0">
                    {
                        tourFirm?.map(item => (
                            <div key={item.id} className="flex items-center justify-between border-b px-4 py-2">
                                <p>{item.name}</p>
                                <AdmDeleteTourFirm tourFirmId={item.id} />
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}

export default Page