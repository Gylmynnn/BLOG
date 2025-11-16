<script lang="ts">
   interface Props {
      src: string;
      alt: string;
      width?: string;
      height?: string;
   }
   let { src, alt, width, height }: Props = $props();
</script>

<picture>
   <source srcset={src} type="image/webp" />
   <img {src} {alt} loading="lazy" {width} {height} />
</picture>
