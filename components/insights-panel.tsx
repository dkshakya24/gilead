import { CircleX } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { usePanelStore } from "@/store/InsightsStore";

const insightsData = [
  {
    title: "Social Buzz",
    items: [
      {
        type: "icon",
        image: "/userImage.png",
        name: "Gustavo Franci",
        source: "In X (Twitter)",
        meta: "Social Trends Q1 2025 • 4 Hours ago",
        description:
          "Online discussions around drug pricing have surged by 30% in the last quarter. Hashtags like #FairDrugPrices and #FastTrackApproval are trending on X (Twitter).",
      },
    ],
  },
  {
    title: "Investor Insights",
    items: [
      {
        type: "text-icon",
        image: "/219983.png",
        name: "Gustavo Franci",
        source: "Bloomberg",
        meta: "Bloomberg Biotech Report, 2025",
        description:
          "Venture capital funding for biotech startups specializing in oncology has increased by 25% following the FDAs new approval pathways.",
      },
    ],
  },
  {
    title: "Other Experts",
    items: [
      {
        type: "avatar",
        name: "Gustavo Franci",
        image: "/219983.png",
        source: "Bloomberg",
        meta: "Industry Expert • 4 Hours ago",
        description:
          "With the FDA accelerating approvals for biologics, we're seeing a shift in how quickly innovative treatments reach patients. This could be a game-changer for oncology.",
      },
      {
        type: "avatar",
        name: "Ann Vetrovs",
        image: "/userImage.png",
        source: "Bloomberg",
        meta: "Regulatory Analyst • 2 Days ago",
        description:
          "The EMAs tighter post-market regulations mean pharma companies need to invest more in real-world evidence. Compliance will be a key challenge moving forward.",
      },
    ],
  },
];

export default function InsightsPanel() {
  const { setOpen } = usePanelStore();
  return (
    <div className="w-full max-w-[280px] overflow-hidden">
      <div className="flex items-center justify-between border-b-2 px-4 py-4">
        <h2 className="text-[#666666]">AI Powered Insights</h2>
        <CircleX
          onClick={() => setOpen(false)}
          className="h-5 w-5 text-[#666666] cursor-pointer"
        />
      </div>

      <div className="p-4">
        {insightsData.map((section, idx) => (
          <div key={idx} className="mb-3">
            <h3 className="text-[#27272A] text-xs font-medium mb-3">
              {section.title}
            </h3>
            <div
              className={section.title === "Other Experts" ? "space-y-4" : ""}
            >
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-3 pb-4 ${
                    insightsData.length === idx + 1 &&
                    section.items.length === i + 1
                      ? ""
                      : "border-b-2"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Avatar>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={6}
                        height={6}
                        className="h-full w-full rounded-full"
                      />
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium text-xs text-[#27272A]">
                      {item.name || item.source}
                    </p>
                    <p className="text-xs text-[#666666] mb-2">{item.meta}</p>
                    <p className="text-xs text-[#666666]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
