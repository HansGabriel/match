import * as Match from "@effect/match"
import type { TaggedEnum } from "@effect/match/TaggedEnum"
import { taggedEnum } from "@effect/match/TaggedEnum"
import { pipe } from "@effect/data/Function"
import { match } from "ts-pattern"
import benny from "benny"

const ABC = taggedEnum<{
  A: { a: number }
  B: { b: number }
  C: { c: number }
}>()
type ABC = TaggedEnum.Infer<typeof ABC>

const matchEval = pipe(
  Match.type<ABC>(),
  Match.tag("A", (_) => _.a),
  Match.tag("B", (_) => _.b),
  Match.tag("C", (_) => _.c),
  Match.exhaustive,
)

const tspEval = (abc: ABC) =>
  match(abc)
    .with({ _tag: "A" }, (_) => _.a)
    .with({ _tag: "B" }, (_) => _.b)
    .with({ _tag: "C" }, (_) => _.c)
    .exhaustive()

const ifElseEval = (abc: ABC) => {
  if (abc._tag === "A") {
    return abc.a
  } else if (abc._tag === "B") {
    return abc.b
  } else if (abc._tag === "C") {
    return abc.c
  }
}

const abc = ABC("C")({ c: 1 }) as ABC

benny.suite(
  "comparison",
  benny.add("@effect/match", () => matchEval(abc)),
  benny.add("ts-pattern", () => tspEval(abc)),
  benny.add("if/else", () => ifElseEval(abc)),
  benny.cycle(),
  benny.complete(),
)
