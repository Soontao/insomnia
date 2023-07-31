import orderedJSON from 'json-order';
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { JSON_ORDER_PREFIX, JSON_ORDER_SEPARATOR } from '../../../common/constants';
import { NUNJUCKS_TEMPLATE_GLOBAL_PROPERTY_NAME } from '../../../templating';
import { CodeEditor, CodeEditorHandle } from '../codemirror/code-editor';

// NeDB field names cannot begin with '$' or contain a period '.'
// Docs: https://github.com/DeNA/nedb#inserting-documents
const INVALID_NEDB_KEY_REGEX = /^\$|\./;

export const ensureKeyIsValid = (key: string, isRoot: boolean): string | null => {
  if (key.match(INVALID_NEDB_KEY_REGEX)) {
    return `"${key}" cannot begin with '$' or contain a '.'`;
  }

  if (key === NUNJUCKS_TEMPLATE_GLOBAL_PROPERTY_NAME && isRoot) {
    return `"${NUNJUCKS_TEMPLATE_GLOBAL_PROPERTY_NAME}" is a reserved key`;
  }

  return null;
};

/**
 * Recursively check nested keys in and immediately return when an invalid key found
 */
export function checkNestedKeys(obj: Record<string, any>, isRoot = true): string | null {
  for (const key in obj) {
    let result: string | null = null;

    // Check current key
    result = ensureKeyIsValid(key, isRoot);

    // Exit if necessary
    if (result) {
      return result;
    }

    // Check nested keys
    if (typeof obj[key] === 'object') {
      result = checkNestedKeys(obj[key], false);
    }

    // Exit if necessary
    if (result) {
      return result;
    }
  }

  return null;
}

export interface EnvironmentInfo {
  object: Record<string, any>;
  propertyOrder: Record<string, any> | null;
}

interface Props {
  environmentInfo: EnvironmentInfo;
  onBlur?: () => void;
  onNameChange?: (name: string) => void;
}

export interface EnvironmentEditorHandle {
  isValid: () => boolean;
  getValue: () => EnvironmentInfo | null;
}

export const EnvironmentEditor = forwardRef<EnvironmentEditorHandle, Props>(({
  environmentInfo,
  onBlur,
  onNameChange,
}, ref) => {
  const editorRef = useRef<CodeEditorHandle>(null);
  const [error, setError] = useState('');
  const getValue = useCallback(() => {
    // @ts-expect-error -- current can be null
    let value = editorRef.current.getValue();
    // convert postman environments
    try {
      const obj = JSON.parse(value);
      if (obj.name && obj.values instanceof Array) {
        const postmanValues = obj.values.reduce((pre: any, cur: { key: string; value: string }) => {
          pre[cur.key] = cur.value; return pre;
        }, {});
        if (onNameChange) {
          onNameChange(`${obj.name} (Migrated From Postman)`);
        }
        value = JSON.stringify(postmanValues, undefined, 2);
        editorRef.current?.setValue(value);
      }
    } catch {

    }
    if (!editorRef.current || !value) {
      return null;
    }
    const json = orderedJSON.parse(
      editorRef.current.getValue(),
      JSON_ORDER_PREFIX,
      JSON_ORDER_SEPARATOR,
    );
    const environmentInfo = {
      object: json.object,
      propertyOrder: json.map || null,
    };
    return environmentInfo;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    isValid: () => !error,
    getValue,
  }), [error, getValue]);

  const defaultValue = orderedJSON.stringify(
    environmentInfo.object,
    environmentInfo.propertyOrder || null,
    JSON_ORDER_SEPARATOR,
  );
  return (
    <div className="environment-editor">
      <CodeEditor
        ref={editorRef}
        autoPrettify
        enableNunjucks
        onChange={() => {
          setError('');
          try {
            const value = getValue();
            // Check for invalid key names
            if (value?.object) {
            // Check root and nested properties
              const err = checkNestedKeys(value.object);
              if (err) {
                setError(err);
              }
            }
          } catch (err) {
            setError(err.message);
          }
        }}
        defaultValue={defaultValue}
        mode="application/json"
        onBlur={onBlur}
      />
      {error && <p className="notice error margin">{error}</p>}
    </div>
  );
});
EnvironmentEditor.displayName = 'EnvironmentEditor';
