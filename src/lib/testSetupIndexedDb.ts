import "fake-indexeddb/auto";

if (typeof globalThis.self === "undefined") {
  Object.defineProperty(globalThis, "self", { value: globalThis, writable: true });
}

if (typeof globalThis.FileReader === "undefined") {
  class FileReaderPolyfill {
    result: ArrayBuffer | null = null;
    onload: ((ev: { target: FileReaderPolyfill }) => void) | null = null;
    onerror: ((err: unknown) => void) | null = null;

    readAsArrayBuffer(blob: Blob) {
      void blob.arrayBuffer().then(
        (buffer) => {
          this.result = buffer;
          this.onload?.({ target: this });
        },
        (err) => this.onerror?.(err),
      );
    }
  }

  Object.defineProperty(globalThis, "FileReader", {
    value: FileReaderPolyfill,
    writable: true,
  });
}
