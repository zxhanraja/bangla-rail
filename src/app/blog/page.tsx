import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blogs';
import { BookOpen, Clock, Calendar, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'West Bengal Train & Kolkata Metro Commuter Guides & Blog',
  description: 'Expert railway guides, timetable tips, Kolkata underwater metro timings, UTS ticket booking, and travel guides across West Bengal.',
  alternates: {
    canonical: 'https://banglarail.in/blog',
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Bangla Rail Commuter Guides',
    'url': 'https://banglarail.in/blog',
    'description': 'Verified transit articles, suburban local timetables, and Kolkata metro guides for West Bengal passengers.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Bangla Rail',
      'url': 'https://banglarail.in',
    },
    'blogPost': posts.map((p) => ({
      '@type': 'BlogPosting',
      'headline': p.title,
      'description': p.summary,
      'url': `https://banglarail.in/blog/${p.slug}`,
      'datePublished': p.publishedAt,
    })),
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Commuter Knowledge Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          West Bengal Rail & Kolkata Metro Travel Guides
        </h1>
        <p className="text-[#555555] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          In-depth timetables, route comparisons, smart ticketing tips, and official passenger guidelines for daily suburban and metro commuters.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white border border-[#E8E3D7] rounded-2xl p-6 hover:border-neutral-400 transition-all duration-200 shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#71717A] mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F4F1E6] font-semibold text-neutral-800">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#111111] group-hover:text-black transition-colors leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>

              <p className="text-sm text-[#555555] mt-2.5 leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-[#F0EBE0] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:translate-x-0.5 transition-transform"
              >
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Commuter Safety & Tips callout */}
      <div className="bg-[#EDE9DE] rounded-2xl p-6 border border-[#DDD7C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-[#111111]">Looking for Live Train Timetables?</h3>
            <p className="text-xs text-[#555555] mt-0.5">
              Access real-time schedules across all 556 West Bengal stations including Howrah, Sealdah, Bandel, and Barddhaman.
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18181B] text-white text-xs font-semibold hover:bg-black transition-colors shrink-0"
        >
          Open Timetable Search
        </Link>
      </div>
    </div>
  );
}
