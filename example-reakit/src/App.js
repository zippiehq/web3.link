import React from "react";
import ReactDOM from "react-dom";
import { useDialogState, Dialog, DialogDisclosure } from "reakit/Dialog";

function Example() {
  const dialog = useDialogState();
  return (
    <>
      <DialogDisclosure {...dialog}>Open dialog</DialogDisclosure>
      <Dialog {...dialog} aria-label="Welcome">
        Welcome to Reakit!
      </Dialog>
    </>
  );
}

export default Example;
