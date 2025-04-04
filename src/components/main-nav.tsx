import Link from "next/link"
import { Bus } from "lucide-react"
import { useDrawerContext } from "@/context/DrawerContext";
import Drawer from "./Drawer";

export function MainNav() {
    const {isOpen, openDrawer } = useDrawerContext();

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Bus className="h-6 w-6" />
        <span className=" font-bold ">Bustify</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <Link
          href="/search"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Search
        </Link>
        <Link
          href="/routes"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Routes
        </Link>
        <Link
          href="/offers"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Offers
        </Link>
        <Link
          href="/contact"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Contact
        </Link>
      </nav>
    </div>
  )
}

