import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <Link href={"/dashboard"}>Dashbaord</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href={"/login"}>login</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href={"/user"}>user</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href={"/user/create"}>create user</Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div>{children}</div>
    </div>
  );
}
