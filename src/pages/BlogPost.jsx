import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BlogPostLayout from "../components/blog/BlogPostLayout";
import EmbeddedBookCard from "../components/blog/EmbeddedBookCard";
import ReadingRoomTeaser from "../components/blog/ReadingRoomTeaser";
import { BLOG_POSTS } from "./Blogs";
import { ArrowLeft } from "lucide-react";

// ─── Mock: does the logged-in user have an active pass? ───────────────────────
const USER_HAS_PASS = true;

// ─── Generic post body renderer ───────────────────────────────────────────────
const PostBody = ({ post }) => {
  switch (post.id) {
    case "top-fiction-2024":
      return (
        <>
          <p>
            Every year, the literary world produces a handful of novels so alive, so urgent, that they
            refuse to stay in their own pages. They spill into conversations at chai stalls, into the
            margins of notebooks, into the minds of readers who thought they had no time to read.
            2024 was one of those years.
          </p>
          <p>
            We surveyed our community of over 50,000 readers, consulted with our editorial team, and
            cross-referenced the year's critical reception to bring you this definitive list. These are
            not just "good" books. These are books that <strong>changed something</strong> in the people
            who read them.
          </p>

          <h2>1. The God of Small Things — Arundhati Roy</h2>
          <p>
            Though first published in 1997, Roy's debut novel found an entirely new generation of
            readers in 2024, propelled by a viral reading challenge and two major literary podcast
            features. The story of the Kochamma family — fractured by history, class, and an
            unforgivable love — remains as devastating and as beautiful as ever.
          </p>

          <EmbeddedBookCard
            book={post.embeddedBooks[0]}
            hasActivePass={USER_HAS_PASS}
          />

          <p>
            What makes Roy's prose so extraordinary is its refusal to be neat. Her sentences stretch
            and curl, mimicking the way memory actually works — not in chronological order, but in
            waves of sensation, returning always to the moments that hurt the most.
          </p>

          <h2>2. Midnight's Children — Salman Rushdie</h2>
          <p>
            Rushdie's Booker Prize-winning masterpiece experienced a significant cultural moment in
            2024, driven partly by renewed discussions around magical realism as a political tool. The
            novel's central conceit — children born at the exact moment of India's independence, each
            gifted with a supernatural power — has never felt more relevant.
          </p>

          <EmbeddedBookCard
            book={post.embeddedBooks[1]}
            hasActivePass={USER_HAS_PASS}
          />

          <ReadingRoomTeaser variant="inline" />

          <p>
            The remaining eight books on our list span genres from quiet domestic fiction to sprawling
            historical epics. What they share is an insistence on the full complexity of human
            experience — the messy, the contradictory, the unresolved.
          </p>
          <p>
            Because that, in the end, is what great fiction does. It doesn't simplify. It expands.
          </p>
        </>
      );

    case "interview-ruskin-bond":
      return (
        <>
          <p>
            Ruskin Bond receives us in his study in Landour, Mussoorie, where he has lived and written
            for most of his adult life. The room is exactly as you'd imagine it: books everywhere,
            a window overlooking the pine-covered hills, and on the desk, a cup of tea growing cold
            beside a half-filled notebook.
          </p>
          <p>
            At 89, Bond remains one of India's most beloved writers. His sentences have a clarity that
            feels effortless — the kind of effortlessness that only comes from decades of craft.
          </p>

          <h2>"Simple Stories Are Not Simple at All"</h2>
          <p>
            <strong>BKB:</strong> You've been writing for over six decades. Has the act of writing changed for you?
          </p>
          <p>
            <strong>Bond:</strong> Yes and no. I still sit at the same desk, pick up the same kind of pen. But what
            I notice now is that I've stopped trying to write important things. In my thirties, I
            thought I had to say something profound. Now I just want to tell a good story. And funnily
            enough, the stories that feel smallest to me often turn out to mean the most to readers.
          </p>
          <p>
            <strong>BKB:</strong> Your short fiction in particular — pieces like "The Blue Umbrella" — seems almost
            deceptively simple on the surface.
          </p>
          <p>
            <strong>Bond:</strong> That's exactly right. Simple stories are not simple at all. They're the hardest
            to write. Every word has to earn its place. You can't hide behind complexity.
          </p>

          <EmbeddedBookCard
            book={post.embeddedBooks[0]}
            hasActivePass={USER_HAS_PASS}
          />

          <ReadingRoomTeaser variant="inline" />

          <p>
            An hour later, as we stand to leave, Bond hands us a small notebook. "I write down every
            story idea I have," he says. "Most of them are useless. But every so often, one of them
            turns into something." He pauses. "That's the whole game, isn't it?"
          </p>
        </>
      );

    default:
      return (
        <>
          <p>
            {post.excerpt}
          </p>
          <p>
            This is a growing editorial. Our team is working on the full version of this article.
            In the meantime, explore our other stories or browse the catalogue to find your next read.
          </p>
          <ReadingRoomTeaser variant="inline" />
        </>
      );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
const BlogPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <p className="text-4xl mb-4">📖</p>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't find the article you're looking for.</p>
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E31E2E] text-white font-black text-sm hover:bg-red-700 transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            Back to Blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <BlogPostLayout post={post}>
          <PostBody post={post} />
        </BlogPostLayout>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
