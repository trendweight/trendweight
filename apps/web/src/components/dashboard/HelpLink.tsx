import { Link } from "@tanstack/react-router";
import { HiQuestionMarkCircle } from "react-icons/hi";

const HelpLink = () => {
  return (
    <div>
      <Link to="/math" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors italic">
        <HiQuestionMarkCircle className="w-5 h-5" />
        <span>What is all this?</span>
      </Link>
    </div>
  );
};

export default HelpLink;
