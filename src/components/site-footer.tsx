import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-forest-deep text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-tight">AI for Missouri</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/70">
            Hackathons, workshops, and seminars — we use AI live, in the room,
            to build things. Based in Clinton. Traveling the state.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-paper/50">
            Visit
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/events" className="hover:text-cream">
                Calendar
              </Link>
            </li>
            <li>
              <Link to="/host" className="hover:text-cream">
                Bring an event to your town
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-cream">
                About David
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-cream">
                Staff desk
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-paper/50">
            Talk
          </p>
          <ul className="mt-3 space-y-2 text-sm text-paper/80">
            <li>
              <a href="mailto:david@aiformissouri.com" className="hover:text-cream">
                david@aiformissouri.com
              </a>
            </li>
            <li>
              <a href="tel:+16608692868" className="hover:text-cream">
                (660) 869-2868
              </a>
            </li>
            <li>Clinton, Missouri 64735</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-paper/45 sm:px-6">
          Built by Missourians, for Missourians. No hype, no headache.
        </p>
      </div>
    </footer>
  );
}
