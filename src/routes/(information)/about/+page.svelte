<script lang="ts">
  import Images from "$lib/components/images.svelte";
</script>

<svelte:head>
  <title>ABOUT</title>
  <meta name="description" content="ABOUT ME" />
</svelte:head>

<section class="main-container pt-16 lg:pt-20 lg:px-4">
  <div class="items-center flex flex-col lg:flex-row w-full justify-center lg:gap-2">

    <div class="relative">
      <div class="p-6 lg:p-8">
        <div class="flex flex-col gap-2 lg:gap-8 items-center text-center">
          <div class="w-[250px] h-[250px] rounded-full overflow-hidden border-2">
            <Images
              width="250"
              height="250"
              src="/i-use-golang.webp"
              alt="Muhamad Gilman Nurrajabi"
            />
          </div>

          <div>
            <h4 class="text-3xl lg:text-4xl font-bold" style="color:var(--text-1)">
              MUHAMAD GILMAN
            </h4>
            <p class="text-xl lg:text-2xl font-bold tracking-wide" style="color:var(--text-1)">
              NURRAJABI - <span style="color:var(--brand)">ギルマン</span>
            </p>

            <div class="flex flex-wrap gap-2 justify-center pt-3">
              <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors">
                Backend Developer
              </span>
              <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors">
                Linux Enthusiast
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Right – story -->
    <div class="mt-12 pt-6 lg:mt-0">
      <div class="rounded-2xl pb-8 lg:p-10 border" style="border-color:var(--border); background:var(--surface-1)">
        <!-- heading -->
        <div class="flex items-center gap-3 mb-6 pb-2">
          <div class="w-1 h-8 rounded-full" style="background:var(--brand)"></div>
          <h3 class="text-2xl lg:text-3xl font-bold" style="color:var(--text-1)">Tentang Saya</h3>
        </div>

        <!-- paragraphs -->
        <div class="space-y-6 leading-relaxed" style="color:var(--text-1)">
          <p class="text-base lg:text-lg">
            <span class="font-semibold" style="color:var(--brand)">Hola!</span>
            Saya seorang yang sedang mendalami dunia
            <span class="font-semibold" style="color:var(--brand)">Backend Development</span>,
            dengan fokus utama pada bahasa pemrograman
            <span class="font-mono px-2 py-1 rounded border text-sm" style="border-color:var(--border); color:var(--brand)">Golang</span>.
            Saat ini, saya terus belajar dan mengasah keterampilan dalam membangun API, mengelola database,
            serta memahami arsitektur backend yang scalable dan efisien.
          </p>

          <p class="text-base lg:text-lg pt-2">
            Saya tertarik dengan
            <span class="px-2 py-1 rounded border text-sm" style="border-color:var(--border); color:var(--brand)">Microservices</span>,
            <span class="px-2 py-1 rounded border text-sm" style="border-color:var(--border); color:var(--brand)">RESTful API</span>,
            dan
            <span class="px-2 py-1 rounded border text-sm" style="border-color:var(--border); color:var(--brand)">Cloud Computing</span>,
            serta ingin lebih memahami teknologi seperti
            <span class="font-mono" style="color:var(--brand)">Docker</span>,
            <span class="font-mono" style="color:var(--brand)">Kubernetes</span>, dan
            <span class="font-mono" style="color:var(--brand)">gRPC</span>.
            Saya percaya bahwa pembelajaran adalah perjalanan yang berkelanjutan, dan saya selalu terbuka
            untuk tantangan baru serta kolaborasi dengan tim yang dapat membantu saya berkembang.
          </p>
        </div>
      </div>
    </div>

  </div>
</section>
