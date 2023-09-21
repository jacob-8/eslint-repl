<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { WebContainer } from "@webcontainer/api";
  import { onMount } from "svelte";
  import { files } from '$lib/files'

  let webcontainerInstance: WebContainer;

  onMount(async () => {
    console.log('booting webcontainer');
    webcontainerInstance = await WebContainer.boot();
    console.log('mounting files');
    await webcontainerInstance.mount(files);
    console.log('reading package.json');
    const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
    console.log(packageJSON);
  });
</script>

<SplitPane pos={40} min={0}>
  <section class="h-full border-r flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section class="h-full border-r" slot="a">Tree</section>
      <section class="h-full bg-gray-100" slot="b">
        Monaco for editing rules
      </section>
    </SplitPane>
  </section>
  <section class="h-full bg-gray-200" slot="b">
    <SplitPane type="vertical" pos={90} min={0}>
      <section class="h-full border-r" slot="a">
        Monaco for viewing linted code w/ warnings+errors (can split to a diff viewer if there are any auto-fix rules)
      </section>
      <section class="h-full bg-red-100" slot="b">
        Terminal / ast
      </section>
    </SplitPane>
  </section>
</SplitPane>

