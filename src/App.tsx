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

      try {
        xtermRef.current.terminal.write("loading");
        const loaded = await load();
        xtermRef.current.terminal.write("booting");
        const container = await loaded.boot();
        xtermRef.current.terminal.write("loading files");
        await container.loadFiles(fileTree);
        xtermRef.current.terminal.write("success!!");
      } catch (e) {
        xtermRef.current.terminal.write("failed!!");
        xtermRef.current.terminal.write(String(e));
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
