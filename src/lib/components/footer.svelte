<script lang="ts">
   import * as config from "$lib/config";
</script>

<footer class="footer-container lg:flex lg:justify-between lg:items-center pb-6">
   <p>{config.title} &copy {new Date().getFullYear()}</p>
   <p>{config.description}</p>
</footer>

<style>
   footer {
      border-top: 1px solid var(--size-7);
      p {
         color: var(--text-2);
      }
   }
</style>
