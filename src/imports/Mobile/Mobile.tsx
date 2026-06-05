import svgPaths from "./svg-q236zk8bca";
import imgImage14 from "./b336fb71f2d2247dadd41666e98bffac92058c9f.png";
import imgImage8 from "./dd493b4a4e8707128ad365cb3b63b96d4d074d01.png";
import imgImage9 from "./e38b7eff4ca78c7aaa0c17311f6b9758bc6dae06.png";
import imgImage10 from "./cb9687ee5424ed01a88c043b8675b7371b9d6a72.png";
import imgImage11 from "./3e66c746577193b0d6be648f7cd7b5590972b634.png";
import imgImage13 from "./7df302eb8abcfc114bd55eb4551e42eb33a28ac1.png";

export function MenuIcon() {
  return (
    <button className="block cursor-pointer relative shrink-0 size-[24px]" data-name="Menu icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Menu icon">
          <path d={svgPaths.p15189980} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </button>
  );
}

export function NavTop() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Nav top">
      <div className="content-stretch flex items-start justify-between pb-[50px] pt-[20px] px-[20px] relative size-full">
        <div className="relative shrink-0 size-[38px]" data-name="image 14">
          <img alt="n2ition logo" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage14} />
        </div>
        <MenuIcon />
      </div>
    </div>
  );
}

export default function Mobile() {
  return (
    <div className="bg-white flex flex-col items-center overflow-x-hidden min-h-screen">
      <NavTop />
      {/* ... rest of the components from the first message could go here if needed ... */}
      <div className="p-10 text-center font-['Work_Sans']">
        <h1 className="text-4xl font-bold">Mobile View</h1>
        <p className="text-gray-500 mt-4">Referenced from figma_imported_react_code</p>
      </div>
    </div>
  );
}
