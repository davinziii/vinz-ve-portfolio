import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync(
  new URL("../lib/video-volume.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText;
let sequence = 0;
const load = () =>
  import(
    "data:text/javascript;base64," +
      Buffer.from(compiled).toString("base64") +
      "#" +
      sequence++
  );
const values = new Map([
  ["vinz-video-audio", JSON.stringify({ volume: 0.3, muted: true })],
]);
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
};
class Video extends EventTarget {
  _volume = 1;
  _muted = false;
  get volume() {
    return this._volume;
  }
  set volume(value) {
    if (this._volume !== value) {
      this._volume = value;
      queueMicrotask(() => this.dispatchEvent(new Event("volumechange")));
    }
  }
  get muted() {
    return this._muted;
  }
  set muted(value) {
    if (this._muted !== value) {
      this._muted = value;
      queueMicrotask(() => this.dispatchEvent(new Event("volumechange")));
    }
  }
}
const flush = () => new Promise((resolve) => setImmediate(resolve));
const audio = await load();
const hero = new Video(),
  preview = new Video();
const stopHero = audio.connectVideoAudio(hero),
  stopPreview = audio.connectVideoAudio(preview);
assert.equal(hero.volume, 0.3);
assert.equal(preview.muted, true);
hero.volume = 0.2;
hero.muted = false;
await flush();
assert.equal(preview.volume, 0.2);
assert.equal(preview.muted, false);
stopPreview();
const next = new Video();
const stopNext = audio.connectVideoAudio(next);
await flush();
assert.equal(next.volume, 0.2);
assert.equal(next.muted, false);
next.muted = true;
await flush();
const expanded = new Video();
const stopExpanded = audio.connectVideoAudio(expanded);
await flush();
assert.equal(expanded.volume, 0.2);
assert.equal(expanded.muted, true);
hero.muted = false;
hero.volume = 0.45;
await flush();
audio.muteForAutoplay(next);
await flush();
assert.equal(next.muted, true);
assert.equal(hero.muted, false);
assert.equal(JSON.parse(values.get("vinz-video-audio")).muted, false);
next.volume = 0.15;
await flush();
assert.equal(hero.volume, 0.15);
assert.equal(expanded.volume, 0.15);
assert.equal(next.muted, true);
next.muted = false;
await flush();
next.muted = true;
await flush();
assert.equal(hero.muted, true);
assert.equal(expanded.muted, true);
stopHero();
stopNext();
stopExpanded();
const restored = await load(),
  reloaded = new Video();
restored.connectVideoAudio(reloaded);
await flush();
assert.equal(reloaded.volume, 0.15);
assert.equal(reloaded.muted, true);
values.set("vinz-video-audio", JSON.stringify({ volume: 2, muted: "invalid" }));
const invalid = await load(),
  safe = new Video();
invalid.connectVideoAudio(safe);
assert.equal(safe.volume, 1);
assert.equal(safe.muted, false);
globalThis.localStorage = {
  getItem() {
    throw Error("disabled");
  },
  setItem() {
    throw Error("disabled");
  },
};
const unavailable = await load(),
  first = new Video();
unavailable.connectVideoAudio(first);
first.volume = 0.37;
await flush();
const second = new Video();
unavailable.connectVideoAudio(second);
assert.equal(second.volume, 0.37);
console.log(
  "Audio preference checks passed: shared level/mute, new and expanded players, reload, autoplay fallback, invalid data and disabled storage.",
);
