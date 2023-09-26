<script lang="ts">
  import CurrentRules from "./CurrentRules.svelte";
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import Console from "$lib/console/Console.svelte";
  import { convertToFileSystemTree } from "$lib/filetree/convertToFileSystemTree";
  import CodeMirror from "$lib/editor/CodeMirror.svelte";
  import {
    checkProjectReady,
    initProjectInWebContainer,
    projectStatus,
    remove,
    shellProcess,
    write,
  } from "$lib/webcontainer";
  import { getLintConfig, lint, type RulesMeta } from "$lib/lint";
  import Explorer from "$lib/filetree/Explorer.svelte";
  import { writable } from "svelte/store";
  import { currentViolationRuleIds } from "$lib/stores/lint-results";
  import Tabs from "$lib/Tabs.svelte";

  export let projectFiles: Record<string, string>;
  export let lintModules: Record<string, string>;
  export let configFocus: string;
  export let lintFocus: string;
  let files = writable<Record<string, string>>({});
  // $: files = createSearchParamStore<Record<string, string>>({ key: 'files', startWith: projectFiles });

  $: setupProject(projectFiles);
  function setupProject(_files: Record<string, string>) {
    $files = _files;
    const tree = convertToFileSystemTree({..._files, ...lintModules});
    initProjectInWebContainer(tree);
  }

  let rulesMeta: RulesMeta = {};
  let rulesError = "";
  $: if (lintFocus) {
    rulesMeta = {};
    rulesError = "";
    getLintRules();
  }
  async function getLintRules() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await checkProjectReady();
      rulesMeta = await getLintConfig(lintFocus);
      console.log({ rulesMeta });
    } catch (err: any) {
      rulesError = err.message;
      console.log(err);
    }
  }
</script>

<SplitPane pos={40} min={0}>
  <section class="h-full border-r border-truegray-700 flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section class="h-full border-b border-truegray-700" slot="a">
        <Explorer
          tree={convertToFileSystemTree($files)}
          on:add={({ detail: fileName }) => {
            $files[fileName] = "hello";
            $files = $files;
          }}
          bind:lintFocus
          bind:configFocus
        />
      </section>
      <section class="h-full bg-black" slot="b">
        <CodeMirror
          filename={configFocus}
          content={$files[configFocus]}
          on:change={async ({ detail: { filename, content } }) => {
            if ($projectStatus === "booting" || $projectStatus === "mounting")
              return;
            await write(filename, content);
            $files[configFocus] = content;
            console.log(`[changed] ${filename}`);
          }}
        />
      </section>
    </SplitPane>
  </section>
  <section class="h-full" slot="b">
    <SplitPane type="vertical" pos={70} min={0}>
      <section class="h-full bg-black border-b border-truegray-700" slot="a">
        <CodeMirror
          filename={lintFocus}
          content={$files[lintFocus]}
          lint={lint(lintFocus, $files[lintFocus])}
          on:change={async ({ detail: { filename, content } }) => {
            if ($projectStatus === "booting" || $projectStatus === "mounting")
              return;
            if (!content) {
              await remove(filename);
              delete $files[lintFocus];
              $files = $files;
              return
            }
            await write(filename, content);
            $files[lintFocus] = content;
            console.log(`[changed] ${filename}`);
          }}
        />
      </section>
    <section class="h-full bg-[var(--terminal-background)] text-gray-200 flex flex-col" style="--terminal-background: hsl(0 0% 10%);--scrollbar-border-color: var(--terminal-background);" slot="b">
        <Tabs>
          <svelte:fragment slot="first">
            {#if $projectStatus !== "ready"}
              <div class="font-semibold p-2">
                Status: {$projectStatus}
              </div>
            {:else}
              {#if rulesError}
                <div class="text-pink p-2">{rulesError}</div>
              {/if}
              <CurrentRules
                filename={lintFocus}
                {rulesMeta}
                currentViolationRuleIds={$currentViolationRuleIds}
              />
            {/if}
          </svelte:fragment>
          <svelte:fragment slot="second">
            <Console shellProcess={$shellProcess} />
          </svelte:fragment>
        </Tabs>
      </section>
    </SplitPane>
  </section>
</SplitPane>
