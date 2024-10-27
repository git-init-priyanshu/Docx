import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="w-full py-12 md:py-24 lg:py-32 border-t bg-slate-50"
    >
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-blue-500">
            <span className="text-black">Get in&nbsp;</span>
            <span className="text-blue-500">Touch</span>
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have questions or feedback? We&apos;d love to hear from you. Fill
            out the form below, and one of our team members will get back to
            you.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-lg flex-1"
            />
            <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
