import { FloatingDock } from "@/components/ui/floating-dock";
import { Header } from "@/components/ui/header";
import { TabataTimer } from "@/components/ui/timer";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full min-h-screen p-6 font-[family-name:var(--font-sans)] relative">
      <Header />

      <main className="w-full h-[calc(100vh-80px)] flex justify-center items-center relative">
        <TabataTimer />
      </main>

      <footer className="relative">
        <FloatingDock
          items={[
            {
              title: "GitHub",
              icon: (
                <GitHubLogoIcon className="h-full w-full text-text-header/50 dark:text-text-header" />
              ),
              href: "#",
            },
            {
              title: "X (Twitter)",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="fill-text-header/50 dark:fill-text-header"
                >
                  <path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"></path>
                </svg>
              ),
              href: "https://x.com/danarocha_",
            },
            {
              title: "Say hi 👋!",
              icon: (
                <Mail className="h-full w-full text-text-header/50 dark:text-text-header" />
              ),
              href: "mailto:hello@danarocha.com",
            },
          ]}
        />
      </footer>
    </div>
  );
}
