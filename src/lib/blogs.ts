export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  keywords: string[];
  contentHtml: string;
  faqs?: { q: string; a: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'kolkata-underwater-metro-guide-green-line-timings-fare',
    title: 'How I Commute Daily on the Kolkata Underwater Metro (Green Line): Timings, Fares & Station Hacks 2026',
    summary: 'A daily commuter’s personal guide to India’s first underwater metro across the Hooghly. Real travel times, interchange secrets at Howrah and Esplanade, and how to avoid token queues.',
    category: 'Kolkata Metro',
    publishedAt: '2026-03-02',
    readTime: '6 min read',
    author: {
      name: 'Soham Roy',
      role: 'Sector V IT Professional & Daily Commuter',
    },
    keywords: [
      'Kolkata underwater metro commuter experience',
      'Green Line metro schedule Howrah to Esplanade',
      'Howrah Maidan to Salt Lake Sector V metro fare',
      'Hooghly river underwater metro travel tips',
      'Kolkata metro smart card commuter hacks',
    ],
    contentHtml: `
      <p class="text-base leading-relaxed text-neutral-700 mb-4">
        If you have ever stood in a bumper-to-bumper traffic jam on the Howrah Bridge on a humid Monday morning, you know the dread. For years, traveling from Howrah Station to Sector V meant an exhausting 1.5 to 2-hour battle with yellow cabs, crowded buses, and ferry queues.
      </p>
      <p class="text-base leading-relaxed text-neutral-700 mb-6">
        When the Green Line (East-West Metro) finally opened its underwater stretch beneath the Hooghly River, it completely changed my daily routine. Here is my honest, on-the-ground commuter guide on how to ride it smoothly without getting lost in crowded subway passages.
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">The 45-Second Dive: Crossing the Hooghly Underwater</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        The underwater tunnel runs 32 metres below the surface between <strong>Howrah Railway Station</strong> and <strong>Mahakaran (BBD Bagh)</strong>. Inside the train, illuminated blue LED strips along the tunnel walls mark the river section. You barely notice you are under hundreds of thousands of tons of water — the ride is silent, vibration-free, and takes just about 45 to 55 seconds from bank to bank!
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Daily Timetable & Frequency (What Commuters Must Know)</h2>
      <ul class="list-disc pl-5 space-y-2 text-sm text-neutral-700 mb-6">
        <li><strong>Monday to Saturday:</strong> First train leaves Howrah Maidan and Sector V at <strong>07:00 AM</strong>. The last train departs at <strong>09:45 PM</strong>. During peak rush hours (8:30 AM – 11:00 AM and 5:30 PM – 8:00 PM), trains arrive every <strong>6 to 8 minutes</strong>.</li>
        <li><strong>Sundays:</strong> Services start in the afternoon at <strong>02:15 PM</strong> and run till <strong>09:50 PM</strong> at 12–15 minute intervals. Keep this in mind if you have early Sunday morning shifts.</li>
      </ul>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Interchange Secret at Esplanade (Green Line to Blue Line)</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        If you are heading down to Park Street, Kalighat, or Kavi Subhash, you can switch from the Green Line to the classic North-South Blue Line at <strong>Esplanade</strong>.
      </p>
      <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-6">
        <strong>💡 Pro-Tip:</strong> Do not tap out of the fare gates at Esplanade! Follow the bright overhead pedestrian signage down the interchange subway. Your ticket or smart card covers the transfer as long as you remain inside the underground paid area.
      </div>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Ticketing: Never Stand in the Token Queue</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        The ticket queues at Howrah Station Metro entrance are notorious during the morning rush. The smart way is either:
      </p>
      <ol class="list-decimal pl-5 space-y-2 text-sm text-neutral-700 mb-6">
        <li><strong>Kolkata Metro Smart Card:</strong> Costs ₹100 initially (with ₹60 security deposit and ₹40 travel value). You get an automatic 10% bonus discount on every trip and tap in/out in half a second.</li>
        <li><strong>ASG QR Ticket:</strong> Use the Kolkata Metro ticketing mobile app to generate a paperless QR code on your phone. You scan your phone directly at the AFC gates.</li>
      </ol>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Commuter Verdict</h2>
      <p class="text-sm leading-relaxed text-neutral-700">
        Fares range between ₹5 and ₹30. For ₹30, getting from Howrah Maidan to Sector V in under 30 minutes in air-conditioned comfort is an unbeatable luxury for Kolkata commuters. If you are catching an EMU local train at Howrah Junction, use the dedicated subway passage from Old Complex Platform 8 right into the metro gates.
      </p>
    `,
    faqs: [
      {
        q: 'How long does the train take underwater between Howrah and Mahakaran?',
        a: 'The underwater crossing takes between 45 and 55 seconds inside the tunnel under the Hooghly river.',
      },
      {
        q: 'Can I carry luggage on the underwater metro?',
        a: 'Yes, standard baggage within 15 kg is permitted. Security scanning is mandatory at station gates.',
      },
    ],
  },
  {
    slug: 'howrah-to-barddhaman-local-train-schedule-main-chord-tips',
    title: 'Howrah to Barddhaman (Main vs Chord Line): Commuter Guide & Galloper Local Hacks',
    summary: '11 years of daily commuting distilled into practical advice: Main line vs Chord line duration, the best galloper locals, seating secrets, and where to grab chai at Bandel.',
    category: 'Local Train Schedule',
    publishedAt: '2026-02-28',
    readTime: '7 min read',
    author: {
      name: 'Anirban Banerjee',
      role: 'Hooghly Commuter & Daily Passenger',
    },
    keywords: [
      'Howrah to Barddhaman local train schedule',
      'Howrah to BWN chord local timings',
      'Main line vs chord line difference',
      'Bandel to Howrah EMU local timings',
      'Bandel junction local train hacks',
    ],
    contentHtml: `
      <p class="text-base leading-relaxed text-neutral-700 mb-4">
        If you commute daily from Hooghly, Chinsurah, Bandel, or Memari into Kolkata, the Howrah–Barddhaman rail lines are your second home. You recognize the familiar tea vendors, the morning newspaper debates in the vendor coach, and the mad sprint across Platform 1 at Bandel.
      </p>
      <p class="text-base leading-relaxed text-neutral-700 mb-6">
        Here is everything I have learned about navigating the <strong>Main Line (via Bandel)</strong> versus the <strong>Chord Line (via Dankuni)</strong>, and how to choose the fastest train for your daily office run.
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Main Line vs Chord Line: Which One Should You Board?</h2>
      <div class="overflow-x-auto my-4">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-neutral-300 bg-neutral-100">
              <th class="p-2.5 font-bold">Feature</th>
              <th class="p-2.5 font-bold">Main Line (via Bandel)</th>
              <th class="p-2.5 font-bold">Chord Line (via Dankuni)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            <tr>
              <td class="p-2.5 font-semibold">Distance</td>
              <td class="p-2.5">107 km (via Hooghly riverbank)</td>
              <td class="p-2.5">95 km (straighter route)</td>
            </tr>
            <tr>
              <td class="p-2.5 font-semibold">Travel Time</td>
              <td class="p-2.5">2 hrs 10 mins (All-stop local)</td>
              <td class="p-2.5">1 hr 45 mins (Faster by 25 mins)</td>
            </tr>
            <tr>
              <td class="p-2.5 font-semibold">Key Stations</td>
              <td class="p-2.5">Serampore, Chandannagar, Bandel, Adisaptagram, Mogra, Memari</td>
              <td class="p-2.5">Bally Ghat, Dankuni, Kamarkundu, Gurap, Masagram</td>
            </tr>
            <tr>
              <td class="p-2.5 font-semibold">Frequency</td>
              <td class="p-2.5">Every 15–20 minutes (High frequency)</td>
              <td class="p-2.5">Every 30–45 minutes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">The Lifesaving Galloper Locals</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        If you want to shave 20 to 30 minutes off your daily journey, look for <strong>Galloper (Fast) EMU Locals</strong> on the timetable board at Howrah or Bandel. These trains skip small halt stations like Belur, Liluah, Hindmotor, and Rishra, running nonstop between Bally and Serampore, or Serampore and Bandel.
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Commuter Tips from 11 Years of Daily Travel</h2>
      <ul class="list-disc pl-5 space-y-2.5 text-sm text-neutral-700 mb-6">
        <li><strong>Howrah Platform Positioning:</strong> Most Barddhaman locals depart from Platforms 1 to 6 at Howrah Old Station. If you need to exit quickly towards the Howrah bus stand or ferry ghat, sit in coach numbers 4 or 5 from the front.</li>
        <li><strong>Bandel Junction Quick Bite:</strong> If you are switching trains at Bandel, grab the famous hot singara and earthen cup tea (bhaarer cha) at the Platform 1 stall — it has kept commuters alive since the 1980s!</li>
        <li><strong>Hooghly & Bandel Commuters:</strong> Bandel locals start as early as 04:00 AM. If you are heading to Howrah from Bandel or Hooghly, the 07:35 AM and 08:45 AM galloper locals are the sweet spot for 9:30 AM office arrivals.</li>
        <li><strong>UTS on Mobile:</strong> Do not buy paper tickets at ticket windows in morning rush. Open UTS at your home or rickshaw stand, book your ₹10 ticket in 5 seconds, and walk straight onto the train.</li>
      </ul>
    `,
    faqs: [
      {
        q: 'Is Chord Line faster than Main Line from Howrah to Barddhaman?',
        a: 'Yes, Chord line trains take approximately 1h 45m compared to 2h 10m on the Main line, saving about 25 minutes.',
      },
      {
        q: 'What is the local train ticket price from Howrah to Barddhaman?',
        a: 'The standard unreserved second class EMU local ticket is ₹20 to ₹25.',
      },
    ],
  },
  {
    slug: 'sealdah-suburban-railway-network-north-south-guide',
    title: 'Sealdah Suburban Network Decoded: North vs South Section Guide from a Regular Commuter',
    summary: 'Sealdah handles 1.5 million passengers every day. Here is how to navigate Sealdah North (Ranaghat/Krishnanagar) and Sealdah South (Canning/Diamond Harbour) like a seasoned local.',
    category: 'Suburban Commuter Guide',
    publishedAt: '2026-02-18',
    readTime: '6 min read',
    author: {
      name: 'Priyanka Sen',
      role: 'Daily Suburban Passenger & Educator',
    },
    keywords: [
      'Sealdah suburban railway network guide',
      'Sealdah North vs Sealdah South platforms',
      'Sealdah to Ranaghat local train timings',
      'Sealdah to Canning suburban schedule',
      'Sealdah station interchange tips',
    ],
    contentHtml: `
      <p class="text-base leading-relaxed text-neutral-700 mb-4">
        Stepping into Sealdah Station at 9:15 AM on a working day is like plunging into a river of humanity. Trains arrive every 90 seconds, thousands of passengers pour through the ticket barriers, and the announcements in Bengali, Hindi, and English never stop.
      </p>
      <p class="text-base leading-relaxed text-neutral-700 mb-6">
        If you are new to Sealdah, the first thing you must understand is that <strong>Sealdah is actually two distinct stations under one roof: Sealdah North/Main and Sealdah South</strong>. They operate on separate track networks and completely different platform groups.
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Sealdah North & Main (Platforms 1 to 14)</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        This is the colossal northern corridor stretching up towards North 24 Parganas, Nadia, and Murshidabad:
      </p>
      <ul class="list-disc pl-5 space-y-1.5 text-sm text-neutral-700 mb-6">
        <li><strong>Naihati & Ranaghat Line:</strong> Connects Dum Dum, Barrackpore, Shyamnagar, Naihati, Kalyani, and Ranaghat.</li>
        <li><strong>Krishnanagar & Shantipur Branch:</strong> Lifeline for handloom weavers and students from Nadia district.</li>
        <li><strong>Bongaon & Hasnabad Line:</strong> Runs north-east towards the international border via Barasat and Habra.</li>
      </ul>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Sealdah South Section (Platforms 15 to 21)</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        The South section is situated on an elevated concourse towards the southern wing. Trains here serve the South 24 Parganas district and the Sundarbans delta fringe:
      </p>
      <ul class="list-disc pl-5 space-y-1.5 text-sm text-neutral-700 mb-6">
        <li><strong>Ballygunge & Baruipur Junction:</strong> The mega junction where southern suburban lines bifurcate.</li>
        <li><strong>Diamond Harbour & Namkhana Line:</strong> Commuter route to coastal port towns and Kakdwip (gateway to Sagar Island).</li>
        <li><strong>Canning Branch:</strong> Direct gateway to the Sundarbans tiger reserve and coastal mangrove country.</li>
        <li><strong>Budge Budge Line:</strong> Industrial corridor serving oil terminals and manufacturing plants.</li>
      </ul>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">My Golden Rules for Sealdah Commuters</h2>
      <div class="space-y-3 text-sm text-neutral-700">
        <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
          <strong>1. Walking between North and South concourses takes 6–8 minutes:</strong> If you are transferring from a Ranaghat local to a Canning local, budget at least 10 minutes to walk across the connecting overbridge.
        </div>
        <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
          <strong>2. Watch out for Matribhoomi (Ladies Special) trains:</strong> During peak office rush, Eastern Railway operates dedicated pink-liveried Matribhoomi locals exclusively for female passengers.
        </div>
        <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
          <strong>3. Direct Metro Connection:</strong> The Sealdah Metro underground station connects right into the railway complex, letting you zip straight to Sector V or Howrah in under 20 minutes.
        </div>
      </div>
    `,
    faqs: [
      {
        q: 'Can I catch a train to Canning from Sealdah Main platforms?',
        a: 'No. All Canning and Diamond Harbour trains depart strictly from Sealdah South platforms (Platforms 15 to 21).',
      },
      {
        q: 'How long does a local train take from Sealdah to Ranaghat?',
        a: 'A regular EMU local takes approximately 1 hour 35 minutes to cover the 74 km route.',
      },
    ],
  },
  {
    slug: 'how-to-book-local-train-tickets-online-uts-app-guide',
    title: 'How to Book Local Train Tickets Online with UTS Mobile App: Commuter Tips & Geo-Fencing Secrets',
    summary: 'Never queue up at railway ticket counters again. The real commuter guide to paperless suburban ticketing, R-Wallet bonuses, and understanding the 20-metre geo-fence rule in West Bengal.',
    category: 'Ticketing & Travel Tips',
    publishedAt: '2026-02-12',
    readTime: '5 min read',
    author: {
      name: 'Arnab Das',
      role: 'Daily Train Commuter & Tech Enthusiast',
    },
    keywords: [
      'UTS on mobile ticket booking guide 2026',
      'How to book local train ticket online West Bengal',
      'UTS geo fencing distance limit',
      'UTS R-Wallet recharge bonus discount',
      'Paperless suburban train season ticket renewal',
    ],
    contentHtml: `
      <p class="text-base leading-relaxed text-neutral-700 mb-4">
        There is nothing worse than arriving at Howrah or Sealdah with five minutes to spare, only to see a 40-person queue snake around the unreserved ticket counter. You watch your train pull out of the platform while you are still clutching a ten-rupee coin in your hand.
      </p>
      <p class="text-base leading-relaxed text-neutral-700 mb-6">
        The official <strong>UTS on Mobile</strong> app developed by CRIS (Center for Railway Information Systems) eliminates ticket lines entirely. Here is how I use it every day, including how to deal with the tricky geo-fencing requirements.
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Understanding the Geo-Fencing Rule (Why Does UTS Block You?)</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        The most common complaint commuters have is: <em>"The app says I cannot book a ticket here!"</em>
      </p>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        To prevent ticketless passengers from frantically booking a ticket only after spotting a TTE (Ticket Collector) on the train, Indian Railways enforces strict GPS geo-fencing:
      </p>
      <ul class="list-disc pl-5 space-y-2 text-sm text-neutral-700 mb-6">
        <li>You <strong>CANNOT</strong> book while standing directly on the railway tracks or platform (within 20 to 50 metres of the track).</li>
        <li>You <strong>CANNOT</strong> book if you are more than 50 km away from the boarding station.</li>
        <li><strong>The Sweet Spot:</strong> Book your ticket from your home, while walking through the station parking area, or at the rickshaw stand outside the station concourse!</li>
      </ul>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">How to Get a 3% Discount Every Time (R-Wallet Hack)</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        Instead of paying via UPI or debit card for every ₹5 or ₹10 single ticket, recharge your in-app <strong>R-Wallet</strong>. Indian Railways credits a <strong>3% bonus cashback</strong> on every R-Wallet top-up. If you recharge ₹500, you get ₹515. Over a full year of daily commuting, that translates to dozens of free rides!
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Step-by-Step Ticket Booking in Under 30 Seconds</h2>
      <ol class="list-decimal pl-5 space-y-2.5 text-sm text-neutral-700 mb-6">
        <li>Open the <strong>UTS</strong> app and ensure your phone’s GPS / Location is set to High Accuracy.</li>
        <li>Select <strong>Normal Booking</strong> ➔ <strong>Book & Travel (Paperless)</strong>.</li>
        <li>Type your Depart From and Going To station (e.g., HWH to BWN).</li>
        <li>Choose Number of Passengers and Train Type (Ordinary / EMU).</li>
        <li>Select R-Wallet or UPI, tap <strong>Book Ticket</strong>.</li>
        <li>Your ticket is stored in the <strong>Show Ticket</strong> tab and works offline even if you lose mobile network inside the train!</li>
      </ol>
    `,
    faqs: [
      {
        q: 'Do I need internet access to show my ticket to the TTE?',
        a: 'No. Once booked, paperless tickets open directly from local phone storage under "Show Ticket" without an active internet connection.',
      },
      {
        q: 'Can I take a screenshot of a UTS ticket?',
        a: 'No. Screenshots are strictly disabled and considered invalid by railway ticket examiners to prevent fraud.',
      },
    ],
  },
  {
    slug: 'vande-bharat-express-routes-west-bengal-howrah-sealdah',
    title: 'Vande Bharat Express in Bengal: Timings, Stoppages, Food & Commuter Review 2026',
    summary: 'A firsthand passenger review of semi-high-speed rail across West Bengal. Howrah to NJP, Howrah to Puri, Howrah to Patna, and Sealdah to NJP schedules and comfort comparison.',
    category: 'Express Trains',
    publishedAt: '2026-02-05',
    readTime: '6 min read',
    author: {
      name: 'Subhashis Bose',
      role: 'Travel Journalist & Frequent Rail Commuter',
    },
    keywords: [
      'Vande Bharat Express West Bengal timings 2026',
      'Howrah to New Jalpaiguri Vande Bharat schedule',
      'Howrah to Puri Vande Bharat express ticket price',
      'Sealdah to NJP Vande Bharat 22309 timing',
      'Vande Bharat executive class food review',
    ],
    contentHtml: `
      <p class="text-base leading-relaxed text-neutral-700 mb-4">
        Until a couple of years ago, traveling from Kolkata up to North Bengal meant an overnight sleeper train like the Darjeeling Mail or Padatik Express. If you had an urgent meeting in Siliguri or wanted a weekend mountain escape to Darjeeling, you had to commit an entire night to the journey.
      </p>
      <p class="text-base leading-relaxed text-neutral-700 mb-6">
        With the launch of multiple 160 km/h capable <strong>Vande Bharat Express</strong> rakes out of Howrah and Sealdah, West Bengal’s intercity rail landscape has transformed. Having ridden both the North Bengal and coastal Odisha routes, here is my real passenger assessment.
      </p>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Key Vande Bharat Corridors Operating in West Bengal</h2>
      <div class="space-y-4 text-sm text-neutral-700 mb-6">
        <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          <div class="font-bold text-neutral-900 text-base mb-1">1. Howrah – New Jalpaiguri (22301 / 22302)</div>
          <p class="text-xs text-neutral-600 mb-2">Departs Howrah at 05:55 AM | Arrives NJP at 01:25 PM (7h 30m). Runs 6 days a week (except Wednesdays).</p>
          <p class="text-xs text-neutral-700"><strong>Key Stops:</strong> Bolpur Shantiniketan, Malda Town, Barsoi Junction.</p>
        </div>

        <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          <div class="font-bold text-neutral-900 text-base mb-1">2. Sealdah – New Jalpaiguri (22309 / 22310)</div>
          <p class="text-xs text-neutral-600 mb-2">Departs Sealdah at 06:10 AM | Arrives NJP at 01:40 PM. Runs 6 days a week (except Tuesdays).</p>
          <p class="text-xs text-neutral-700"><strong>Key Stops:</strong> Naihati, Bandel, Katwa, Azimganj, Jangipur Road, Malda Town, Kishanganj.</p>
        </div>

        <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          <div class="font-bold text-neutral-900 text-base mb-1">3. Howrah – Puri (22895 / 22896)</div>
          <p class="text-xs text-neutral-600 mb-2">Departs Howrah at 06:10 AM | Arrives Puri at 12:35 PM (6h 25m). Runs 6 days a week (except Thursdays).</p>
          <p class="text-xs text-neutral-700"><strong>Key Stops:</strong> Kharagpur, Balasore, Bhadrak, Jajpur Keonjhar Road, Cuttack, Bhubaneswar, Khurda Road.</p>
        </div>
      </div>

      <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">Onboard Experience: Food, Comfort & Punctuality</h2>
      <p class="text-sm leading-relaxed text-neutral-700 mb-4">
        The Chair Car (CC) seats offer generous legroom with 180-degree reclining in Executive Class (EC). The breakfast served out of Howrah includes warm luchi-alur dom or cutlet with tea and juice. Most importantly, the trains maintain over 95% on-time arrival records, easily outpacing road buses.
      </p>
    `,
    faqs: [
      {
        q: 'Does the Howrah to NJP Vande Bharat run on all days?',
        a: 'It operates 6 days a week, with Wednesday as the scheduled maintenance day.',
      },
      {
        q: 'Can I travel on Vande Bharat with an unreserved ticket?',
        a: 'No. Vande Bharat Express trains are 100% reserved chair car and executive class trains. You must book in advance via IRCTC.',
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export const getBlogPost = getBlogPostBySlug;

