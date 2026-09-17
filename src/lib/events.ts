export type EventKind = "hackathon" | "workshop" | "seminar";

export type EventItem = {
  slug: string;
  kind: EventKind;
  title: string;
  lede: string;
  city: string;
  venue: string;
  region: string;
  start: string;
  end: string;
  whenLabel: string;
  timeLabel: string;
  durationLabel: string;
  capacity: number;
  reserved: number;
  status: "upcoming" | "past";
  image: string;
  featured?: boolean;
  who: string[];
  bring: string[];
  agenda: { time: string; item: string }[];
  tracks?: { name: string; detail: string }[];
  body: string[];
};

export const FORMATS: Record<
  EventKind,
  {
    label: string;
    plural: string;
    kicker: string;
    summary: string;
    detail: string;
    duration: string;
    image: string;
  }
> = {
  hackathon: {
    label: "Hackathon",
    plural: "Hackathons",
    kicker: "Build it live",
    summary:
      "A day or a weekend of building in the open. You watch it take shape in the room, then you ship something that actually runs.",
    detail:
      "Teams of neighbors, students, shop owners, and anyone curious. Mentors on the floor, building live. Tracks for first-timers and for folks who already code. We end with short demos, not a pitch contest.",
    duration: "One day or a weekend",
    image: "/images/format-hackathon.jpg",
  },
  workshop: {
    label: "Workshop",
    plural: "Workshops",
    kicker: "Hands on, live",
    summary:
      "David works live from a question in the room. Then everyone tries it on their own phone or laptop. Small groups, no jargon.",
    detail:
      "Libraries, churches, chambers, and community rooms. We go slow on purpose. You watch a real thing get built, then you build one. Seniors, shop owners, teachers, farm families — if you can tap a screen, you can do this.",
    duration: "A morning or an afternoon",
    image: "/images/format-workshop.jpg",
  },
  seminar: {
    label: "Seminar",
    plural: "Seminars",
    kicker: "Straight talk, then a live build",
    summary:
      "A clear talk for a room of neighbors — then we use the tools live so you see what AI can do, and what it cannot.",
    detail:
      "Built for chambers, civic clubs, school boards, and city staff. Forty-five minutes of sense, a live build from a question in the room, then questions. You will not be sold a package.",
    duration: "About ninety minutes",
    image: "/images/format-seminar.jpg",
  },
};

export const EVENTS: EventItem[] = [
  {
    slug: "clinton-first-gathering",
    kind: "workshop",
    title: "First Gathering: AI at the Library",
    lede: "The kickoff workshop in Clinton — neighbors, coffee, and a first honest hour with the tools.",
    city: "Clinton",
    venue: "Clinton Public Library",
    region: "West Central",
    start: "2026-08-22",
    end: "2026-08-22",
    whenLabel: "Saturday, August 22, 2026",
    timeLabel: "10:00 a.m. – 12:30 p.m.",
    durationLabel: "A morning",
    capacity: 28,
    reserved: 28,
    status: "past",
    image: "/images/format-workshop.jpg",
    who: ["Curious beginners", "Small-business owners", "Anyone from Henry County"],
    bring: ["A phone or laptop", "A question you actually have"],
    agenda: [
      { time: "10:00", item: "Coffee, nametags, and what we will (and will not) cover" },
      { time: "10:20", item: "Your first useful conversation with an AI tool" },
      { time: "11:10", item: "Write something real: a letter, a listing, a plan" },
      { time: "12:00", item: "Safety, scams, and questions" },
    ],
    body: [
      "This was the first AI for Missouri gathering. A Saturday morning in the library meeting room, no slides-for-slides’-sake, and a room of people who left able to use the tools on their own.",
    ],
  },
  {
    slug: "warsaw-lake-seminar",
    kind: "seminar",
    title: "Lake Country Seminar",
    lede: "What AI can do for marinas, cabins, shops, and the folks who keep a lake town running.",
    city: "Warsaw",
    venue: "Community room, downtown Warsaw",
    region: "Lake Country",
    start: "2026-09-06",
    end: "2026-09-06",
    whenLabel: "Saturday, September 6, 2026",
    timeLabel: "2:00 p.m. – 3:30 p.m.",
    durationLabel: "Ninety minutes",
    capacity: 40,
    reserved: 34,
    status: "past",
    image: "/images/format-seminar.jpg",
    who: ["Tourism and lodging", "Main Street shops", "City and chamber folks"],
    bring: ["Just yourself"],
    agenda: [
      { time: "2:00", item: "A plain-English map of the tools" },
      { time: "2:35", item: "Seasonal businesses: booking, questions, follow-up" },
      { time: "3:10", item: "Open questions" },
    ],
    body: [
      "A Saturday seminar for the lake towns — practical, local, and short enough to still make supper.",
    ],
  },
  {
    slug: "clinton-october-workshop",
    kind: "workshop",
    title: "First Hour with AI",
    lede: "Never typed a thing into ChatGPT? Perfect. We go slow, we have fun, and you leave with something useful.",
    city: "Clinton",
    venue: "Clinton Public Library",
    region: "West Central",
    start: "2026-10-04",
    end: "2026-10-04",
    whenLabel: "Saturday, October 4, 2026",
    timeLabel: "9:30 a.m. – 12:30 p.m.",
    durationLabel: "A morning",
    capacity: 24,
    reserved: 11,
    status: "upcoming",
    image: "/images/format-workshop.jpg",
    featured: true,
    who: ["Complete beginners", "Seniors", "Anyone who has been putting this off"],
    bring: ["A phone or laptop with a charger", "An email address"],
    agenda: [
      { time: "9:30", item: "Settle in. What this is, and what it is not." },
      { time: "9:50", item: "Accounts, privacy, and how to ask a clear question" },
      { time: "10:40", item: "Do a real task: a letter, a recipe plan, a trip, a listing" },
      { time: "11:40", item: "Spotting nonsense, scams, and overconfident answers" },
      { time: "12:10", item: "What to try this week" },
    ],
    body: [
      "This is the gentle on-ramp. No one will make you feel behind. We work on the thing you actually came in with — a letter to a grandkid, a shop email, a garden plan — not a made-up exercise.",
      "Hosted in the library meeting room in historic downtown Clinton. Coffee on the side table. Chairs for twenty-four.",
    ],
  },
  {
    slug: "sedalia-chamber-seminar",
    kind: "seminar",
    title: "AI on Main Street",
    lede: "A chamber-ready seminar for shops, agencies, and offices that have heard the hype and want the useful part.",
    city: "Sedalia",
    venue: "Sedalia Chamber of Commerce",
    region: "West Central",
    start: "2026-10-18",
    end: "2026-10-18",
    whenLabel: "Saturday, October 18, 2026",
    timeLabel: "8:00 a.m. – 9:30 a.m.",
    durationLabel: "Ninety minutes",
    capacity: 50,
    reserved: 22,
    status: "upcoming",
    image: "/images/format-seminar.jpg",
    who: ["Shop owners", "Insurance, realty, and accounting offices", "Chamber members"],
    bring: ["A notebook. A laptop if you want to try along."],
    agenda: [
      { time: "8:00", item: "Breakfast and a plain map of the landscape" },
      { time: "8:25", item: "Where small Missouri businesses actually save time" },
      { time: "8:55", item: "What not to hand to a machine — client info, money, the truth" },
      { time: "9:15", item: "Questions from the floor" },
    ],
    body: [
      "Built for a Saturday breakfast crowd. You will see real examples from shops and offices, not a keynote about the future of work.",
      "Bring the one weekly chore you wish would take ten minutes instead of an hour.",
    ],
  },
  {
    slug: "warrensburg-harvest-hack",
    kind: "hackathon",
    title: "Harvest Hack",
    lede: "A weekend build for farms, co-ops, Main Street, and anyone who wants to make something that helps a Missouri place.",
    city: "Warrensburg",
    venue: "University of Central Missouri — community rooms",
    region: "West Central",
    start: "2026-11-07",
    end: "2026-11-08",
    whenLabel: "November 7–8, 2026",
    timeLabel: "Saturday 9:00 a.m. through Sunday 4:00 p.m.",
    durationLabel: "A weekend",
    capacity: 80,
    reserved: 31,
    status: "upcoming",
    image: "/images/format-hackathon.jpg",
    featured: true,
    who: ["Students", "Farm and ranch families", "Developers", "Curious first-timers"],
    bring: ["A laptop", "A charger", "A problem from your town or operation"],
    tracks: [
      { name: "Farm & ranch", detail: "Records, weather sense, grants, scouting help." },
      { name: "Main Street", detail: "Shops, services, follow-up, and local info." },
      { name: "Civic", detail: "Libraries, schools, city hall, volunteer groups." },
      { name: "Open build", detail: "Your idea. Mentors on the floor either way." },
    ],
    agenda: [
      { time: "Sat 9:00", item: "Coffee, team-up, and problem pitches (no slides required)" },
      { time: "Sat 10:30", item: "Build. Mentors rotate. Lunch in the room." },
      { time: "Sat 6:00", item: "Supper break. Optional evening work session." },
      { time: "Sun 9:00", item: "Finish, test, and write a one-page how-to" },
      { time: "Sun 2:30", item: "Demos — five minutes each, neighbors in the seats" },
    ],
    body: [
      "Harvest Hack is not a startup contest. There is no prize pool and no investor panel. The point is to leave Sunday with a working helper for a real Missouri problem — a spray log, a shop follow-up, a library FAQ, a 4-H planner.",
      "First-timers are expected. Every team gets a mentor. If you do not code, you can still own the problem, the testing, and the write-up.",
    ],
  },
  {
    slug: "clinton-saturday-hack",
    kind: "hackathon",
    title: "Clinton Saturday Hack",
    lede: "Eight hours in Clinton. Walk in at ten with a real problem. Walk out at six with something that actually runs.",
    city: "Clinton",
    venue: "Clinton Community Building",
    region: "West Central",
    start: "2026-11-14",
    end: "2026-11-14",
    whenLabel: "Saturday, November 14, 2026",
    timeLabel: "10:00 a.m. – 6:00 p.m.",
    durationLabel: "One day",
    capacity: 48,
    reserved: 16,
    status: "upcoming",
    image: "/images/format-hackathon.jpg",
    featured: true,
    who: [
      "Henry County neighbors",
      "Shop owners and trades",
      "Farm and ranch families",
      "Students",
      "First-timers who cannot give a whole weekend",
    ],
    bring: [
      "A laptop and a charger",
      "A power strip if you have one",
      "A sandwich for lunch — coffee stays on",
      "The problem you actually have, written in one sentence",
    ],
    tracks: [
      {
        name: "Main Street",
        detail: "Listings, follow-up, quotes, the Saturday rush.",
      },
      {
        name: "Farm & ranch",
        detail: "The form, the letter, the record you keep putting off.",
      },
      {
        name: "Civic",
        detail: "Library, city hall, church, 4-H, volunteer groups.",
      },
      {
        name: "First-timers",
        detail: "Pair with a mentor. Ship something small. That counts.",
      },
    ],
    agenda: [
      { time: "10:00", item: "Doors, coffee, nametags. What this day is — and is not." },
      { time: "10:20", item: "Problem pitches. Two minutes. No slides. Say the headache out loud." },
      { time: "10:40", item: "Form teams. Mentors assigned. Pick a track." },
      { time: "11:00", item: "Build starts." },
      { time: "12:30", item: "Lunch in the room. Keep your seat. Mentors stay." },
      { time: "1:15", item: "Build. Stuck? Wave someone over." },
      { time: "3:30", item: "Stretch. Then make it demo-able — not perfect." },
      { time: "4:45", item: "Write a one-page how-to so somebody else can use it Monday." },
      { time: "5:15", item: "Demos. Five minutes each. Neighbors in the seats." },
      { time: "6:00", item: "Done. Stack the chairs. Go home." },
    ],
    body: [
      "This is the home-county one-day. If Harvest Hack in Warrensburg is more weekend than you can give, this is yours. Same rules: no prize pool, no investor panel, no sales pitch. The point is a working helper by six.",
      "Teams of two to five. Every team gets a mentor. If you do not code, you still belong here — you can own the problem, the testing, and the write-up. First-timers are expected, not tolerated.",
      "Park on the square or along the side streets. The Community Building will be signed from Franklin Street. Doors open at 9:45. We start at ten sharp.",
    ],
  },
  {
    slug: "windsor-seniors-workshop",
    kind: "workshop",
    title: "Seniors & AI: Letters, Recipes, Scam-Spotting",
    lede: "A patient Saturday for anyone who has been told they are “too late” for this. You are not.",
    city: "Windsor",
    venue: "Windsor Public Library",
    region: "West Central",
    start: "2026-11-15",
    end: "2026-11-15",
    whenLabel: "Saturday, November 15, 2026",
    timeLabel: "1:00 p.m. – 3:30 p.m.",
    durationLabel: "An afternoon",
    capacity: 20,
    reserved: 9,
    status: "upcoming",
    image: "/images/event-rural.jpg",
    who: ["Seniors", "Complete beginners", "Anyone helping a parent or neighbor"],
    bring: ["A phone or tablet", "A pair of reading glasses if you use them"],
    agenda: [
      { time: "1:00", item: "No silly questions. We start from zero." },
      { time: "1:20", item: "Ask for a letter, a recipe, a trip plan" },
      { time: "2:20", item: "How scams show up, and how to slow down" },
      { time: "3:00", item: "A cheat sheet to take home" },
    ],
    body: [
      "We go at the speed of the room. If you have never opened ChatGPT, you are the person this afternoon is for.",
    ],
  },
  {
    slug: "springfield-can-cannot-seminar",
    kind: "seminar",
    title: "What AI Can — and Cannot — Do",
    lede: "A straight talk for civic clubs, offices, and anyone tired of the hype cycle.",
    city: "Springfield",
    venue: "Library Center community room",
    region: "Southwest",
    start: "2026-12-05",
    end: "2026-12-05",
    whenLabel: "Saturday, December 5, 2026",
    timeLabel: "10:00 a.m. – 11:30 a.m.",
    durationLabel: "Ninety minutes",
    capacity: 60,
    reserved: 19,
    status: "upcoming",
    image: "/images/format-seminar.jpg",
    who: ["Civic clubs", "Office teams", "Teachers and staff", "Curious public"],
    bring: ["Questions you have been saving"],
    agenda: [
      { time: "10:00", item: "A map of the tools without the mythology" },
      { time: "10:35", item: "Where it fails — confidently" },
      { time: "11:00", item: "A Missouri town’s sensible next step" },
      { time: "11:15", item: "Questions" },
    ],
    body: [
      "This one is for the skeptics and the over-sold alike. We will name what is useful this year, what is theater, and what a Springfield shop or classroom can try on Monday.",
    ],
  },
  {
    slug: "kansas-city-winter-build",
    kind: "hackathon",
    title: "Winter Build Weekend",
    lede: "A January weekend in a brick room, building helpers for Kansas City neighborhoods, shops, and nonprofits.",
    city: "Kansas City",
    venue: "Westside community warehouse",
    region: "Kansas City",
    start: "2027-01-16",
    end: "2027-01-17",
    whenLabel: "January 16–17, 2027",
    timeLabel: "Saturday 9:00 a.m. through Sunday 4:00 p.m.",
    durationLabel: "A weekend",
    capacity: 100,
    reserved: 27,
    status: "upcoming",
    image: "/images/event-warehouse.jpg",
    featured: true,
    who: ["KC neighbors", "Students", "Nonprofit staff", "Developers"],
    bring: ["A laptop", "A neighborhood problem"],
    tracks: [
      { name: "Neighborhood", detail: "Block groups, mutual aid, local info." },
      { name: "Small business", detail: "Shops, trades, restaurants." },
      { name: "Care & civic", detail: "Clinics, libraries, congregations." },
      { name: "Open build", detail: "Bring the thing you cannot stop thinking about." },
    ],
    agenda: [
      { time: "Sat 9:00", item: "Open, coffee, form teams" },
      { time: "Sat 10:30", item: "Build with mentors" },
      { time: "Sun 9:00", item: "Polish and write the how-to" },
      { time: "Sun 2:30", item: "Public demos" },
    ],
    body: [
      "Winter Build is the urban cousin of Harvest Hack. Same spirit: no prize theater, no investor panel. Just a weekend of making something a Kansas City neighbor can use.",
    ],
  },
  {
    slug: "columbia-teachers-workshop",
    kind: "workshop",
    title: "Teachers & Classroom AI",
    lede: "A practical Saturday for Missouri teachers who want the useful parts and none of the cheating panic.",
    city: "Columbia",
    venue: "Columbia Public Library",
    region: "Mid-Missouri",
    start: "2027-02-07",
    end: "2027-02-07",
    whenLabel: "Saturday, February 7, 2027",
    timeLabel: "9:00 a.m. – 12:00 p.m.",
    durationLabel: "A morning",
    capacity: 30,
    reserved: 14,
    status: "upcoming",
    image: "/images/format-workshop.jpg",
    who: ["K–12 teachers", "Librarians", "Coaches and aides"],
    bring: ["A laptop", "One unit you are teaching this semester"],
    agenda: [
      { time: "9:00", item: "What students already do with these tools" },
      { time: "9:30", item: "Lesson planning, differentiation, and feedback" },
      { time: "10:30", item: "Academic honesty without a witch hunt" },
      { time: "11:20", item: "Build one activity you can use next week" },
    ],
    body: [
      "We will not pretend the tools are not in students’ pockets. We will make a classroom practice that is honest, useful, and still yours.",
    ],
  },
  {
    slug: "jefferson-city-civic-seminar",
    kind: "seminar",
    title: "Civic AI Seminar",
    lede: "For city staff, county offices, and anyone who has to explain this to a board.",
    city: "Jefferson City",
    venue: "A downtown civic room — details on RSVP",
    region: "Mid-Missouri",
    start: "2027-02-21",
    end: "2027-02-21",
    whenLabel: "Saturday, February 21, 2027",
    timeLabel: "10:00 a.m. – 11:30 a.m.",
    durationLabel: "Ninety minutes",
    capacity: 45,
    reserved: 12,
    status: "upcoming",
    image: "/images/format-seminar.jpg",
    who: ["City and county staff", "Board members", "Librarians", "Civic volunteers"],
    bring: ["A policy question, if you have one"],
    agenda: [
      { time: "10:00", item: "What a Missouri town can adopt this year" },
      { time: "10:30", item: "Records, privacy, and public trust" },
      { time: "11:00", item: "Questions from the floor" },
    ],
    body: [
      "A seminar with the capital in mind, but written for the clerk in a town of two thousand as much as for a department in Jeff City.",
    ],
  },
  {
    slug: "osage-beach-tourism-hack",
    kind: "hackathon",
    title: "Lake & Tourism Hack",
    lede: "A weekend for marinas, cabins, guides, venues, and the towns that live on a season.",
    city: "Osage Beach",
    venue: "Lakeside community hall",
    region: "Lake Country",
    start: "2027-03-14",
    end: "2027-03-15",
    whenLabel: "March 14–15, 2027",
    timeLabel: "Saturday 9:00 a.m. through Sunday 3:00 p.m.",
    durationLabel: "A weekend",
    capacity: 64,
    reserved: 16,
    status: "upcoming",
    image: "/images/format-hackathon.jpg",
    who: ["Lodging and marinas", "Guides and venues", "Students", "Locals"],
    bring: ["A laptop", "The question your guests ask twenty times a day"],
    tracks: [
      { name: "Booking & questions", detail: "Hours, availability, the packet before check-in." },
      { name: "Local knowledge", detail: "Trails, ramps, eats, what is open in March." },
      { name: "Open build", detail: "Your seasonal headache." },
    ],
    agenda: [
      { time: "Sat 9:00", item: "Open and form teams with operators in the room" },
      { time: "Sat 10:30", item: "Build against real guest questions" },
      { time: "Sun 1:30", item: "Demos for the lake towns" },
    ],
    body: [
      "Operators sit with builders. The demos on Sunday are for people who will actually use the thing when the season opens.",
    ],
  },
  {
    slug: "joplin-workshop",
    kind: "workshop",
    title: "Joplin Hands-On Workshop",
    lede: "A traveling workshop stop for southwest Missouri — shops, families, and first-timers.",
    city: "Joplin",
    venue: "Joplin Public Library",
    region: "Southwest",
    start: "2027-03-28",
    end: "2027-03-28",
    whenLabel: "Saturday, March 28, 2027",
    timeLabel: "10:00 a.m. – 1:00 p.m.",
    durationLabel: "A morning",
    capacity: 28,
    reserved: 8,
    status: "upcoming",
    image: "/images/event-rural.jpg",
    who: ["Beginners", "Shop owners", "High-schoolers and parents"],
    bring: ["A phone or laptop"],
    agenda: [
      { time: "10:00", item: "The ten-minute tour of the tools" },
      { time: "10:30", item: "Do a real task from your week" },
      { time: "12:00", item: "Safety, sharing, and what to try next" },
    ],
    body: [
      "Same workshop we run in Clinton, with the room pointed at Joplin questions — shops, families, and the next thing you actually need written.",
    ],
  },
  {
    slug: "st-louis-open-hack",
    kind: "hackathon",
    title: "St. Louis Open Hack",
    lede: "A spring weekend for the city and the inner suburbs — neighborhoods, shops, schools, and civic groups.",
    city: "St. Louis",
    venue: "A brick hall on the near south side — details on RSVP",
    region: "St. Louis",
    start: "2027-04-17",
    end: "2027-04-18",
    whenLabel: "April 17–18, 2027",
    timeLabel: "Saturday 9:00 a.m. through Sunday 4:00 p.m.",
    durationLabel: "A weekend",
    capacity: 120,
    reserved: 33,
    status: "upcoming",
    image: "/images/event-warehouse.jpg",
    featured: true,
    who: ["St. Louis neighbors", "Students", "Nonprofit staff", "Developers"],
    bring: ["A laptop", "A neighborhood or shop problem"],
    tracks: [
      { name: "Neighborhood", detail: "Block-level helpers, language access, local info." },
      { name: "Shops & trades", detail: "The missed call, the quote, the follow-up." },
      { name: "Schools & libraries", detail: "Staff tools, not student surveillance." },
      { name: "Open build", detail: "The thing your block keeps asking for." },
    ],
    agenda: [
      { time: "Sat 9:00", item: "Open, coffee, form teams" },
      { time: "Sat 10:30", item: "Build. Mentors on the floor." },
      { time: "Sun 2:30", item: "Public demos" },
    ],
    body: [
      "The largest gathering on the calendar. Same rules as the others: neighbors in the seats on Sunday, no prize theater, and first-timers on purpose.",
    ],
  },
  {
    slug: "cape-girardeau-seminar",
    kind: "seminar",
    title: "Cape Girardeau Business Seminar",
    lede: "A southeast Missouri seminar for offices, shops, and campuses along the river.",
    city: "Cape Girardeau",
    venue: "A downtown civic room — details on RSVP",
    region: "Southeast",
    start: "2027-04-25",
    end: "2027-04-25",
    whenLabel: "Sunday, April 25, 2027",
    timeLabel: "2:00 p.m. – 3:30 p.m.",
    durationLabel: "Ninety minutes",
    capacity: 50,
    reserved: 7,
    status: "upcoming",
    image: "/images/format-seminar.jpg",
    who: ["Shops and offices", "Campus staff", "Civic clubs"],
    bring: ["A question from your week"],
    agenda: [
      { time: "2:00", item: "The useful map" },
      { time: "2:35", item: "A Cape-sized next step" },
      { time: "3:10", item: "Questions" },
    ],
    body: [
      "A Sunday afternoon seminar so the shops can still have Saturday. Straight talk, then we stay for questions.",
    ],
  },
  {
    slug: "clinton-farm-workshop",
    kind: "workshop",
    title: "Farm & Ranch Workshop",
    lede: "Paperwork, weather, markets, and the day-to-day — in plain English, for people who have enough on their plate.",
    city: "Clinton",
    venue: "Henry County community room",
    region: "West Central",
    start: "2027-05-09",
    end: "2027-05-09",
    whenLabel: "Saturday, May 9, 2027",
    timeLabel: "9:00 a.m. – 12:00 p.m.",
    durationLabel: "A morning",
    capacity: 32,
    reserved: 10,
    status: "upcoming",
    image: "/images/event-rural.jpg",
    who: ["Farm and ranch families", "Ag retailers", "Custom operators"],
    bring: ["A phone", "A piece of paperwork you dread"],
    agenda: [
      { time: "9:00", item: "What this is useful for on an operation — and what it is not" },
      { time: "9:30", item: "Draft a form, a letter, a spray note from your phone" },
      { time: "10:30", item: "Weather, markets, and asking a clear question" },
      { time: "11:20", item: "Records you can actually keep" },
    ],
    body: [
      "Boots-still-muddy by design. We will not talk about precision-ag dashboards you do not own. We will get through a grant letter, a livestock note, and a question about the week’s forecast.",
    ],
  },
];

function paidAndReadySession(opts: {
  start: string;
  whenLabel: string;
  featured?: boolean;
  reserved?: number;
}): EventItem {
  return {
    slug: `paid-and-ready-${opts.start.slice(0, 7)}`,
    kind: "workshop",
    title: "Paid and Ready",
    lede: "Live in the room: we set up your own paid AI subscription for personal use. You pay the tool company if you choose. We do not sell one.",
    city: "Clinton",
    venue: "Clinton Public Library",
    region: "West Central",
    start: opts.start,
    end: opts.start,
    whenLabel: opts.whenLabel,
    timeLabel: "6:00 p.m. – 7:30 p.m.",
    durationLabel: "Ninety minutes",
    capacity: 18,
    reserved: opts.reserved ?? 0,
    status: "upcoming",
    image: "/images/format-workshop.jpg",
    featured: Boolean(opts.featured),
    who: [
      "People still on a free plan",
      "Anyone whose kid set the account up",
      "Shop owners who want their own login",
      "Seniors who want it done once, correctly",
    ],
    bring: [
      "A phone or laptop and a charger",
      "An email you can log into",
      "A payment card only if you already want to subscribe",
      "One thing you wish the free version would do",
    ],
    agenda: [
      { time: "6:00", item: "Sit down. What “paid” actually gets you — and what it does not." },
      { time: "6:15", item: "Live: create the account. Email, password, privacy." },
      { time: "6:35", item: "Live: the paid plan. Billing, how to cancel, personal vs family." },
      { time: "6:55", item: "First useful thing on the paid tools — something you walked in with." },
      { time: "7:20", item: "Questions. Nobody has to subscribe tonight." },
    ],
    body: [
      "Paid and Ready is a monthly Wednesday evening in Clinton. We use AI live, in front of the room, and walk through setting up a paid subscription for your own personal use — ChatGPT, Claude, or similar.",
      "This is not a product we sell. If you subscribe, you pay the tool company. We sit next to you, on the projector and on your phone, and get the account working: email, billing, privacy, cancel, and the first thing that is actually useful.",
      "Come even if you are not ready to pay. Watching the setup is the point. First Wednesday of the month, 6:00 to 7:30 p.m., library meeting room. Coffee on the side table.",
    ],
  };
}

const PAID_AND_READY: EventItem[] = [
  paidAndReadySession({
    start: "2026-10-07",
    whenLabel: "Wednesday, October 7, 2026",
    featured: true,
    reserved: 6,
  }),
  paidAndReadySession({
    start: "2026-11-04",
    whenLabel: "Wednesday, November 4, 2026",
    reserved: 4,
  }),
  paidAndReadySession({
    start: "2026-12-02",
    whenLabel: "Wednesday, December 2, 2026",
    reserved: 3,
  }),
  paidAndReadySession({
    start: "2027-01-06",
    whenLabel: "Wednesday, January 6, 2027",
    reserved: 2,
  }),
  paidAndReadySession({
    start: "2027-02-03",
    whenLabel: "Wednesday, February 3, 2027",
    reserved: 2,
  }),
  paidAndReadySession({
    start: "2027-03-03",
    whenLabel: "Wednesday, March 3, 2027",
    reserved: 1,
  }),
  paidAndReadySession({
    start: "2027-04-07",
    whenLabel: "Wednesday, April 7, 2027",
    reserved: 1,
  }),
  paidAndReadySession({
    start: "2027-05-05",
    whenLabel: "Wednesday, May 5, 2027",
    reserved: 0,
  }),
];

EVENTS.push(...PAID_AND_READY);

export const TOWNS = [
  { name: "Clinton", note: "Home base" },
  { name: "Windsor", note: "Library workshop" },
  { name: "Warsaw", note: "Lake seminar" },
  { name: "Sedalia", note: "Chamber" },
  { name: "Warrensburg", note: "Harvest Hack" },
  { name: "Springfield", note: "Seminar" },
  { name: "Kansas City", note: "Winter Build" },
  { name: "Columbia", note: "Teachers" },
  { name: "Jefferson City", note: "Civic" },
  { name: "Osage Beach", note: "Tourism hack" },
  { name: "Joplin", note: "Workshop" },
  { name: "St. Louis", note: "Open Hack" },
  { name: "Cape Girardeau", note: "Seminar" },
];

export const FAQS = [
  {
    q: "What is Paid and Ready?",
    a: "A monthly Wednesday evening in Clinton. We use the tools live and walk through setting up your own paid AI subscription — ChatGPT, Claude, or similar — for personal use. First Wednesday, 6:00 to 7:30 p.m., at the library. You pay the tool company if you choose. We do not sell a subscription.",
  },
  {
    q: "Do I have to pay for a subscription at Paid and Ready?",
    a: "No. You can watch the whole setup and decide later. If you do subscribe, that money goes to the company that makes the tool, not to AI for Missouri. Bring a card only if you already want to do it that night.",
  },
  {
    q: "Do you actually build things in the room?",
    a: "Yes. That is the whole method. We use AI live, in front of whoever showed up, on a real question from the room. You watch it get made. Then you try it on your own phone or laptop.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Not for workshops or seminars. Hackathons have tracks for first-timers — every team needs someone who knows the actual problem. If you farm, run a shop, teach, or keep a library going, you are already qualified.",
  },
  {
    q: "Is this a sales pitch?",
    a: "No. These are community gatherings. David will not sell you a package from the lectern, and nothing on this site is a product list. Paid and Ready walks you through a subscription you buy from the tool company — that is not ours. If you later want help on a specific job, that is a different conversation, on a different day.",
  },
  {
    q: "What should I bring?",
    a: "A phone or laptop, a charger, and a real question. For hackathons, a problem from your town, shop, farm, or school is better than a blank page.",
  },
  {
    q: "Can my library, chamber, church, or school host one?",
    a: "Yes. That is the point. Tell us the room, the town, and whether you are picturing a workshop, a seminar, or a weekend build. We will figure out the rest together.",
  },
  {
    q: "Are events in person?",
    a: "Yes. Live, in the room. If weather or a road problem forces a change, everyone who RSVP’d gets a note.",
  },
  {
    q: "Can high-schoolers come?",
    a: "Workshops and seminars, yes — especially with a parent or teacher. Hackathons, yes if you can stay for the hours and a grown-up knows you are there. We are not a drop-off camp.",
  },
];

export function nextPaidAndReady(events: EventItem[]) {
  return upcomingFrom(events).find((event) =>
    event.slug.startsWith("paid-and-ready-"),
  );
}

export function upcomingFrom(events: EventItem[]) {
  return events.filter((event) => event.status === "upcoming");
}

export function pastFrom(events: EventItem[]) {
  return events.filter((event) => event.status === "past");
}

export function featuredFrom(events: EventItem[]) {
  return upcomingFrom(events).filter((event) => event.featured);
}

export function byKindFrom(events: EventItem[], kind: EventKind | "all") {
  const list = upcomingFrom(events);
  if (kind === "all") return list;
  return list.filter((event) => event.kind === kind);
}

export function getEvent(slug: string) {
  return EVENTS.find((event) => event.slug === slug);
}

export function upcomingEvents() {
  return EVENTS.filter((event) => event.status === "upcoming");
}

export function pastEvents() {
  return EVENTS.filter((event) => event.status === "past");
}

export function featuredEvents() {
  return upcomingEvents().filter((event) => event.featured);
}

export function eventsByKind(kind: EventKind | "all") {
  const list = upcomingEvents();
  if (kind === "all") return list;
  return list.filter((event) => event.kind === kind);
}

export function kindLabel(kind: EventKind) {
  return FORMATS[kind].label;
}
