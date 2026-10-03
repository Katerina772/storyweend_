import { useOutletContext } from "react-router-dom";

export function useProjectContext() {
  const context = useOutletContext();
  if (!context?.project) {
    throw new Error("useProjectContext must be used inside ProjectLayout");
  }
  return context.project;
}
