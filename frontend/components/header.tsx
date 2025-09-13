"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { Bell, Plus, User, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ToggleTheme } from "./toggle-theme";

interface HeaderProps {
  showSearch?: boolean;
}

// Navigation links for authenticated users
function AuthenticatedNavLinks({ className = "" }: { className?: string }) {
  return (
    <>
      <Link
        href="/sub-leases"
        className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow transition-all duration-300 ${className}`}
      >
        Feed
      </Link>
      <Link
        href="/browse"
        className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow transition-all duration-300 ${className}`}
      >
        Browse
      </Link>
      <Link
        href="/messages"
        className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow transition-all duration-300 ${className}`}
      >
        Messages
      </Link>
    </>
  );
}

// Navigation links for unauthenticated users
function UnauthenticatedNavLinks({ className = "" }: { className?: string }) {
  return (
    <>
      <Link
        href="#how-it-works"
        className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow transition-all duration-300 ${className}`}
      >
        How it works
      </Link>
      <Link
        href="#safety"
        className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow transition-all duration-300 ${className}`}
      >
        Safety
      </Link>
      <Link
        href="#support"
        className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow transition-all duration-300 ${className}`}
      >
        Support
      </Link>
    </>
  );
}

export function Header({ showSearch = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {isLoggedIn ? (
            <>
              <nav className="hidden md:flex items-center space-x-8">
                <AuthenticatedNavLinks />
              </nav>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:flex"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                </Button>
                <Link href="/property">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">List Property</span>
                  </Button>
                </Link>
                <Link href="/account">
                  <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ""} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="hidden sm:flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <nav className="hidden md:flex items-center space-x-8">
                <UnauthenticatedNavLinks />
              </nav>
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-primary hover:bg-primary/10 hidden sm:inline-flex"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get started
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
          <div>
            <ToggleTheme />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-4">
              {isLoggedIn ? (
                <>
                  <AuthenticatedNavLinks />
                  <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:drop-shadow-glow w-full justify-start transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <UnauthenticatedNavLinks />
                  <Link href="/login">
                    <Button
                      variant="link"
                      className="text-primary hover:bg-primary/10 w-full justify-start px-0"
                    >
                      Sign in
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
