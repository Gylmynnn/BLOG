<script lang="ts">
   import * as config from "$lib/config";
</script>

<footer class="footer-container">
   <p>{config.title} &copy {new Date().getFullYear()}</p>
   <p>{config.description}</p>
</footer>

<style>
   footer {
      padding-block: var(--size-7);
      border-top: 1px solid var(--size-7);
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
         color: var(--text-2);
      }
   }
</style>
