import { useState } from "react";
import { CreateUserBtn } from "./CreateUserBtn";
import { CreateUserModal } from "./CreateUserModal";

export const CreateUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <CreateUserBtn
        handleClick={() => {
          setIsOpen(true);
        }}
      />
      <CreateUserModal
        isOpen={isOpen}
        handleClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};
