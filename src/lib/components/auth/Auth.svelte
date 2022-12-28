<script lang="ts">
  import { auth } from '$lib/auth';
  import { session } from '$lib/session';
</script>

<!-- using the session state avoids the initial delay while the client auth resolves -->
{#if $session.user}
  <button on:click={() => auth.signOut()}> Sign Out </button>
  {$session.user.name} ({$session.user.email})
{:else}
  <button on:click={() => auth.signInWith('google')}>
    <img alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
    Sign In with Google</button
  >
  <button on:click={() => auth.signInWith('facebook')}
    ><img alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" />
    Sign In with Facebook</button
  >
  <button on:click={() => auth.signInWith('github')}>Sign In with Github</button>
  <button on:click={() => auth.signInWith('twitter')}>Sign In with Twitter</button>
{/if}

<style>
  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    color: #fff;
    background-color: #93f;
    margin-right: 12px;
  }
</style>
