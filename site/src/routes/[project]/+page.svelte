<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { browser } from "$app/environment";
  import Content from "./Content.svelte";
  import { createSearchParamStore } from "$lib/search-param";
  import { save } from "./save";
  import { writable } from "svelte/store";
  import { convertToFileSystemTree } from "$lib/filetree/convertToFileSystemTree";

  export let data;

  let files = writable<Record<string, string>>({});
  $: if (browser) setupProject(data.projectFiles);
  async function setupProject(_files: Record<string, string>) {
    $files = _files;
    const tree = convertToFileSystemTree({ ..._files, ...data.lintModules });
    const { initProjectInWebContainer } = await import("$lib/webcontainer");
    initProjectInWebContainer(tree);
  }

  const configFocus = createSearchParamStore({
    key: "config",
    startWith: data.meta.lintFocus,
  });
  const lintFocus = createSearchParamStore<string>({
    key: "lint",
    startWith: data.meta.lintFocus,
  });

  $: isExampleProject = data.projects.includes(data.projectName);

  function generateHash() {
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);
    const generateHash = (length: number) =>
      Array.from({ length }, randomHex).join("");
    return generateHash(16);
  }
</script>

<div class="h-100vh" style="--scrollbar-border-color: #1e1e1e;">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r" slot="a">
      <Content
        projectNames={data.projects}
        activeProjectName={data.projectName}
        activeProjectMarkdown={data.projectFiles["README.md"]}
        on:save={async () => {
          const name = isExampleProject ? generateHash() : data.projectName;
          await save(name, $files);
          if (isExampleProject) window.location.assign(`/${name}`);
        }}
      />
    </section>
    <section class="h-full" slot="b">
      {#if browser}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench
            bind:files
            bind:lintFocus={$lintFocus}
            bind:configFocus={$configFocus}
          />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
