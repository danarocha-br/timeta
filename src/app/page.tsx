import { Header } from '@/components/ui/header';
import { TabataTimer } from "@/components/ui/timer";

export default function Home() {
  return (
    <div className="w-full min-h-screen p-6 font-[family-name:var(--font-sans)] relative">
      <Header />

      <main className="w-full h-[calc(100vh-80px)] flex justify-center items-center relative">
        <TabataTimer />
      </main>
    </div>
  );
}
