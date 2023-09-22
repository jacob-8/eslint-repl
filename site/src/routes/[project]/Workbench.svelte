<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { WebContainer } from "@webcontainer/api";
  import { onMount } from "svelte";
  import Console from "./Console.svelte";
  import { terminal } from "$lib/terminal";
  import MonacoEditor from "$lib/monaco/MonacoEditor.svelte";
  import { convertToFileSystemTree } from "./convertToFileSystemTree";

  export let files: Record<string, string>;
  let webcontainerInstance: WebContainer;

  $: tree = convertToFileSystemTree(files);
  $: editingFilename = tree["index.js"]
    ? "index.js"
    : tree["Foo.svelte"]
    ? "Foo.svelte"
    : "if-newline.ts";

  onMount(async () => {
    console.log("booting webcontainer");
    webcontainerInstance = await WebContainer.boot();
    console.log("mounting files");
    await webcontainerInstance.mount(tree);

    const exitCode = await installDependencies();
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }
    
    if (editingFilename === "if-newline.ts") {
      const exitCode = await stubRules();
      if (exitCode !== 0) {
        throw new Error("Stub failed");
      }
    } else {
      const results = await runLint();
      console.log({ results });
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

  async function stubRules() {
    const stubProcess = await webcontainerInstance.spawn("npm", ["run", "dev"]);
    stubProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );
    return stubProcess.exit;
  }

  async function runLint() {
    const lintProcess = await webcontainerInstance.spawn("npx", [
      "eslint",
      "--format",
      "json-with-metadata",
      "--output-file",
      "./lint-result.json",
      editingFilename,
    ]);
    lintProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );
    await lintProcess.exit;
    const resultsString = await webcontainerInstance.fs.readFile(
      "/lint-result.json",
      "utf8"
    );
    return JSON.parse(resultsString);
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

  async function write(path: string, content: string) {
    await webcontainerInstance.fs.writeFile(path, content);
  }
</script>

<SplitPane pos={30} min={0}>
  <section class="h-full border-r border-gray-600 flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section
        class="h-full bg-gray-800 text-white border-b border-gray-600 p-3 overflow-x-auto"
        slot="a"
      >
        <pre>{JSON.stringify(files, null, 2)}</pre>
      </section>
      <section class="h-full bg-black" slot="b">
        <MonacoEditor
          filename="eslint.config.js"
          content={tree["eslint.config.js"].file.contents}
          on:change={({ detail: { filename, content } }) => {
            console.log({ filename, content });
          }}
        />
      </section>
    </SplitPane>
  </section>
  <section class="h-full" slot="b">
    <SplitPane type="vertical" pos={75} min={0}>
      <section class="h-full bg-black border-b border-gray-600" slot="a">
        {#if (editingFilename === "if-newline.ts")}
          <MonacoEditor
            filename={editingFilename}
            content={tree.src.directory.rules.directory[editingFilename].file
              .contents}
            on:change={async ({ detail: { filename, content } }) => {
              console.log({ filename, content });
              await write("src/rules/if-newline.ts", content);
              const resultsString = await webcontainerInstance.fs.readFile(
                "src/rules/if-newline.ts",
                "utf8"
              );
              console.log({resultsString});
            }}
          />
        {:else}
          <MonacoEditor
            filename={editingFilename}
            content={tree[editingFilename].file.contents}
            on:change={({ detail: { filename, content } }) => {
              console.log({ filename, content });
            }}
          />
        {/if}
      </section>
      <section class="h-full" slot="b">
        <Console />
      </section>
    </SplitPane>
  </section>
</SplitPane>
