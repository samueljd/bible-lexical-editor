import { computePosition } from "@floating-ui/dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FloatingMenu, FloatingMenuCoords } from "../components/FloatingMenu";
import { useBackSlashInteractions } from "../hooks/useBackSlashInteractions";

const DOM_ELEMENT = document.body;

export default function FloatingMenuPlugin() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<FloatingMenuCoords>(undefined);
  const [editor] = useLexicalComposerContext();
  const [backSlashPopup, setBackSlashPopup] = useState(false);

  const { isKeyDown, isKeyReleased } = useBackSlashInteractions();

  const calculatePosition = useCallback(() => {
    const domSelection = getSelection();
    const domRange = domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);
    if (!domRange || !ref.current) {
      return setCoords(undefined);
    }
    computePosition(domRange, ref.current, { placement: "bottom-start" })
      .then((pos) => {
        setCoords({ x: pos.x, y: pos.y - 10 });
      })
      .catch(() => {
        setCoords(undefined);
      });
  }, [isKeyDown]);

  const closeMenu = () => {
    setBackSlashPopup(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "\\") {
        event.preventDefault();
        calculatePosition();
        setBackSlashPopup((prev) => !prev);
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

  const $handleSelectionChange = useCallback(() => {
    if (editor.isComposing() || editor.getRootElement() !== document.activeElement) {
      setCoords(undefined);
      return;
    }
    const selection = $getSelection();
    if ($isRangeSelection(selection) && !selection.anchor.is(selection.focus) && backSlashPopup) {
      calculatePosition();
    } else {
      setCoords(undefined);
    }
  }, [editor, calculatePosition, backSlashPopup]);

  const show = coords !== undefined && backSlashPopup;

  useEffect(() => {
    if (!show && isKeyReleased) {
      editor.getEditorState().read(() => $handleSelectionChange());
    }
  }, [isKeyReleased, $handleSelectionChange, editor]);

  return createPortal(
    <FloatingMenu ref={ref} editor={editor} coords={coords} closeMenu={closeMenu} />,
    DOM_ELEMENT,
  );
}
