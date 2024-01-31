import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { forwardRef, useEffect, useState } from "react";
import BlockFormatDropDown from "../plugins/toolbar/BlockFormatDropDown";

export type FloatingMenuCoords = { x: number; y: number } | undefined;

type FloatingMenuProps = {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  coords: FloatingMenuCoords;
  closeMenu?: () => void;
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>(
  function FloatingMenu(props, ref) {
    const { editor, coords, closeMenu } = props;
    const [isEditable] = useState(() => editor.isEditable());

    const shouldShow = coords !== undefined;
    useEffect(() => {
      const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
        });
      });
      return unregisterListener;
    }, [editor]);

    return (
      <div
        ref={ref}
        className="flex items-center justify-between bg-slate-100 border-[1px] border-slate-300 rounded-md p-1 gap-1"
        aria-hidden={!shouldShow}
        style={{
          position: "absolute",
          top: coords?.y,
          left: coords?.x,
          visibility: shouldShow ? "visible" : "hidden",
          opacity: shouldShow ? 1 : 0,
        }}
      >
        <BlockFormatDropDown
          disabled={!isEditable}
          blockType="para:ms1"
          editor={editor}
          closeMenu={closeMenu}
        />
      </div>
    );
  },
);
