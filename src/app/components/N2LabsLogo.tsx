import n2Logo from "../../assets/n2-logo.svg";

type N2LabsLogoProps = {
  /** Visual size preset — concept I dark lockup proportions */
  size?: "sm" | "md" | "lg";
  /** dark = white script (black surfaces); light = black script (light surfaces) */
  variant?: "dark" | "light";
  className?: string;
};

const sizeConfig = {
  sm: { mark: "h-12 w-12", labs: "text-[2rem] mt-1", gap: "gap-3" },
  md: { mark: "h-[4.5rem] w-[4.5rem]", labs: "text-[3.25rem] mt-2", gap: "gap-4" },
  lg: { mark: "h-20 w-20 md:h-[5.25rem] md:w-[5.25rem]", labs: "text-[3.25rem] md:text-[3.625rem] mt-2", gap: "gap-4 md:gap-5" },
} as const;

/**
 * Concept I — official N2 red circle mark + white Kentwell "labs".
 * Built for dark surfaces (Access section).
 */
export function N2LabsLogo({ size = "lg", variant = "dark", className = "" }: N2LabsLogoProps) {
  const config = sizeConfig[size];
  const labsColor = variant === "dark" ? "text-white" : "text-[#231f20]";

  return (
    <div
      className={`inline-flex items-center ${config.gap} ${className}`}
      role="img"
      aria-label="n2 labs"
    >
      <img
        src={n2Logo}
        alt=""
        aria-hidden="true"
        className={`${config.mark} shrink-0 object-contain`}
      />
      <span
        className={`font-['Kentwell'] ${config.labs} leading-none ${labsColor}`}
        aria-hidden="true"
      >
        labs
      </span>
    </div>
  );
}