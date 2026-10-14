import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, getAllBlogPosts } from '@/lib/blogs';
import { Clock, Calendar, ArrowLeft, Share2, Train, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Bangla Rail',
    };
  }

  return {
    title: `${post.title} | Bangla Rail Guides`,
    description: post.summary,
    keywords: post.keywords,
    alternates: {
      canonical: `https://banglarail.in/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `https://banglarail.in/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.summary,
    'datePublished': post.publishedAt,
    'dateModified': post.publishedAt,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://banglarail.in/blog/${post.slug}`,
    },
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Bangla Rail',
      'url': 'https://banglarail.in',
    },
    'keywords': post.keywords.join(', '),
  };

  const faqJsonLd = post.faqs ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': post.faqs.map((f) => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a,
      },
    })),
  } : null;

  return (
    <article className="max-w-4xl mx-auto py-3 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#71717A]">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link href="/blog" className="hover:text-black transition-colors">Guides & Blogs</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[#111111] font-medium truncate max-w-[200px] sm:max-w-none">{post.title}</span>
      </nav>

      {/* Article Header Card */}
      <header className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A] mb-4">
          <span className="px-3 py-1 rounded-full bg-[#F4F1E6] font-bold text-neutral-900">
            {post.category}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-[#555555] mt-3 leading-relaxed border-b border-[#E8E3D7] pb-5">
          {post.summary}
        </p>

        <div className="flex items-center justify-between pt-4 text-xs text-[#71717A]">
          <div>
            <span className="font-semibold text-neutral-900">{post.author.name}</span>
            <span className="text-neutral-500"> — {post.author.role}</span>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Guides
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <main className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-10 shadow-xs prose prose-neutral max-w-none prose-headings:font-bold prose-headings:text-[#111111] prose-p:text-[#333333] prose-p:leading-relaxed prose-li:text-[#333333]">
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </main>

      {/* FAQs section if present */}
      {post.faqs && post.faqs.length > 0 && (
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#111111] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {post.faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-[#F0EBE0] pb-4 last:border-0 last:pb-0">
                <h3 className="font-bold text-sm text-[#111111]">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-[#555555] mt-1 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Bar */}
      <div className="bg-[#EDE9DE] rounded-2xl p-6 border border-[#DDD7C8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#111111]">Need live schedule information?</h3>
          <p className="text-xs text-[#555555] mt-0.5">
            Search departure times, halt stops, and fares for your specific journey.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-[#18181B] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            Search Timetable
          </Link>
          <Link
            href="/plan"
            className="px-4 py-2 rounded-lg bg-white text-[#18181B] border border-[#DDD7C8] text-xs font-semibold hover:bg-neutral-50 transition-colors"
          >
            Route Planner
          </Link>
        </div>
      </div>
    </article>
  );
}
