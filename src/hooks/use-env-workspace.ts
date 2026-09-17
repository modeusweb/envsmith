"use client";

import { useCallback, useMemo, useReducer } from "react";
import type { EnvVariable, EnvFileStats, ExampleMode, EnvDiff } from "@/types/analysis";
import type { EnvParseError } from "@/types/env";
import { analyzeVariables, countIssues } from "@/lib/env/analyzer";
import { compareEnvs } from "@/lib/env/diff";

export interface WorkspaceState {
  fileName: string;
  fileSize: number;
  loaded: boolean;
  variables: EnvVariable[];
  parseErrors: EnvParseError[];
  exampleFileName: string | null;
  exampleVariables: EnvVariable[];
  mode: ExampleMode;
  includeDescriptions: boolean;
}

type Action =
  | { type: "load-env"; fileName: string; fileSize: number; content: string }
  | { type: "load-example"; fileName: string; content: string }
  | { type: "update-variable"; key: string; patch: Partial<EnvVariable> }
  | { type: "remove-variable"; key: string }
  | { type: "set-mode"; mode: ExampleMode }
  | { type: "set-include-descriptions"; value: boolean }
  | { type: "reset" };

function initialState(): WorkspaceState {
  return {
    fileName: "",
    fileSize: 0,
    loaded: false,
    variables: [],
    parseErrors: [],
    exampleFileName: null,
    exampleVariables: [],
    mode: "smart",
    includeDescriptions: true,
  };
}

function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case "load-env": {
      const { variables, errors } = analyzeVariables(action.content);
      return {
        ...initialState(),
        fileName: action.fileName,
        fileSize: action.fileSize,
        loaded: true,
        variables,
        parseErrors: errors,
      };
    }
    case "load-example": {
      const { variables } = analyzeVariables(action.content, { source: "example", defaultRequired: false });
      return { ...state, exampleFileName: action.fileName, exampleVariables: variables };
    }
    case "update-variable": {
      return {
        ...state,
        variables: state.variables.map((v) => (v.key === action.key ? { ...v, ...action.patch } : v)),
      };
    }
    case "remove-variable": {
      return { ...state, variables: state.variables.filter((v) => v.key !== action.key) };
    }
    case "set-mode":
      return { ...state, mode: action.mode };
    case "set-include-descriptions":
      return { ...state, includeDescriptions: action.value };
    case "reset":
      return initialState();
    default:
      return state;
  }
}

export function useEnvWorkspace() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const loadEnv = useCallback((fileName: string, fileSize: number, content: string) => {
    dispatch({ type: "load-env", fileName, fileSize, content });
  }, []);
  const loadExample = useCallback((fileName: string, content: string) => {
    dispatch({ type: "load-example", fileName, content });
  }, []);
  const updateVariable = useCallback((key: string, patch: Partial<EnvVariable>) => {
    dispatch({ type: "update-variable", key, patch });
  }, []);
  const removeVariable = useCallback((key: string) => {
    dispatch({ type: "remove-variable", key });
  }, []);
  const setMode = useCallback((mode: ExampleMode) => dispatch({ type: "set-mode", mode }), []);
  const setIncludeDescriptions = useCallback(
    (value: boolean) => dispatch({ type: "set-include-descriptions", value }),
    []
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const stats: EnvFileStats = useMemo(
    () => ({
      fileName: state.fileName,
      fileSize: state.fileSize,
      variables: state.variables.length,
      secrets: state.variables.filter(
        (v) => v.classification === "secret" || v.classification === "likely-secret"
      ).length,
      warnings: countIssues(state.variables) + state.parseErrors.length,
    }),
    [state]
  );

  const diff: EnvDiff | null = useMemo(() => {
    if (state.exampleVariables.length === 0) return null;
    return compareEnvs(state.variables, state.exampleVariables);
  }, [state.variables, state.exampleVariables]);

  return {
    state,
    stats,
    diff,
    loadEnv,
    loadExample,
    updateVariable,
    removeVariable,
    setMode,
    setIncludeDescriptions,
    reset,
  };
}
