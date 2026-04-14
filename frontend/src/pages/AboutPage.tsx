import { useState } from 'react'

import { StepRail } from '../components/landing/StepRail'

const LINKS = {
  site: 'https://saztech.org',
  tel: 'tel:+16027439126',
  github: 'https://github.com/SD170',
  linkedin: 'https://www.linkedin.com/in/sd170',
  email: 'mailto:duttasaswata7@gmail.com',
  authena: 'https://authena.xyz/',
  bnbContract: 'https://bscscan.com/address/0x7112b21b49d3bc368e88d8021a9b7d6a05284444',
  dittoBnbNftPost: 'https://x.com/Ditto__AI/status/2033165460187799699',
}

function Portrait() {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex aspect-[4/5] w-full max-w-[14rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-zinc-900/80 p-4 text-center">
        <span className="font-headline text-3xl font-extrabold tracking-tight text-primary/90">SD</span>
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Put your photo at <code className="text-zinc-400">public/saswata.jpg</code>. Same path in prod.
        </p>
      </div>
    )
  }

  return (
    <img
      src="/saswata.jpg"
      alt="Saswata Dutta"
      width={560}
      height={700}
      className="aspect-[4/5] w-full max-w-[14rem] rounded-2xl border border-white/10 object-cover shadow-lg shadow-black/40"
      onError={() => setFailed(true)}
    />
  )
}

export function AboutPage() {
  return (
    <>
      <StepRail step="03" label="Hire him" />
      <main className="mx-auto max-w-2xl px-6 py-16 md:px-12">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Saswata Dutta</p>

        <div className="md:flex md:items-start md:justify-between md:gap-10">
          <div className="min-w-0 flex-1">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-white md:text-5xl">
              I do my best work from <span className="italic text-primary">0</span> to{' '}
              <span className="italic text-primary">1</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-snug text-zinc-200 md:text-xl">
              One proof: at{' '}
              <a
                href={LINKS.authena}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-primary/50 underline-offset-2 hover:text-primary"
              >
                Authena
              </a>{' '}
              <span className="font-medium text-zinc-500">(formerly Intract)</span> we went from an idea to about{' '}
              <span className="text-primary">40 million users</span>, and the product had to stay up while we grew.
            </p>
          </div>
          <div className="mt-8 shrink-0 md:mt-0">
            <Portrait />
          </div>
        </div>

        <p className="mt-8 text-base leading-relaxed text-zinc-200">
          I like the messy early days. No playbook. Small team. The product still has to feel great for the first people who
          try it. I was the <strong className="text-white">first hire</strong> and a{' '}
          <strong className="text-white">founding engineer</strong> at{' '}
          <a
            href={LINKS.authena}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline decoration-primary/50 underline-offset-2 hover:text-primary"
          >
            Authena
          </a>
          . I worked on questing infra, OAuth from zero, CI/CD, and being on call when traffic spiked (around{' '}
          <strong className="text-white">100K RPM</strong> at the loud moments). I also did the unglamorous work so the app did
          not fall over when we grew fast.
        </p>

        <p className="mt-5 text-base leading-relaxed text-zinc-300">
          Founders I have worked with say I take ownership and I ship. I do not wait for perfect tickets. If something is
          fuzzy, I treat it like a spec we write together. I am happiest in <strong className="text-white">early startups</strong>{' '}
          where the product and the model are still moving, and where <strong className="text-white">AI</strong> is not a slide
          deck but something you wire into real flows and real users. I write a lot of{' '}
          <strong className="text-white">TypeScript</strong> and <strong className="text-white">Python</strong>. I build with
          agents, retrieval style setups, FastAPI, Node, AWS, and whatever keeps prod calm.
        </p>

        <p className="mt-5 text-base leading-relaxed text-zinc-300">
          I am at <strong className="text-white">ASU</strong> for an MS in CS (I plan to finish in 2027). I want the theory, but I
          also keep building on the side: agent workflows, Figma to code tools, side projects that still have to work if real
          people touch them.
        </p>

        <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-zinc-900/50 p-6 md:p-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Why this repo exists</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Treat this repo like a <strong className="font-medium text-zinc-200">small proposal</strong> to the founding team,
            not a clone of what you ship. I wanted a place where I could show how I think about an AI first surface, tight scope,
            and a moment that should feel special. The flow splits <em>browsing</em> from the <em>match moment</em> on purpose.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Under the hood it is <strong className="font-medium text-zinc-200">mostly an LLM</strong> for the pick and the copy.
            There is a <strong className="font-medium text-zinc-200">small retrieval slice</strong> first: classic{' '}
            <strong className="font-medium text-zinc-200">BM25</strong> style lexical ranking over bios (same family as a lot of
            &quot;RAG&quot; stacks, just no vector database in this demo). That trims the pool so the model argues over a short
            list instead of every profile.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            I obviously{' '}
            <strong className="font-medium text-zinc-200">do not have your real matching algorithm or your data</strong>, so the
            matches can miss. That is the honest tradeoff here. The point is the shape of the system and how I would work with
            you on the real version.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-black/30 px-5 py-5 md:px-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Chains, briefly</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            I have also spent years on <strong className="text-zinc-300">web3 product engineering</strong>. Multi chain flows,
            launches where RPCs affect the user experience, SDKs on npm, identity style systems with real money and real volume
            behind them. I have fixed bugs where the chain looked fine and users were still mad.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Ditto fits that picture too. You are serious about dating, and you are clearly at home on{' '}
            <strong className="text-zinc-300">BNB Chain</strong>, including{' '}
            <strong className="text-zinc-300">NFT style infra</strong>. Your code there does not have to be public for me to
            care. I saw{' '}
            <a
              href={LINKS.dittoBnbNftPost}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:text-white"
            >
              this post
            </a>{' '}
            and liked the direction. Contract for the curious:{' '}
            <a
              href={LINKS.bnbContract}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300/90 underline decoration-cyan-500/30 underline-offset-2 hover:text-cyan-200"
            >
              BscScan
            </a>
            .
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          <a href={LINKS.email} className="text-primary hover:text-white">
            Email
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            GitHub
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            LinkedIn
          </a>
          <a href={LINKS.site} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            saztech.org
          </a>
          <a href={LINKS.tel} className="hover:text-primary">
            +1 (602) 743-9126
          </a>
        </div>

        <p className="mb-2 mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
          To Ditto founders &amp; team
        </p>
        <p className="rounded-2xl border border-primary/25 bg-primary/[0.07] px-5 py-5 text-sm leading-relaxed text-zinc-200 md:px-6">
          How I like to work: small founding style teams, messy 0 to 1, specs that change while we learn. I care about AI that
          ships inside a product people feel, not demos that die in a notebook. I want pairing, clear tradeoffs, and someone who
          will tell me when the match quality is wrong so we fix it. I have web3 production miles too if that ever matters for
          you, but most of what I want next is this lane: <strong className="text-white">early product, AI, and craft</strong>.
          If that sounds like your room, I would love a <strong className="text-white">conversation</strong>, and if it fits, an{' '}
          <strong className="text-white">interview</strong>. Full time, contract, or one hard tech pass with whoever sets the
          bar. Email me or DM me. I will show up ready and easy to work with.
        </p>

        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-zinc-600">
          Saswata Dutta · portfolio demo · Ditto AI
        </p>
      </main>
    </>
  )
}
