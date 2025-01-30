import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Instant Build",
  description: "Build web apps in minutes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
        <Provider>{children}
          <Toaster/>
        </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
