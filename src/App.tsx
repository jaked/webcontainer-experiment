import { useEffect, useRef } from "react";
import { XTerm } from "xterm-for-react";
import type { FileSystemTree } from "@webcontainer/api";
import { load } from "@webcontainer/api";

const fileTree: FileSystemTree = {
  "package.json": {
    file: {
      contents: JSON.stringify({
        name: "webcontainer-experiment",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
        },
        devDependencies: {
          "@types/react": "^18.0.26",
          "@types/react-dom": "^18.0.9",
          "@vitejs/plugin-react": "^3.0.0",
          typescript: "^4.9.3",
          vite: "^4.0.0",
        },
      }),
    },
  },
};

function App() {
  const xtermRef = useRef<XTerm>(null);

  useEffect(() => {
    (async () => {
      if (!xtermRef.current) return;
      const terminal = xtermRef.current.terminal;

      try {
        const loaded = await load();
        const container = await loaded.boot();
        await container.loadFiles(fileTree);
        await container.run(
          { command: "yarn" },
          {
            stdout: (data) => {
              terminal.write(data);
            },
          }
        );
      } catch (e) {
        terminal.write("failed!!\r\n");
        terminal.write(String(e));
      }
    })();
  }, []);

  return (
    <div>
      <XTerm ref={xtermRef} />
    </div>
  );
}

export default App;
