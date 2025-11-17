<script lang="ts">
   const projects = [
      {
         title: "GoLink",
         desc: "Short-link service written in Go with Redis back-end.",
         tags: ["Go", "Redis", "Docker"],
         repo: "https://github.com/Gylmynnn/golink",
         demo: null,
      },
      // {
      //    title: "Kubedash",
      //    desc: "Minimal Kubernetes dashboard built with SvelteKit.",
      //    tags: ["SvelteKit", "TypeScript", "K8s"],
      //    repo: "https://github.com/Gylmynnn/kubedash",
      //    demo: null,
      // },
      // {
      //    title: "gRPC-Wallet",
      //    desc: "Micro-service wallet API using gRPC + PostgreSQL.",
      //    tags: ["gRPC", "PostgreSQL", "Go"],
      //    repo: "https://github.com/Gylmynnn/grpc-wallet",
      //    demo: null,
      // },
   ];
</script>

<section
   class="lg:px-8 lg:pt-20 py-20 lg:py-0"
   style="background:var(--background)"
>
   <div class="max-w-3xl !mx-auto">
      <header class="mb-10">
         <h2
            class="text-3xl md:text-4xl font-light tracking-wide"
            style="color:var(--text-1)"
         >
            Selected work
         </h2>
         <p
            class="mt-3 text-sm md:text-base leading-relaxed"
            style="color:var(--text-2)"
         >
            A few things I’ve built—open-source, experiments, and production
            code.
         </p>
      </header>

      <div class="pt-4">
         {#each projects as p}
            <article
               class="group rounded-lg border py-4 flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-px"
            >
               <div class="min-w-0">
                  <h3 class="text-base font-semibold">
                     {p.title}
                  </h3>
                  <p
                     class="mt-1 text-sm leading-snug"
                     style="color:var(--text-2)"
                  >
                     {p.desc}
                  </p>
                  <div class="flex flex-wrap gap-2 mt-3">
                     {#each p.tags as t}
                        <span class="px-2 py-2 text-[0.65rem] uppercase tracking-wider rounded border"
                           >{t}</span
                        >
                     {/each}
                  </div>
               </div>

               <div class="flex shrink-0 gap-3 text-sm">
                  {#if p.repo}
                     <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener"
                        class="px-3 py-1.5 rounded-md border transition-colors"
                        style=" color:var(--text-2);"
                     >
                        Code
                     </a>
                  {/if}
                  {#if p.demo}
                     <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener"
                        class="px-3 py-1.5 rounded-md border transition-colors"
                        style="border-color:var(--border); color:var(--text-2); hover-border-color:var(--brand); hover:color:var(--brand)"
                     >
                        Demo
                     </a>
                  {/if}
               </div>
            </article>
         {/each}
      </div>

      <div class="mt-8 text-center">
         <a
            href="https://github.com/Gylmynnn"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors"
            style="border-color:var(--border); color:var(--text-2); hover-border-color:var(--brand); hover:color:var(--brand)"
         >
            More on GitHub
         </a>
      </div>
   </div>
</section>
