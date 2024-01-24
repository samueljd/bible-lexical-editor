import { computePosition } from "@floating-ui/dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from "lexical";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BlockFormatDropDown from "./toolbar/BlockFormatDropDown";

const DOM_ELEMENT = document.body;
export const BACKSLASH_POPUP: LexicalCommand<KeyboardEvent> = createCommand("BACKSLASH_POPUP");

const BackslashPlugin = ({
  backSlashPopup,
  setBackSlashPopup,
}: {
  backSlashPopup: boolean;
  setBackSlashPopup: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const ref = useRef<HTMLDivElement>(null);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [coords, setCoords] = useState<{ x: number; y: number } | undefined>(undefined);

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "\\") {
        console.log("BACKSLASH_POPUP", backSlashPopup);
        editor.dispatchCommand(BACKSLASH_POPUP, event);
      }
    };

    return editor.registerRootListener(
      (rootElement: HTMLElement | null, prevRootElement: HTMLElement | null) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener("keydown", onKeyDown);
        }
        if (rootElement !== null) {
          rootElement.addEventListener("keydown", onKeyDown);
        }
      },
    );
  }, [editor]);

  editor.registerCommand(
    BACKSLASH_POPUP,
    (event) => {
      event.preventDefault();
      const domSelection = getSelection();
      if (domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0)) {
        console.log("domSelection");
        const rect = domSelection?.getRangeAt(0).getBoundingClientRect();
        console.log({ rect });
        const { x, y } = rect || { x: 0, y: 0 };
        console.log({ x, y });
        // setCoords({ x, y });
        const domRange = domSelection?.getRangeAt(0);
        computePosition(domRange, ref.current!, { placement: "bottom-start" })
          .then((pos) => {
            setCoords({ x: pos.x, y: pos.y - 10 });
          })
          .catch(() => {
            setCoords(undefined);
          });
        console.log({ x, y });
      }

      setBackSlashPopup((prev) => !prev);
      return true;
    },
    COMMAND_PRIORITY_EDITOR,
  );

  useEffect(() => {
    console.log({ backSlashPopup, ...coords });
  }, [backSlashPopup]);

  return createPortal(
    <div
      ref={ref}
      className="flex items-center justify-between bg-slate-100 border-[1px] border-slate-300 rounded-md p-1 gap-1"
      aria-hidden={backSlashPopup}
      style={{
        position: "absolute",
        top: coords?.y,
        left: coords?.x,
        visibility: backSlashPopup ? "visible" : "hidden",
        opacity: backSlashPopup ? 1 : 0,
        backgroundColor: "white",
      }}
    >
      <BlockFormatDropDown disabled={!isEditable} blockType="para:ms1" editor={editor} />
    </div>,
    DOM_ELEMENT,
  );
};

export default BackslashPlugin;
