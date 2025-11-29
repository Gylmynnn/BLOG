<script>
   import { page } from "$app/state";
</script>

<div class="error">
   <h1>{page.status} :(</h1>
   <h2>
      {page.error?.message}
   </h2>
</div>

<style>
   .error {
      text-align: center;
      height: 70vh;
      display: grid;
      place-content: center;
      color: #f38ba8;
   }
</style>
