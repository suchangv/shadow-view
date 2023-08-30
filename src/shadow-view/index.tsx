import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import ReactDOM, { createPortal } from "react-dom";

export interface ShadowViewProps {
  children?: ReactNode;
  tagName?: string;
}

export interface ShadowViewRef {}

export const ShadowView = React.forwardRef<ShadowViewRef, ShadowViewProps>(
  ({ children, tagName = "shadow-view" }, ref) => {
    const rootRef = useRef<HTMLElement | null>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | undefined>(undefined);

    const onRef = useCallback(
      (root: HTMLElement) => {
        rootRef.current = root;

        if (rootRef.current && !rootRef.current?.shadowRoot) {
          setShadowRoot(rootRef.current?.attachShadow({ mode: "open" }));
        }

        if (typeof ref === "function") {
          ref(root);
        } else if (ref) {
          ref.current = root;
        }
      },
      [ref]
    );

    return React.createElement(tagName, {
      ref: onRef,
      children: shadowRoot ? ReactDOM.createPortal(children, shadowRoot) : null,
    });
  }
);
