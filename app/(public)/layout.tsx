import Navbar from "@/component/landing/Navbar";
import Footer from "@/component/landing/Footer";
import { AuthModalProvider } from "@/component/auth/AuthModalContext";
import AuthModal from "@/component/auth/AuthModal";
import { LandingModeProvider, LandingShell } from "@/component/landing/LandingModeContext";

/**
 * Public route-group layout.
 * Wraps all public-facing pages (landing, about, etc.) with
 * the floating Navbar and site-wide Footer.
 *
 * AuthModalProvider enables any client component in this tree
 * to call useAuthModal().open() to trigger the auth dialog.
 * LandingModeProvider manages interactive switching between Solver (Light)
 * and Seeker (Dark) modes on the landing page.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      <LandingModeProvider>
        <LandingShell>
          <Navbar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
          <Footer />
          {/* Auth modal — fixed position, renders above everything */}
          <AuthModal />
        </LandingShell>
      </LandingModeProvider>
    </AuthModalProvider>
  );
}

