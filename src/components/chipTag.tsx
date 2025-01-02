import React from "react";
import { Chip } from "@material-tailwind/react";

export default function ChipDismissible({ ele, setData }) {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Chip
        open={open}
        value={ele.value}
        onClose={() => {
          setOpen(false);
          setData((data) => ({
            ...data,
            tags: data.tags.filter((tag) => tag.id != ele.id),
          }));
        }}
      />
    </>
  );
}
