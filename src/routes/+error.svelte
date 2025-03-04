<script>
   import { page } from "$app/state";
</script>

<div class="error">
   <h1>{page.status}: {page.error?.message}</h1>
</div>

<style>
   .error {
      height: 100%;
      display: grid;
      place-content: center;
      color: #f38ba8;
   }
</style>
