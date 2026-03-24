"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps extends LinkProps {
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, exact = false, href, ...props }, ref) => {
    const pathname = usePathname();

    const isActive = exact
      ? pathname === href
      : pathname?.startsWith(typeof href === "string" ? href : href.toString());

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };