import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";
import { getJoditConfig } from "@/config/joditConfig";

/**
 * Wrapper around JoditEditor that applies the centralised joditConfig
 * and exposes a simple onChange / onBlur API.
 *
 * Security note: JoditEditor performs client-side sanitization via its
 * `sanitizeHTML` option, but the server ALWAYS re-sanitizes on save.
 */
const JoditEditorWrapper = ({
  value,
  onChange,
  onBlur,
  readonly = false,
  height,
}) => {
  const editorRef = useRef(null);

  const config = useMemo(
    () => ({
      ...getJoditConfig(),
      readonly,
      ...(height ? { height } : {}),
    }),
    // Re-create config only when readonly/height change, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [readonly, height],
  );

  return (
    <JoditEditor
      ref={editorRef}
      value={value || ""}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => {
        if (onChange) onChange(newContent);
        if (onBlur) onBlur(newContent);
      }}
      onChange={(newContent) => {
        if (onChange) onChange(newContent);
      }}
    />
  );
};

export default JoditEditorWrapper;
