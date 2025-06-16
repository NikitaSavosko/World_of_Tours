import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import config from "@/lib/config";
import { ImageKitProvider } from "@imagekit/next";

export const revalidate = 60

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
            <main >
                <Header />
                <div className="w-full flex min-h-screen">
                    <div className="container-wrapper grid grid-cols-1 md:grid-cols-18">
                        <div className="hidden md:block md:col-span-4 md:border-r border-dashed">
                            <Sidebar />
                        </div>
                        <div className="md:col-span-14 grid-cols-subgrid">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </ImageKitProvider>
    );
}
