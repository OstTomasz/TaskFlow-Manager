import { LINKEDIN_URL } from "@/constants";

const currentYear = new Date().getFullYear();
export const Footer = () => {
  return (
    <footer className="w-full fixed bottom-0 flex flex-col items-center border-t py-(--space-sm) md:flex-row md:mx-auto md:gap-1 md:justify-center">
      <p>
        &copy; Created by{" "}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Tomasz Ostaszewski
        </a>{" "}
        @{currentYear}.{" "}
      </p>
      <p className="italic text-sm"> All right reserved.</p>
    </footer>
  );
};
