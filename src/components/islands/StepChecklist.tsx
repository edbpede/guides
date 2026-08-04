import { createMemo, createSignal, For, mergeProps, Show, splitProps } from "solid-js";

type Props = {
  /** Step labels, in order. */
  steps?: string[];
  /** Heading shown above the list. */
  title?: string;
};

/**
 * Solid island: a "follow along" checklist for multi-step guides. Teachers can
 * tick off each step as they go, with a small progress indicator. Reactivity is
 * signal-based (no re-render), and the list uses <For> per the project rules.
 */
export default function StepChecklist(rawProps: Props) {
  const merged = mergeProps(
    { steps: [] as string[], title: "Følg med – sæt flueben efterhånden" },
    rawProps,
  );
  const [local] = splitProps(merged, ["steps", "title"]);

  const [checked, setChecked] = createSignal<boolean[]>(local.steps.map(() => false));

  const doneCount = createMemo(() => checked().filter(Boolean).length);
  const total = createMemo(() => local.steps.length);
  const allDone = createMemo(() => total() > 0 && doneCount() === total());

  function toggle(index: number): void {
    setChecked((prev) => {
      const next = prev.slice();
      next[index] = !next[index];
      return next;
    });
  }

  function reset(): void {
    setChecked(local.steps.map(() => false));
  }

  return (
    <Show when={total() > 0}>
      <div class="sc">
        <div class="sc__head">
          <span class="sc__title">{local.title}</span>
          <span class="sc__count">
            {doneCount()} / {total()}
          </span>
        </div>

        <div
          class="sc__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total()}
          aria-valuenow={doneCount()}
        >
          <span
            class="sc__bar-fill"
            style={{ width: `${total() ? (doneCount() / total()) * 100 : 0}%` }}
          />
        </div>

        <ul class="sc__list">
          <For each={local.steps}>
            {(step, index) => (
              <li class="sc__item">
                <label class="sc__label" classList={{ "sc__label--done": checked()[index()] }}>
                  <input
                    type="checkbox"
                    class="sc__check"
                    checked={checked()[index()]}
                    onChange={() => toggle(index())}
                  />
                  <span>{step}</span>
                </label>
              </li>
            )}
          </For>
        </ul>

        <div class="sc__foot">
          <Show
            when={allDone()}
            fallback={
              <button type="button" class="sc__reset" onClick={reset}>
                Nulstil
              </button>
            }
          >
            <span class="sc__done-msg">Sådan! Du er igennem alle trin 🎉</span>
          </Show>
        </div>
      </div>
    </Show>
  );
}
