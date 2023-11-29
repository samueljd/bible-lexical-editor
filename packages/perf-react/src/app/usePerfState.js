import { useEffect, useState } from "react";
import { getPerfState } from "shared/contentManager";
import { fetchUsfm } from "shared/contentManager/mockup/fetchUsfm";

export function useLexicalState() {
  const [perfState, setPerfState] = useState(null);
  useEffect(() => {
    // fetchUsfm({
    //   serverName: "dbl",
    //   organizationId: "bfbs",
    //   languageCode: "fra",
    //   versionId: "lsg",
    //   bookCode: "tit",
    // }).then(async (usfm) => {
    //   setLexicalState(await getPerfState(usfm));
    // });
  }, []);

  return perfState;
}
