"use client";

import { Button } from "@/lib/components/ui/button";
import { Component } from "@/lib/components/utils/component";
import { useWorldePartyStore } from "@/lib/store/wordle.store";
import { Letter, LetterStatus, Line } from "@/lib/types/wordle.type";
import { cn } from "@/lib/utils";
import { isValidWord } from "@/lib/wordle/utils";
import { Delete, Space } from "lucide-react";
import { ReactElement, useState } from "react";
import ReactConfetti from "react-confetti";
import { useEventListener, useWindowSize } from "usehooks-ts";
import { EndedWordleDialog } from "../dialogs/wordle-ended.dialog";

export const WordleBoard = (): ReactElement => {
  const { activePartyId, getParty, addLetter, removeLetter, activeLineIndex, setLine, setActiveLineIndex } = useWorldePartyStore();
  
  const [isFound, setIsFound] = useState<boolean>(false);
  const [ended, setEnded] = useState<boolean>(false);

  const { width, height } = useWindowSize();

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const onKeyPress = (e: KeyboardEvent) => {
    if (ended) return;
    if (alphabet.includes(e.key.toUpperCase())) addLetter(e.key.toUpperCase());
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (ended) return;
    if (e.key === "Backspace") removeLetter();
  }

  const onEnter = (e: KeyboardEvent) => {
    if (ended) return;
    if (e.key === "Enter") {
      if (!activePartyId) return;
      const party = getParty(activePartyId);
      if ((party?.lines ?? [])[activeLineIndex ?? 0].some((data) => data.letter === "")) return;

      const result = isValidWord(party?.lines ?? [], party?.word ?? "", (activeLineIndex ?? 0));
      setLine(result);

      if (result.every((data) => data.status === "well-placed")) {
        setEnded(true);
        setIsFound(true);
      }

      if (activeLineIndex === (party?.attempts ?? 5) - 1) {
        setEnded(true);
      } else {
        setActiveLineIndex((activeLineIndex ?? 0) + 1);
      }
    }
  }

  useEventListener("keypress", onKeyPress);
  useEventListener("keyup", onKeyUp);
  useEventListener("keypress", onEnter);

  if (!activePartyId) return <></>;
  const party = getParty(activePartyId);

  return (
    <>
      {isFound && <ReactConfetti width={width} height={height} recycle={false} />}
      {ended && <EndedWordleDialog endStatus={isFound ? "win" : "lose"} open={ended} />}

      <div className="flex flex-col">
        <div className={cn(
          "border border-[#262626] rounded-lg p-5",
          "flex flex-col sm:flex-row w-full"
        )}>
          <div className="p-2">
            {party?.lines?.map((line, i) => (
              <div key={i} className="flex flex-row">
                {line.map((data: Letter, i) => (
                  <Case key={i} letter={data.letter} status={data.status} />
                ))}
              </div>
            ))}
          </div>

          <div className="p-2 w-full">
            <Button
              onClick={() => {
                const result = isValidWord(party?.lines ?? [], party?.word ?? "", (activeLineIndex ?? 0));
                setLine(result);

                if (result.every((data) => data.status === "well-placed")) {
                  setEnded(true);
                  setIsFound(true);
                  console.log(ended, isFound);
                }

                if (activeLineIndex === (party?.attempts ?? 5) - 1) {
                  setEnded(true);
                } else {
                  setActiveLineIndex((activeLineIndex ?? 0) + 1);
                }
              }}
              variant={"secondary"}
              className="w-full"
              disabled={
                (party?.lines ?? [])[activeLineIndex ?? 1].some((data) => data.letter === "") ||
                activeLineIndex === (party?.attempts ?? 5)
              }
            >
              Valider ma réponse
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2 mt-3">
          {alphabet.map((letter, i) => (
            <Button variant={"secondary"} key={i} onClick={() => addLetter(letter)}>{letter}</Button>
          ))}

          <Button variant={"secondary"} onClick={() => removeLetter()}>
            <Delete className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

export const Case: Component<Letter> = ({ letter, status }) => {
  return (
    <div className={cn(
      "border border-[2px] w-16 h-16 flex justify-center items-center", {
        "bg-[#20603f]": status == "well-placed",
        "bg-[#ff6a41]/70": status === "misplaced"
      }
    )}>
      {letter}
    </div>
  );
}