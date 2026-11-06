import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({
  items,
  className,
  showHome = true,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-slate-500", className)}
    >
      <ol className="flex items-center space-x-1.5 flex-wrap">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              title="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center space-x-1.5">
              {(showHome || index > 0) && (
                <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
              )}
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-slate-800 transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

