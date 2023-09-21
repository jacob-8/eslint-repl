<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { WebContainer } from "@webcontainer/api";
  import { onMount } from "svelte";
  import { files } from "$lib/files";
  import Console from "./Console.svelte";
  import { terminal } from "$lib/terminal";
  import MonacoEditor from "$lib/monaco/MonacoEditor.svelte";
  import type { Stub } from "$lib/monaco/types";

  let webcontainerInstance: WebContainer;

  onMount(async () => {
    console.log("booting webcontainer");
    webcontainerInstance = await WebContainer.boot();
    console.log("mounting files");
    await webcontainerInstance.mount(files);

    const exitCode = await installDependencies();
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }

    const shellProcess = await startShell();
    // TODO: redraw console content on resize
    // window.addEventListener("resize", () => {
    //   fitAddon.fit();
    //   shellProcess.resize({
    //     cols: terminal.cols,
    //     rows: terminal.rows,
    //   });
    // });
  });

  async function installDependencies() {
    const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );
    return installProcess.exit;
  }

  async function startShell() {
    const shellProcess = await webcontainerInstance.spawn("jsh", {
      terminal: {
        cols: terminal.cols,
        rows: terminal.rows,
      },
    });
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );

    const input = shellProcess.input.getWriter();
    terminal.onData((data) => {
      input.write(data);
    });

    return shellProcess;
  }

  async function writeIndexJS(content: string) {
    await webcontainerInstance.fs.writeFile("/index.js", content);
  }

  const stub: Stub = {
    name: "index.txt",
    basename: "index.txt",
    text: true,
    contents:
      "Monaco for viewing linted code w/ warnings+errors (can split to a diff viewer if there are any auto-fix rules)",
  };
</script>

<SplitPane pos={40} min={0}>
  <section class="h-full border-r flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section class="h-full border-r" slot="a">Tree</section>
      <section class="h-full bg-gray-100" slot="b">
        <MonacoEditor
          {stub}
          on:change={({ detail: stub }) => {
            console.log({ stub });
          }}
        />
      </section>
    </SplitPane>
  </section>
  <section class="h-full" slot="b">
    <SplitPane type="vertical" pos={70} min={0}>
      <section class="h-full bg-black border-b border-white" slot="a">
        <MonacoEditor
          {stub}
          on:change={({ detail: stub }) => {
            console.log({ stub });
          }}
        />
      </section>
      <section class="h-full" slot="b">
        <Console />
      </section>
    </SplitPane>
  </section>
</SplitPane>
