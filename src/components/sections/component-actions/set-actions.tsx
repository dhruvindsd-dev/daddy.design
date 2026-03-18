"use client";
import { COMPS } from "@/registry";
import useComponentActionsStore from "@/stores/component-actions-store";
import { useEffect } from "react";

interface Props {
  component: COMPS;
  prompt?: string;
  code?: string;
}

const SetComponentActions = ({ component, prompt, code }: Props) => {
  const setActions = useComponentActionsStore((s) => s.setActions);

  useEffect(() => {
    setActions({ component, prompt, code });
  }, [component, prompt, code, setActions]);

  return null;
};

export default SetComponentActions;
