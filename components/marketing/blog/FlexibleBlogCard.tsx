import { Link } from '@/lib/i18n/navigation';
import type { PublicBlogSummary } from '@/lib/blogs';

export function FlexibleBlogCard({
  post,
}: {
  post: PublicBlogSummary;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block w-full h-full flex flex-col rounded-[20px] bg-[#fffafa] p-1 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="overflow-hidden rounded-[16px] rounded-bl-[4px] rounded-br-[4px] flex-shrink-0">
        <img
          src={post.imageSrc}
          alt={post.title}
          className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-col flex-1 space-y-3 px-5 py-5">
        <h3 className="text-[20px] font-bold leading-[1.08] tracking-[-0.6px] text-[#3d2d32] group-hover:underline sm:text-[22px] line-clamp-2">
          {post.title}
        </h3>
        <p className="text-[14px] leading-6 tracking-[-0.2px] text-[#665459] flex-1 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-[14px] font-medium tracking-[-0.2px] text-[#8a767c] flex-shrink-0">
          <span>{post.date}</span>
          <span>&bull;</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
