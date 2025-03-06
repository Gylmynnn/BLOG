<script lang="ts">
   import Images from "$lib/components/images.svelte";
</script>

<svelte:head>
   <title>ABOUT</title>
   <meta name="description" content="ABOUT ME" />
</svelte:head>

<section class="">
   <div>
      <span class="about-header">
         <p class="say-text">:=</p>
         <h1 class="me-text">Gylmynnn</h1>
         <p class="kanji-text">ギルマン</p>
      </span>
      <br />
      <span class="img">
         <Images src="/i-use-golang.jpeg" alt="error" />
      </span>
      <span class="about-content">
         <div class="tentang-saya">
            <h3># Tentang Saya</h3>
            <br />
            <p class="text-justify">
               👋 Hola! Saya seorang yang sedang mendalami dunia Backend
               Development, dengan fokus utama pada bahasa pemrograman Golang.
               Saat ini, saya terus belajar dan mengasah keterampilan dalam
               membangun API, mengelola database, serta memahami arsitektur
               backend yang scalable dan efisien. <br /> <br /> 💡 Saya tertarik
               dengan Microservices, RESTful API, dan Cloud Computing, serta ingin
               lebih memahami teknologi seperti Docker, Kubernetes, dan gRPC. Saya
               percaya bahwa pembelajaran adalah perjalanan yang berkelanjutan, dan
               saya selalu terbuka untuk tantangan baru serta kolaborasi dengan tim
               yang dapat membantu saya berkembang.
            </p>
            <br />
         </div>
      </span>
   </div>
</section>

<style>
   .img {
      display: flex;
      justify-content: center;
      padding-bottom: var(--size-4);
   }
   .about-content {
      display: block;
      @media (min-width: 768px) {
         padding-top: var(--size-6);
         /* gap: var(--size-10); */
         display: grid;
         justify-content: center;
      }
   }
   .about-header {
      border-bottom: 2px dotted;
      display: block;
      justify-content: center;
      @media (min-width: 768px) {
         padding-bottom: 1rem;
         margin: 0 auto;
         display: flex;
         width: fit-content;
      }

      .say-text {
         font-weight: bold;
      }
      .me-text {
         font-size: 4rem;
         @media (min-width: 768px) {
            font-size: 6rem;
         }
      }
      .kanji-text {
         text-align: end;
         font-size: 2rem;
         font-weight: bold;
         @media (min-width: 768px) {
            font-size: 3rem;
         }
      }
   }
</style>
