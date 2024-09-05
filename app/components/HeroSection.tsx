import Link from "next/link";
import Image from "next/image";

import AuroraBg from "@/components/AuroraBg";
import heroImage from "@/public/Hero_section_image.png"

import FloatingNavbar from "./FloatingNavbar";
import Navbar from "./Navbar";

export default function HeroSection() {
  return (
    <section className="w-full bg-background">
      <AuroraBg >
        <Navbar />
        <FloatingNavbar />
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  <span className="flex">
                    <p>Unlock the&nbsp;</p>
                    <p className="text-blue-500 relative">Power
                      <span className="absolute inset-x-0 w-3/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
                    </p>
                  </span>
                  <p className="relative">of Collaborative Editing
                  </p>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  DocX is an open-source Google Docs alternative that empowers teams to create, edit, and share
                  documents seamlessly.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/signup"
                  className="z-10 inline-flex h-10 items-center bg-blue-500 justify-center rounded-md px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Try DocX
                </Link>
                <Link
                  href="#"
                  className="z-10 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground hover:border-blue-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
            </div>
            <Image
              src={heroImage}
              alt="Hero"
              className="z-10 mx-auto object-cover hidden w-[60%] sm:block lg:w-[80%] xl:w-[90%]"
            />
          </div>
        </div>
      </AuroraBg>
    </section>
  )
}
