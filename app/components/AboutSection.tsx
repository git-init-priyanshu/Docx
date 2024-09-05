export default function AboutSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 border-t bg-neutral-50">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            <span className="text-black">About&nbsp;</span>
            <span className="text-blue-500">DocX</span>
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            DocX is an open-source Google Docs alternative, created by a team of passionate developers who believe
            in the power of collaborative editing. Our mission is to provide a user-friendly, feature-rich platform
            that empowers teams to work together seamlessly.
          </p>
        </div>
      </div>
    </section>
  )
}
