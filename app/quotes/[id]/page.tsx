import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Footer from "@/components/Footer";
import Toolbar from "@/components/Toolbar";

import { getDatabase, Collections } from "@/lib/mongodb";
import type { Document, Filter } from "mongodb";
import { ObjectId } from "mongodb";
import ShareButton from "@/components/ShareButton";

type Quote = {
  id: string;
  text: string;
  author: string;
  category?: string;
  date?: string;
};

function idToString(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    const maybeToString = (val as { toString?: unknown }).toString;
    if (typeof maybeToString === "function") {
      return (val as { toString: () => string }).toString();
    }
  }
  return String(val);
}

async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.QUOTES);

    // First, try ObjectId lookup when the id is a valid ObjectId hex string
    let q: Document | null = null;
    try {
      if (ObjectId.isValid(id)) {
        q = (await collection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1, text: 1, author: 1, category: 1, date: 1 } })) as Document | null;
      }
    } catch (err) {
      // log and continue to fallbacks
      console.debug("ObjectId lookup failed for id:", id, err);
      q = null;
    }

    // Fallbacks: some records might store id as a string field or have _id as string
    if (!q) {
      const orConditions: Filter<Document>["$or"] = [];
      // match id field (if records use a string 'id' property)
      orConditions.push({ id });
      // match _id as string (some imports might have stored string _id)
      orConditions.push({ _id: id as unknown as Document["_id"] });

      const filter: Filter<Document> = { $or: orConditions };
      q = (await collection.findOne(filter, { projection: { _id: 1, text: 1, author: 1, category: 1, date: 1 } })) as Document | null;
    }

    if (!q) return null;
    const resolvedId = q._id ? idToString(q._id) : q.id ? idToString(q.id) : "";
    return { id: resolvedId, text: q.text as string, author: q.author as string, category: q.category as string | undefined, date: q.date as string | undefined } as Quote;
  } catch (err) {
    console.warn("getQuoteById failed", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const rawId = (resolvedParams.id || "").split("-")[0];
  const quote = await getQuoteById(rawId);
  if (!quote) return { title: "Quote not found" };

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "";
  const url = origin ? `${origin}/quotes/${quote.id}-${encodeURIComponent(quote.author.replace(/[^a-z0-9]+/gi, "-").toLowerCase())}` : undefined;

  return {
    title: `${quote.author} — Quote`,
    description: quote.text.slice(0, 160),
    openGraph: {
      title: `${quote.author} — Quote`,
      description: quote.text.slice(0, 160),
      url,
    },
    twitter: {
      title: `${quote.author} — Quote`,
      description: quote.text.slice(0, 160),
    },
  } as Metadata;
}

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const rawId = (resolvedParams.id || "").split("-")[0];
  const quote = await getQuoteById(rawId);
  if (!quote) return notFound();

  return (
    <div className="flex flex-col min-h-screen !bg-[#3B241A] !text-[#FAF0E6] font-sans selection:!bg-[#F2A7A7] selection:!text-[#3B241A]">
      {/* 1. TOOLBAR */}
      <Toolbar backHref="/quotes" navItems={["Home", "Services", "Work", "About", "Contact"]} />

      {/* 2. BACKGROUND GLOW */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] !bg-[#F2A7A7]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] !bg-[#F2A7A7]/5 rounded-full blur-[120px]" />
      </div>

      {/* 3. MAIN CONTENT */}
      <main className="flex-grow pt-32 pb-20 px-6 relative z-10">
        <div className="container mx-auto max-w-2xl">
          {/* QUOTE DETAIL SECTION */}
          <article className="p-6 md:p-8 rounded-2xl bg-[#FAF0E6]/5 backdrop-blur-md border !border-[#FAF0E6]/10 hover:border-[#F2A7A7]/30 transition-all">
            <p className="text-2xl md:text-3xl font-serif font-bold !text-[#FAF0E6] mb-6 leading-relaxed">
              &quot;{quote.text}&quot;
            </p>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 border-t !border-[#FAF0E6]/10 gap-4">
              <div>
                <div className="text-sm !text-[#F2A7A7] font-bold uppercase tracking-widest">{quote.author}</div>
                {quote.category && <div className="text-xs !text-[#FAF0E6]/50 mt-1">{quote.category}</div>}
              </div>

              <div className="flex items-center gap-3">
                <a href="/quotes" className="text-xs font-bold !text-[#F2A7A7] hover:!text-[#FAF0E6] uppercase tracking-widest transition-colors">
                  ← Back
                </a>
                <ShareButton quoteId={quote.id} title={quote.author} text={quote.text} />
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}
