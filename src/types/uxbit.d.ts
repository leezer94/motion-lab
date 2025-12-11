import type * as React from "react";

type TintoElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
  Record<string, unknown>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "tinto-app-route": TintoElementProps;
      "tinto-section": TintoElementProps;
      "tinto-typography": TintoElementProps;
      "tinto-wrapper": TintoElementProps;
      "tinto-image": TintoElementProps;
      "tinto-button": TintoElementProps;
    }
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "tinto-app-route": TintoElementProps;
        "tinto-section": TintoElementProps;
        "tinto-typography": TintoElementProps;
        "tinto-wrapper": TintoElementProps;
        "tinto-image": TintoElementProps;
        "tinto-button": TintoElementProps;
      }
    }
  }
}

export {};
