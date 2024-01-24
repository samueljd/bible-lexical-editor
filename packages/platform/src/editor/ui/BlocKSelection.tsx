import { useState, Fragment, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import { typeToClassName, typeToStyle } from "shared/converters/usj/usj.util";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, DEPRECATED_$isGridSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createParaNode } from "shared/nodes/scripture/usj/ParaNode";
// import { CheckIcon } from "@heroicons/react/20/solid";

export type BlockTypeToBlockNames = typeof blockTypeToBlockNames;

const commonBlockTypeToBlockNames = {
  "para:b": "b - Poetry - Stanza Break (Blank Line)",
  "para:m": "m - Paragraph - Margin - No First Line Indent",
  "para:ms": "ms - Heading - Major Section Level 1",
  "para:nb": "nb - Paragraph - No Break with Previous Paragraph",
  "para:p": "p - Paragraph - Normal - First Line Indent",
  "para:pi": "pi - Paragraph - Indented - Level 1 - First Line Indent",
  "para:q1": "q1 - Poetry - Indent Level 1",
  "para:q2": "q2 - Poetry - Indent Level 2",
  "para:r": "r - Heading - Parallel References",
  "para:s": "s - Heading - Section Level 1",
};

// This list is incomplete.
const blockTypeToBlockNames = {
  ...commonBlockTypeToBlockNames,
  "para:ide": "ide - File - Encoding",
  "para:h": "h - File - Header",
  "para:h1": "h1 - File - Header",
  "para:h2": "h2 - File - Left Header",
  "para:h3": "h3 - File - Right Header",
  "para:toc1": "toc1 - File - Long Table of Contents Text",
  "para:toc2": "toc2 - File - Short Table of Contents Text",
  "para:toc3": "toc3 - File - Book Abbreviation",
  "para:cl": "cl - Chapter - Publishing Label",
  "para:mt": "mt - Title - Major Title Level 1",
  "para:mt1": "mt1 - Title - Major Title Level 1",
  "para:mt2": "mt2 - Title - Major Title Level 2",
  "para:mt3": "mt3 - Title - Major Title Level 3",
  "para:mt4": "mt4 - Title - Major Title Level 4",
  "para:ms1": "ms1 - Heading - Major Section Level 1",
  "para:ms2": "ms2 - Heading - Major Section Level 2",
  "para:ms3": "ms3 - Heading - Major Section Level 3",
};

function blockTypeToClassName(blockType: string) {
  return blockType in blockTypeToBlockNames ? typeToClassName(blockType) : "ban";
}

function blockFormatLabel(blockType: string) {
  return blockType in blockTypeToBlockNames
    ? blockTypeToBlockNames[blockType as keyof BlockTypeToBlockNames]
    : "No Style";
}

export function BlocKSelection() {
  const [editor] = useLexicalComposerContext();
  const [selectedBlock, setSelectedBlock] = useState("");
  const [query, setQuery] = useState("");

  function handleSelection(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    console.log("asd", event.target.value);
    // formatPara(event.target.value);
  }

  const formatPara = (selectedBlockType: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
        $setBlocksType(selection, () => $createParaNode(typeToStyle(selectedBlockType)));
      }
    });
  };
  useEffect(() => {
    formatPara(selectedBlock);
  }, [selectedBlock]);

  const filteredBlockTypes =
    query === ""
      ? Object.keys(blockTypeToBlockNames)
      : Object.keys(blockTypeToBlockNames).filter((blockType) => {
          return blockType.toLowerCase().includes(query.toLowerCase());
        });
  console.log({ selectedBlock });
  return (
    // <div>BLOCK SELECTION</div>
    <Combobox value={selectedBlock} onChange={setSelectedBlock}>
      <Combobox.Input
        onChange={handleSelection}
        // displayValue={(person: Person) => person.name}
      />
      <Combobox.Options>
        {filteredBlockTypes.map((blockType, key) => (
          /* Use the `active` state to conditionally style the active option. */
          /* Use the `selected` state to conditionally style the selected option. */
          <Combobox.Option key={key} value={blockType} as={Fragment}>
            {({ active }) => (
              <li className="text dropdown-button-text">
                {/* {selected && <CheckIcon />} */}
                {blockType}
              </li>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
