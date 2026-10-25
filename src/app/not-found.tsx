import Link from "next/link";
import { Compass, Home, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 min-h-[60vh] items-center justify-center px-4 py-24">
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary">
          <Compass className="size-6" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <Button variant="outline" className="gap-2" nativeButton={false} render={<Link href="/" />}>
            <Home className="size-4" />
            Go home
          </Button>
          <Button variant="destructive" className="gap-2" nativeButton={false} render={<Link href="/sos" />}>
            <Siren className="size-4" />
            Emergency SOS
          </Button>
        </div>
      </div>
    </div>
  );
}
