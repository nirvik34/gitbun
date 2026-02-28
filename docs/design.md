
terminal landing page

<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Gitbun Docs: Getting Started</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style type="text/tailwindcss">
        :root {
            --bg-deep: #0A0A0A;
            --border-color: #1A1A1A;
            --accent-blue: #3F83F8;
            --text-muted: #A1A1AA;
        }
        body {
            background-color: var(--bg-deep);
            font-family: 'Inter', sans-serif;
            color: #EDEDED;
        }
        .jetbrains-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #262626;
            border-radius: 10px;
        }
        .prose h2 {
            @apply text-2xl font-bold mt-16 mb-6 border-b border-[#1A1A1A] pb-2 text-white;
        }
        .prose p {
            @apply text-gray-400 leading-relaxed mb-6;
        }
        .prose code {
            @apply bg-white/10 px-1.5 py-0.5 rounded text-[var(--accent-blue)] jetbrains-mono text-sm;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        border: '#1A1A1A',
                        accent: '#3F83F8',
                    }
                }
            }
        }
    </script>
</head>
<body class="antialiased">
<header class="fixed top-0 w-full z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-border">
<div class="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
<div class="flex items-center gap-8">
<a class="flex items-center gap-2" href="/">
<div class="w-8 h-8 bg-white rounded flex items-center justify-center">
<span class="material-symbols-outlined text-black text-xl font-bold">terminal</span>
</div>
<span class="font-bold text-xl tracking-tight">Gitbun</span>
</a>
<div class="hidden md:flex relative w-80 group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
<input class="w-full bg-white/5 border border-border rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent transition-colors" placeholder="Search documentation..." type="text"/>
<div class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 border border-border px-1.5 rounded">⌘K</div>
</div>
</div>
<div class="flex items-center gap-4">
<a class="text-gray-400 hover:text-white transition-colors p-2" href="#">
<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
</a>
<a class="hidden sm:block text-sm font-medium text-gray-300 hover:text-white px-4 py-2" href="#">View on GitHub</a>
<a class="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors" href="#">Get Started</a>
</div>
</div>
</header>
<div class="max-w-[1440px] mx-auto px-6 flex pt-16 min-h-screen">
<aside class="hidden lg:block w-64 fixed left-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto border-r border-border py-8 px-6">
<nav class="space-y-8">
<div>
<h5 class="text-xs font-bold text-white uppercase tracking-widest mb-4">Getting Started</h5>
<ul class="space-y-1.5">
<li><a class="text-sm text-accent font-semibold flex items-center py-1.5 px-3 -ml-3 bg-accent/10 border-r-2 border-accent rounded-l-md" href="#introduction">Introduction</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#installation">Installation</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#quick-start">Quick Start</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-bold text-white uppercase tracking-widest mb-4">Usage</h5>
<ul class="space-y-1.5">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#usage">Basic Commands</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#usage">CLI Flags</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#">Examples</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-bold text-white uppercase tracking-widest mb-4">Features</h5>
<ul class="space-y-1.5">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#features">AI Messages</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#features">Non-AI (Heuristics)</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1.5" href="#">Interactive Mode</a></li>
</ul>
</div>
</nav>
</aside>
<main class="flex-1 lg:pl-64 lg:pr-64 pt-12 pb-24">
<article class="max-w-3xl mx-auto prose">
<header class="mb-12">
<p class="text-accent text-sm font-bold tracking-widest uppercase mb-3">Guide</p>
<h1 class="text-5xl font-extrabold tracking-tight text-white mb-6">Getting Started</h1>
<p class="text-xl text-gray-400 leading-relaxed font-light">
                        Gitbun is an open-source AI CLI tool that streamlines your git workflow by generating intelligent commit messages instantly.
                    </p>
</header>
<section id="introduction">
<h2>Introduction</h2>
<p>
                        Gitbun generates intelligent commit messages from staged diffs using AI or heuristics. It analyzes your code changes to understand the intent and scope, ensuring your commit history remains clean, professional, and descriptive without the manual effort.
                    </p>
</section>
<section id="installation">
<h2>Installation</h2>
<p>Install Gitbun globally using your favorite package manager to access it from any repository.</p>
<div class="space-y-4 my-8">
<div class="relative group">
<div class="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
<div class="relative bg-[#0D0D0D] border border-border rounded-xl overflow-hidden">
<div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-border">
<span class="text-[10px] jetbrains-mono text-gray-500 uppercase">Global Install</span>
<span class="material-symbols-outlined text-sm text-gray-500 cursor-pointer hover:text-white">content_copy</span>
</div>
<div class="p-5 jetbrains-mono text-sm">
<span class="text-accent"># Install globally via npm</span><br/>
<span class="text-white">npm install -g gitbun</span>
</div>
</div>
</div>
<div class="relative group">
<div class="relative bg-[#0D0D0D] border border-border rounded-xl overflow-hidden">
<div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-border">
<span class="text-[10px] jetbrains-mono text-gray-500 uppercase">Direct Execution</span>
<span class="material-symbols-outlined text-sm text-gray-500 cursor-pointer hover:text-white">content_copy</span>
</div>
<div class="p-5 jetbrains-mono text-sm">
<span class="text-accent"># Or run without installing</span><br/>
<span class="text-white">npx gitbun</span>
</div>
</div>
</div>
</div>
</section>
<section id="quick-start">
<h2>Quick Start</h2>
<p>Get your first AI-generated commit in three simple steps:</p>
<div class="space-y-6 my-8">
<div class="flex gap-4">
<div class="flex-none w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">1</div>
<div>
<h4 class="text-white font-bold mb-1">Stage your changes</h4>
<p class="text-sm text-gray-400 mb-2">Add the files you want to include in your commit.</p>
<code class="text-xs">git add .</code>
</div>
</div>
<div class="flex gap-4">
<div class="flex-none w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">2</div>
<div>
<h4 class="text-white font-bold mb-1">Run Gitbun</h4>
<p class="text-sm text-gray-400 mb-2">Analyze your diff and generate a message.</p>
<code class="text-xs">gitbun</code>
</div>
</div>
<div class="flex gap-4">
<div class="flex-none w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">3</div>
<div>
<h4 class="text-white font-bold mb-1">Confirm and Commit</h4>
<p class="text-sm text-gray-400 mb-2">Review the generated message and commit.</p>
<code class="text-xs">git commit -m "..."</code>
</div>
</div>
</div>
</section>
<section id="usage">
<h2>Usage</h2>
<p>Control how Gitbun generates your messages using the following CLI flags:</p>
<div class="my-8 overflow-hidden border border-border rounded-xl">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-white/5 border-b border-border">
<th class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Flag</th>
<th class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Description</th>
</tr>
</thead>
<tbody class="divide-y divide-border">
<tr>
<td class="px-6 py-4 jetbrains-mono text-sm text-accent">--ai</td>
<td class="px-6 py-4 text-sm text-gray-400">Force use of LLM for message generation (Default).</td>
</tr>
<tr>
<td class="px-6 py-4 jetbrains-mono text-sm text-accent">--no-ai</td>
<td class="px-6 py-4 text-sm text-gray-400">Use local heuristic summarizers (offline friendly).</td>
</tr>
<tr>
<td class="px-6 py-4 jetbrains-mono text-sm text-accent">--interactive</td>
<td class="px-6 py-4 text-sm text-gray-400">Open a CLI prompt to choose between multiple suggestions.</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="features">
<h2>Features</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
<div class="p-6 bg-white/5 border border-border rounded-xl hover:border-accent/50 transition-colors">
<span class="material-symbols-outlined text-accent mb-4 text-3xl">psychology</span>
<h4 class="font-bold text-white mb-2">AI-Powered</h4>
<p class="text-sm text-gray-400 mb-0 leading-relaxed">Advanced LLM support (GPT-4o, Claude) to understand complex logic changes and refactors.</p>
</div>
<div class="p-6 bg-white/5 border border-border rounded-xl hover:border-accent/50 transition-colors">
<span class="material-symbols-outlined text-accent mb-4 text-3xl">offline_bolt</span>
<h4 class="font-bold text-white mb-2">Non-AI (Heuristics)</h4>
<p class="text-sm text-gray-400 mb-0 leading-relaxed">High-performance rule-based summarization for fast, offline, and privacy-focused workflows.</p>
</div>
</div>
</section>
<div class="mt-24 pt-8 border-t border-border flex justify-between items-center">
<div class="text-sm text-gray-500">Updated Dec 20, 2024</div>
<a class="flex items-center gap-2 text-accent hover:underline font-semibold" href="#">
                        Next: Configuration
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
</article>
</main>
<aside class="hidden xl:block w-64 fixed right-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto py-12 px-8">
<h5 class="text-xs font-bold text-white uppercase tracking-widest mb-6">On this page</h5>
<ul class="space-y-4 text-sm">
<li><a class="text-accent border-l-2 border-accent pl-4 block font-medium" href="#introduction">Introduction</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#installation">Installation</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#quick-start">Quick Start</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#usage">Usage Flags</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#features">Key Features</a></li>
</ul>
<div class="mt-16 pt-12 border-t border-border">
<div class="bg-accent/5 border border-accent/20 rounded-xl p-5">
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-accent text-sm">info</span>
<p class="text-[10px] text-accent font-bold tracking-widest uppercase">Quick Tip</p>
</div>
<p class="text-xs text-gray-400 leading-relaxed">Try <code class="text-white jetbrains-mono bg-white/5 px-1 rounded">gitbun --amend</code> to rewrite your last commit message with AI.</p>
</div>
</div>
</aside>
</div>
<footer class="lg:pl-64 border-t border-border bg-[#0A0A0A]">
<div class="max-w-4xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
<div class="space-y-4">
<div class="flex items-center gap-2">
<div class="w-6 h-6 bg-white rounded flex items-center justify-center">
<span class="material-symbols-outlined text-black text-xs font-bold">terminal</span>
</div>
<span class="font-bold text-sm tracking-tight text-white">Gitbun</span>
</div>
<div class="text-gray-500 text-xs jetbrains-mono">
                    Built by developers, for developers. © 2024
                </div>
</div>
<div class="flex gap-12">
<div class="space-y-3">
<p class="text-[10px] font-bold text-white uppercase tracking-widest">Resources</p>
<ul class="space-y-2 text-xs text-gray-500 jetbrains-mono">
<li><a class="hover:text-white transition-colors" href="#">Documentation</a></li>
<li><a class="hover:text-white transition-colors" href="#">Changelog</a></li>
<li><a class="hover:text-white transition-colors" href="#">GitHub</a></li>
</ul>
</div>
<div class="space-y-3">
<p class="text-[10px] font-bold text-white uppercase tracking-widest">Community</p>
<ul class="space-y-2 text-xs text-gray-500 jetbrains-mono">
<li><a class="hover:text-white transition-colors" href="#">Twitter / X</a></li>
<li><a class="hover:text-white transition-colors" href="#">Discord</a></li>
<li><a class="hover:text-white transition-colors" href="#">License</a></li>
</ul>
</div>
</div>
</div>
</footer>

</body></html>



config and dev page
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Gitbun Docs: Config &amp; Dev</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style type="text/tailwindcss">
        :root {
            --bg-deep: #0A0A0A;
            --border-color: #1A1A1A;
            --accent-blue: #3F83F8;
            --text-muted: #A1A1AA;
        }
        body {
            background-color: var(--bg-deep);
            font-family: 'Inter', sans-serif;
            color: #EDEDED;
            overflow-x: hidden;
        }
        .jetbrains-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        .sidebar-link-active {
            color: var(--accent-blue);
            background: rgba(63, 131, 248, 0.1);
            border-right: 2px solid var(--accent-blue);
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #262626;
            border-radius: 10px;
        }
        .prose h2 {
            @apply text-2xl font-bold mt-12 mb-6 border-b border-[#1A1A1A] pb-2 text-white;
        }
        .prose h3 {
            @apply text-lg font-semibold mt-8 mb-4 text-white flex items-center gap-2;
        }
        .prose p {
            @apply text-gray-400 leading-relaxed mb-6;
        }
        .prose strong {
            @apply text-white font-medium;
        }
        .prose ul {
            @apply mb-6;
        }
        .prose li {
            @apply text-gray-400 mb-2;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        border: '#1A1A1A',
                        indigo: {
                            glow: '#3F83F8',
                        },
                    }
                }
            }
        }
    </script>
</head>
<body class="antialiased">
<header class="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-border">
<div class="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
<div class="flex items-center gap-8">
<a class="flex items-center gap-2" href="/">
<div class="w-7 h-7 bg-white rounded flex items-center justify-center">
<span class="material-symbols-outlined text-black text-lg">terminal</span>
</div>
<span class="font-bold text-lg tracking-tight">Gitbun</span>
</a>
<div class="hidden md:flex relative w-64 group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
<input class="w-full bg-white/5 border border-border rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-glow transition-colors" placeholder="Search documentation..." type="text"/>
<div class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 border border-border px-1.5 rounded">⌘K</div>
</div>
</div>
<div class="flex items-center gap-6">
<a class="text-gray-400 hover:text-white transition-colors" href="#">
<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
</a>
<a class="text-gray-400 hover:text-white transition-colors" href="#">
<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
</a>
</div>
</div>
</header>
<div class="max-w-[1440px] mx-auto px-6 flex pt-16 min-h-screen">
<aside class="hidden lg:block w-64 fixed left-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto border-r border-border py-8 px-6">
<nav class="space-y-8">
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Getting Started</h5>
<ul class="space-y-2">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Introduction</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Installation</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Quick Start</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Guides</h5>
<ul class="space-y-2">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Usage</a></li>
<li><a class="text-sm text-indigo-glow font-medium flex items-center py-1" href="#">Configuration</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Custom Prompts</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Development</h5>
<ul class="space-y-2">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Contributing</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Testing</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">CI/CD Workflow</a></li>
</ul>
</div>
</nav>
</aside>
<main class="flex-1 lg:pl-64 lg:pr-64 pt-12 pb-24">
<article class="max-w-3xl mx-auto prose">
<header class="mb-12">
<p class="text-indigo-glow text-sm font-semibold mb-2">Guides &amp; Development</p>
<h1 class="text-4xl font-extrabold tracking-tight text-white mb-4">Configuration &amp; Dev</h1>
<p class="text-xl text-gray-400 leading-relaxed font-light">
                    Learn how to fine-tune Gitbun for your workflow and contribute to the core CLI engine.
                </p>
</header>
<section id="configuration">
<h2>Configuration</h2>
<p>
                    Gitbun is configured via a <code class="bg-white/10 px-1.5 py-0.5 rounded text-indigo-glow jetbrains-mono text-sm">.gitbunrc</code> file located in your project root or home directory. This JSON file controls AI behavior, backend preferences, and output formatting.
                </p>
<div class="relative group my-8">
<div class="absolute -inset-1 bg-gradient-to-r from-indigo-glow/20 to-blue-600/20 rounded-xl blur-sm"></div>
<div class="relative bg-[#0D0D0D] border border-border rounded-xl overflow-hidden">
<div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-border">
<span class="text-[10px] jetbrains-mono text-gray-500 uppercase">.gitbunrc</span>
<button class="text-gray-500 hover:text-white transition-colors">
<span class="material-symbols-outlined text-sm">content_copy</span>
</button>
</div>
<div class="p-5 jetbrains-mono text-sm">
<pre class="text-white"><span class="text-indigo-glow">{</span>
  <span class="text-blue-400">"useAI"</span>: <span class="text-orange-400">true</span>,
  <span class="text-blue-400">"backend"</span>: <span class="text-green-400">"local"</span>,
  <span class="text-blue-400">"model"</span>: <span class="text-green-400">"llama2"</span>,
  <span class="text-blue-400">"maxTokens"</span>: <span class="text-orange-400">500</span>,
  <span class="text-blue-400">"temperature"</span>: <span class="text-orange-400">0.7</span>
<span class="text-indigo-glow">}</span></pre>
</div>
</div>
</div>
</section>
<section id="ai-backends">
<h2>AI Backends</h2>
<p>Gitbun is designed to be provider-agnostic. You can toggle between high-performance remote APIs or private, local LLMs.</p>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
<div class="p-6 bg-white/5 border border-border rounded-xl">
<div class="flex items-center gap-3 mb-4">
<span class="material-symbols-outlined text-indigo-glow">terminal</span>
<h4 class="font-bold text-white">Local LLM (Ollama)</h4>
</div>
<p class="text-sm text-gray-400 mb-4">Ideal for offline work and maximum privacy. Supports Llama 3, Mistral, and more.</p>
<div class="text-[11px] jetbrains-mono bg-black p-2 rounded border border-border text-gray-500">
                            backend: "local"
                        </div>
</div>
<div class="p-6 bg-white/5 border border-border rounded-xl">
<div class="flex items-center gap-3 mb-4">
<span class="material-symbols-outlined text-indigo-glow">cloud</span>
<h4 class="font-bold text-white">Remote APIs</h4>
</div>
<p class="text-sm text-gray-400 mb-4">Connect to OpenAI for the most sophisticated analysis and reasoning.</p>
<div class="text-[11px] jetbrains-mono bg-black p-2 rounded border border-border text-gray-500">
                            backend: "openai"
                        </div>
</div>
</div>
<h3>Environment Variables</h3>
<p>For security, API keys should be stored in your environment rather than the config file:</p>
<div class="bg-black border border-border rounded-lg p-4 jetbrains-mono text-sm mb-6">
<div class="text-gray-500 mb-1"># .bashrc or .zshrc</div>
<div class="text-white">export <span class="text-indigo-glow">OPENAI_API_KEY</span>="sk-..."</div>
</div>
</section>
<section id="development">
<h2>Development</h2>
<p>Gitbun is built with Node.js and TypeScript. We welcome contributions to improve our summarization algorithms and CLI features.</p>
<h3>Contributing Workflow</h3>
<ul class="list-disc pl-6 space-y-2 mb-8">
<li><strong>Fork &amp; Clone:</strong> Start by forking the repository and cloning it locally.</li>
<li><strong>Feature Branch:</strong> Create a branch following the naming convention <code class="text-xs bg-white/5 px-1 rounded">feat/your-feature</code>.</li>
<li><strong>Pull Request:</strong> Submit a PR with a detailed description of changes.</li>
</ul>
<h3>Testing</h3>
<p>Ensure all tests pass before submitting your contribution. We use Vitest for unit and integration testing.</p>
<div class="bg-[#0D0D0D] border border-border rounded-xl p-5 jetbrains-mono text-sm mb-8">
<div class="flex items-center gap-2 mb-2">
<span class="text-indigo-glow">$</span> <span class="text-white">npm test</span>
</div>
<div class="flex items-center gap-2">
<span class="text-indigo-glow">$</span> <span class="text-white">npm run test:watch</span>
</div>
</div>
<h3>CI/CD &amp; Tooling</h3>
<p>We maintain a high bar for code quality using automated workflows:</p>
<div class="space-y-4">
<div class="flex items-start gap-4 p-4 border border-border rounded-lg">
<span class="material-symbols-outlined text-gray-500">conversion_path</span>
<div>
<p class="text-white font-medium mb-1 text-sm">Semantic Release</p>
<p class="text-xs text-gray-400">Automated versioning and changelog generation based on commit messages.</p>
</div>
</div>
<div class="flex items-start gap-4 p-4 border border-border rounded-lg">
<span class="material-symbols-outlined text-gray-500">lock</span>
<div>
<p class="text-white font-medium mb-1 text-sm">Husky &amp; lint-staged</p>
<p class="text-xs text-gray-400">Pre-commit hooks to ensure formatting and linting rules are met.</p>
</div>
</div>
<div class="flex items-start gap-4 p-4 border border-border rounded-lg">
<span class="material-symbols-outlined text-gray-500">rocket_launch</span>
<div>
<p class="text-white font-medium mb-1 text-sm">GitHub Actions</p>
<p class="text-xs text-gray-400">Continuous integration for automated testing across multiple OS environments.</p>
</div>
</div>
</div>
</section>
<div class="mt-20 pt-8 border-t border-border flex justify-between items-center">
<a class="flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors" href="#">
<span class="material-symbols-outlined text-sm">arrow_back</span>
                    Previous: Usage
                </a>
<a class="flex items-center gap-2 text-indigo-glow hover:underline font-medium" href="#">
                    Next: Custom Prompts
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
</article>
</main>
<aside class="hidden xl:block w-64 fixed right-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto py-12 px-8">
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">On this page</h5>
<ul class="space-y-3 text-sm">
<li><a class="text-indigo-glow border-l border-indigo-glow pl-4 block" href="#configuration">Configuration</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#ai-backends">AI Backends</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#development">Development</a></li>
</ul>
<div class="mt-12 pt-12 border-t border-border">
<div class="bg-indigo-glow/10 border border-indigo-glow/20 rounded-xl p-4">
<p class="text-xs text-indigo-glow font-bold mb-2">DEV TIP</p>
<p class="text-xs text-gray-400 leading-normal">Run <code class="text-white jetbrains-mono">npm link</code> to test your local changes globally.</p>
</div>
</div>
</aside>
</div>
<footer class="lg:pl-64 border-t border-border bg-[#0A0A0A]">
<div class="max-w-3xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
<div class="text-gray-500 text-xs jetbrains-mono">
            © 2024 Gitbun. Built for developers.
        </div>
<div class="flex gap-8 text-xs text-gray-500 jetbrains-mono">
<a class="hover:text-white transition-colors" href="#">Community</a>
<a class="hover:text-white transition-colors" href="#">Contributing</a>
<a class="hover:text-white transition-colors" href="#">License</a>
</div>
</div>
</footer>

</body></html>


cli reference page
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Gitbun Docs: API Reference</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style type="text/tailwindcss">
        :root {
            --bg-deep: #0A0A0A;
            --border-color: #1A1A1A;
            --accent-blue: #3F83F8;
            --text-muted: #A1A1AA;
        }
        body {
            background-color: var(--bg-deep);
            font-family: 'Inter', sans-serif;
            color: #EDEDED;
            overflow-x: hidden;
        }
        .jetbrains-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #262626;
            border-radius: 10px;
        }
        .prose h2 {
            @apply text-2xl font-bold mt-12 mb-4 border-b border-[#1A1A1A] pb-2;
        }
        .prose p {
            @apply text-gray-400 leading-relaxed mb-6;
        }
        table {
            @apply w-full border-collapse text-sm text-left;
        }
        th {
            @apply py-3 px-4 border-b border-border text-white font-semibold;
        }
        td {
            @apply py-3 px-4 border-b border-border text-gray-400;
        }
        tr:hover td {
            @apply bg-white/5;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        border: '#1A1A1A',
                        indigo: {
                            glow: '#3F83F8',
                        },
                    }
                }
            }
        }
    </script>
</head>
<body class="antialiased">
<header class="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-border">
<div class="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
<div class="flex items-center gap-8">
<a class="flex items-center gap-2" href="/">
<div class="w-7 h-7 bg-white rounded flex items-center justify-center">
<span class="material-symbols-outlined text-black text-lg">terminal</span>
</div>
<span class="font-bold text-lg tracking-tight">Gitbun</span>
</a>
<div class="hidden md:flex relative w-64 group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
<input class="w-full bg-white/5 border border-border rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-glow transition-colors" placeholder="Search documentation..." type="text"/>
<div class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 border border-border px-1.5 rounded">⌘K</div>
</div>
</div>
<div class="flex items-center gap-6">
<a class="text-gray-400 hover:text-white transition-colors" href="#">
<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
</a>
</div>
</div>
</header>
<div class="max-w-[1440px] mx-auto px-6 flex pt-16 min-h-screen">
<aside class="hidden lg:block w-64 fixed left-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto border-r border-border py-8 px-6">
<nav class="space-y-8">
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Getting Started</h5>
<ul class="space-y-2">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Introduction</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Installation</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Quick Start</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">API Reference</h5>
<ul class="space-y-2">
<li><a class="text-sm text-indigo-glow font-medium flex items-center py-1" href="#">CLI Reference</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Configuration Options</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Exit Codes</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Core Concepts</h5>
<ul class="space-y-2">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">AI Models</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Privacy</a></li>
</ul>
</div>
</nav>
</aside>
<main class="flex-1 lg:pl-64 lg:pr-64 pt-12 pb-24">
<article class="max-w-3xl mx-auto prose">
<header class="mb-12">
<p class="text-indigo-glow text-sm font-semibold mb-2">Reference</p>
<h1 class="text-4xl font-extrabold tracking-tight text-white mb-4">CLI Reference</h1>
<p class="text-xl text-gray-400 leading-relaxed font-light">
                    Comprehensive documentation for the Gitbun command-line interface, its flags, and expected behaviors.
                </p>
</header>
<section id="usage">
<h2 class="text-white">Usage</h2>
<div class="relative group my-8">
<div class="absolute -inset-1 bg-gradient-to-r from-indigo-glow to-blue-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
<div class="relative bg-[#0D0D0D] border border-border rounded-xl overflow-hidden">
<div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-border">
<span class="text-[10px] jetbrains-mono text-gray-500 uppercase">CLI</span>
<button class="text-gray-500 hover:text-white transition-colors">
<span class="material-symbols-outlined text-sm">content_copy</span>
</button>
</div>
<div class="p-5 jetbrains-mono text-sm">
<span class="text-indigo-glow">gitbun</span> <span class="text-white">[options]</span>
</div>
</div>
</div>
</section>
<section id="options">
<h2 class="text-white">Options</h2>
<div class="overflow-x-auto border border-border rounded-xl mt-6">
<table>
<thead class="bg-white/5">
<tr>
<th>Option</th>
<th>Description</th>
<th>Default</th>
</tr>
</thead>
<tbody>
<tr>
<td class="jetbrains-mono text-indigo-glow">--ai</td>
<td>Force the use of AI for message generation, bypassing local summarizers.</td>
<td class="jetbrains-mono">true</td>
</tr>
<tr>
<td class="jetbrains-mono text-indigo-glow">--no-ai</td>
<td>Disable AI-powered generation and use the basic local summarizer.</td>
<td class="jetbrains-mono">false</td>
</tr>
<tr>
<td class="jetbrains-mono text-indigo-glow">--interactive, -i</td>
<td>Prompt the user for manual confirmation and edits before committing.</td>
<td class="jetbrains-mono">true</td>
</tr>
<tr>
<td class="jetbrains-mono text-indigo-glow">--help, -h</td>
<td>Display help information about the command and available options.</td>
<td class="jetbrains-mono">-</td>
</tr>
<tr>
<td class="jetbrains-mono text-indigo-glow">--version, -v</td>
<td>Print the current version of the Gitbun CLI.</td>
<td class="jetbrains-mono">-</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="exit-codes">
<h2 class="text-white">Exit Codes</h2>
<p>Gitbun returns the following exit codes to signal success or specific error conditions:</p>
<ul class="list-none space-y-4 text-gray-400">
<li class="flex gap-4">
<span class="jetbrains-mono text-white bg-white/10 px-2 py-0.5 rounded min-w-[32px] text-center">0</span>
<span><strong>Success:</strong> The operation completed successfully and the commit was recorded.</span>
</li>
<li class="flex gap-4">
<span class="jetbrains-mono text-white bg-white/10 px-2 py-0.5 rounded min-w-[32px] text-center">1</span>
<span><strong>General Error:</strong> An unexpected error occurred within the CLI.</span>
</li>
<li class="flex gap-4">
<span class="jetbrains-mono text-white bg-white/10 px-2 py-0.5 rounded min-w-[32px] text-center">2</span>
<span><strong>API Error:</strong> The AI provider returned an error (e.g., rate limited or timeout).</span>
</li>
<li class="flex gap-4">
<span class="jetbrains-mono text-white bg-white/10 px-2 py-0.5 rounded min-w-[32px] text-center">130</span>
<span><strong>User Cancelled:</strong> The operation was interrupted by the user (Ctrl+C).</span>
</li>
</ul>
</section>
<section id="default-behaviors">
<h2 class="text-white">Default Behaviors</h2>
<p>
                    By default, Gitbun will automatically stage untracked files if no files are currently in the staging area. This can be configured via the <code class="bg-white/10 px-1.5 py-0.5 rounded text-indigo-glow jetbrains-mono text-sm">autoStage</code> setting in your config file.
                </p>
<p>
                    If multiple providers are configured, Gitbun follows a priority-based fallback logic: 
                    <span class="text-white font-medium">Remote AI → Local LLM → Basic Regex Summarizer</span>.
                </p>
</section>
<div class="mt-20 pt-8 border-t border-border flex justify-between items-center">
<a class="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium" href="#">
<span class="material-symbols-outlined text-sm">arrow_back</span>
                    Previous: Usage
                </a>
<a class="flex items-center gap-2 text-indigo-glow hover:underline font-medium text-sm" href="#">
                    Next: Configuration
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
</article>
</main>
<aside class="hidden xl:block w-64 fixed right-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto py-12 px-8">
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">On this page</h5>
<ul class="space-y-3 text-sm">
<li><a class="text-indigo-glow border-l border-indigo-glow pl-4 block" href="#usage">Usage</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#options">Options</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#exit-codes">Exit Codes</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors" href="#default-behaviors">Default Behaviors</a></li>
</ul>
<div class="mt-12 pt-12 border-t border-border">
<div class="bg-indigo-glow/10 border border-indigo-glow/20 rounded-xl p-4">
<p class="text-xs text-indigo-glow font-bold mb-2">HEADS UP</p>
<p class="text-xs text-gray-400 leading-normal">The <code class="text-white jetbrains-mono">--ai</code> flag is enabled by default. Use <code class="text-white jetbrains-mono">--no-ai</code> for privacy-sensitive environments.</p>
</div>
</div>
</aside>
</div>
<footer class="lg:pl-64 border-t border-border bg-[#0A0A0A]">
<div class="max-w-3xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
<div class="text-gray-500 text-xs jetbrains-mono flex items-center gap-4">
<span>© 2024 Gitbun.</span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[10px]">balance</span>
                MIT License
            </span>
</div>
<div class="flex gap-8 text-xs text-gray-500 jetbrains-mono">
<a class="hover:text-white transition-colors flex items-center gap-1" href="#">
<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                GitHub
            </a>
<a class="hover:text-white transition-colors" href="#">Community</a>
<a class="hover:text-white transition-colors" href="#">Contributing</a>
</div>
</div>
</footer>

</body></html>


frequently asked question page

<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Gitbun Docs - FAQ &amp; Troubleshooting</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style type="text/tailwindcss">
        :root {
            --bg-deep: #0A0A0A;
            --border-color: #1A1A1A;
            --accent-blue: #3F83F8;
            --text-muted: #A1A1AA;
        }
        body {
            background-color: var(--bg-deep);
            font-family: 'Inter', sans-serif;
            color: #EDEDED;
            overflow-x: hidden;
        }
        .jetbrains-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        .sidebar-link-active {
            color: var(--accent-blue);
            background: rgba(63, 131, 248, 0.1);
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #262626;
            border-radius: 10px;
        }
        .prose h2 {
            @apply text-2xl font-bold mt-12 mb-6 border-b border-[#1A1A1A] pb-2 text-white;
        }
        .prose h3 {
            @apply text-lg font-semibold mt-8 mb-3 text-white flex items-center gap-2;
        }
        .prose p {
            @apply text-gray-400 leading-relaxed mb-6;
        }
        details > summary {
            list-style: none;
        }
        details > summary::-webkit-details-marker {
            display: none;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        border: '#1A1A1A',
                        indigo: {
                            glow: '#3F83F8',
                        },
                    }
                }
            }
        }
    </script>
</head>
<body class="antialiased">
<header class="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-border">
<div class="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
<div class="flex items-center gap-8">
<a class="flex items-center gap-2" href="/">
<div class="w-7 h-7 bg-white rounded flex items-center justify-center">
<span class="material-symbols-outlined text-black text-lg">terminal</span>
</div>
<span class="font-bold text-lg tracking-tight">Gitbun</span>
</a>
<div class="hidden md:flex relative w-64 group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
<input class="w-full bg-white/5 border border-border rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-glow transition-colors" placeholder="Search documentation..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<a href="https://www.npmjs.com/package/gitbun" target="_blank">
<img alt="npm badge" class="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHR5qd7sMXQrNVqVRdfLcJuBck9J8iXIByAn7ZjZw1OGZV_TVWeURWxIy_qKR8hxkPWcQ2G4ChZnZmIOxQS2pyOwVjrtRwv5ka9AthopcTZfYf0X_4VyLltB97h1TALAd5Vy-11kmCUGxQ8F88nVbNEPeSYAiX35rJSqKEYhFUHlndgkHsGX6yY3PK5O6CnsDIu8dp3SV24X0e8GRGCUZLlGPCsO4jnYdPxCfolGc8Y2osrUnp21sJF3TNvjupDGSNremK5CwwAcI4"/>
</a>
<a class="text-gray-400 hover:text-white transition-colors" href="#">
<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
</a>
</div>
</div>
</header>
<div class="max-w-[1440px] mx-auto px-6 flex pt-16 min-h-screen">
<aside class="hidden lg:block w-64 fixed left-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto border-r border-border py-8 px-6">
<nav class="space-y-8">
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Getting Started</h5>
<ul class="space-y-2">
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Introduction</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Installation</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Quick Start</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Resources</h5>
<ul class="space-y-2">
<li><a class="text-sm text-indigo-glow font-medium flex items-center py-1" href="#">FAQ &amp; Help</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Changelog</a></li>
<li><a class="text-sm text-gray-400 hover:text-white transition-colors flex items-center py-1" href="#">Community</a></li>
</ul>
</div>
</nav>
</aside>
<main class="flex-1 lg:pl-64 lg:pr-64 pt-12 pb-24">
<article class="max-w-3xl mx-auto prose">
<header class="mb-12">
<p class="text-indigo-glow text-sm font-semibold mb-2">Help Center</p>
<h1 class="text-4xl font-extrabold tracking-tight text-white mb-4">Frequently Asked Questions</h1>
<p class="text-xl text-gray-400 leading-relaxed font-light">
                    Everything you need to know about Gitbun and how to resolve common issues.
                </p>
</header>
<section id="troubleshooting">
<h2>Troubleshooting</h2>
<div class="space-y-4">
<details class="group bg-white/5 border border-border rounded-xl transition-all duration-200">
<summary class="flex items-center justify-between p-4 cursor-pointer">
<h3 class="mt-0 mb-0 font-medium text-base">Error: "No staged changes found"</h3>
<span class="material-symbols-outlined text-gray-500 group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-4 pb-4">
<p class="text-sm mb-0">Gitbun only analyzes files that are currently in the git staging area. Make sure you run <code class="text-indigo-glow jetbrains-mono bg-white/5 px-1 rounded">git add .</code> before running <code class="text-indigo-glow jetbrains-mono bg-white/5 px-1 rounded">gitbun</code>.</p>
</div>
</details>
<details class="group bg-white/5 border border-border rounded-xl transition-all duration-200">
<summary class="flex items-center justify-between p-4 cursor-pointer">
<h3 class="mt-0 mb-0 font-medium text-base">Backend not configured correctly</h3>
<span class="material-symbols-outlined text-gray-500 group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-4 pb-4">
<p class="text-sm mb-0">This usually happens when your API key is missing or expired. Verify your <code class="jetbrains-mono text-xs">.gitbunrc</code> or run <code class="jetbrains-mono text-xs text-indigo-glow">gitbun auth login</code> to re-authenticate with your AI provider.</p>
</div>
</details>
<details class="group bg-white/5 border border-border rounded-xl transition-all duration-200">
<summary class="flex items-center justify-between p-4 cursor-pointer">
<h3 class="mt-0 mb-0 font-medium text-base">npm publish issues</h3>
<span class="material-symbols-outlined text-gray-500 group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-4 pb-4">
<p class="text-sm mb-0">If you're integrating Gitbun into a CI/CD pipeline and encounter 403 errors, ensure your <code class="jetbrains-mono text-xs">NPM_TOKEN</code> has the correct scopes. Gitbun requires read permissions for dependency resolution.</p>
</div>
</details>
</div>
</section>
<section id="common-questions">
<h2>Common Questions</h2>
<div class="space-y-8">
<div>
<h3 class="text-indigo-glow">Does it require internet?</h3>
<p>Yes, by default Gitbun uses remote AI models (like GPT-4o) to process diffs and generate summaries. An active internet connection is required to communicate with these APIs.</p>
</div>
<div>
<h3 class="text-indigo-glow">Can I use it offline?</h3>
<p>Currently, the core summarization requires a cloud backend. However, we are testing an "Offline Mode" which uses local Ollama or LlamaEdge instances. This feature is in early beta and can be toggled in your config via <code class="jetbrains-mono text-xs">provider: "local"</code>.</p>
</div>
<div>
<h3 class="text-indigo-glow">Is it safe for large diffs?</h3>
<p>Gitbun implements "Smart Truncation." If a diff exceeds the context window of the AI model, Gitbun intelligently focuses on file names, structural changes, and key logic updates while skipping boilerplate or lockfile noise to ensure a high-quality summary without crashing.</p>
</div>
<div>
<h3 class="text-indigo-glow">What about sensitive data?</h3>
<p>We provide a <code class="jetbrains-mono text-xs">.gitbunignore</code> file support where you can list sensitive files (like <code class="jetbrains-mono text-xs">.env</code>) that should never be sent to the AI for analysis, even if they are staged.</p>
</div>
</div>
</section>
<div class="mt-20 pt-8 border-t border-border flex justify-between items-center">
<a class="flex items-center gap-2 text-gray-500 hover:text-white font-medium" href="#">
<span class="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Core Concepts
                </a>
<div class="text-sm text-gray-500">Updated Dec 15, 2024</div>
</div>
</article>
</main>
<aside class="hidden xl:block w-64 fixed right-[max(0px,calc(50%-720px))] top-16 bottom-0 overflow-y-auto py-12 px-8">
<h5 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">On this page</h5>
<ul class="space-y-3 text-sm">
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors border-l border-transparent" href="#troubleshooting">Troubleshooting</a></li>
<li><a class="text-gray-500 hover:text-gray-300 pl-4 block transition-colors border-l border-transparent" href="#common-questions">Common Questions</a></li>
</ul>
<div class="mt-12 pt-12 border-t border-border">
<div class="bg-indigo-glow/10 border border-indigo-glow/20 rounded-xl p-4">
<p class="text-xs text-indigo-glow font-bold mb-2">STILL STUCK?</p>
<p class="text-xs text-gray-400 leading-normal mb-3">Can't find what you're looking for?</p>
<a class="text-xs font-semibold text-white hover:underline flex items-center gap-1" href="#">
                    Open a GitHub Issue
                    <span class="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
</div>
</aside>
</div>
<footer class="lg:pl-64 border-t border-border bg-[#0A0A0A]">
<div class="max-w-3xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
<div class="text-gray-500 text-xs jetbrains-mono">
            © 2024 Gitbun. Built for developers.
        </div>
<div class="flex gap-8 text-xs text-gray-500 jetbrains-mono">
<a class="hover:text-white transition-colors" href="#">Twitter</a>
<a class="hover:text-white transition-colors" href="#">GitHub</a>
<a class="hover:text-white transition-colors" href="#">NPM</a>
</div>
</div>
</footer>

</body></html>