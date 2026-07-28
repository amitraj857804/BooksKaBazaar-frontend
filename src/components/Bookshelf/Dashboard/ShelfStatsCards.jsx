import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Flame,
} from "lucide-react";

const stats = [
  {
    title: "Books",
    value: 24,
    subtitle: "Purchased",
    icon: BookOpen,
  },
  {
    title: "PDFs",
    value: 12,
    subtitle: "Downloaded",
    icon: FileText,
  },
  {
    title: "Reading Lists",
    value: 5,
    subtitle: "Collections",
    icon: FolderOpen,
  },
  {
    title: "Reading Streak",
    value: "18",
    subtitle: "Days",
    icon: Flame,
  },
];

export default function ShelfStatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold text-[#0d1117]">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {item.subtitle}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-[#E31E2E] transition-all">
                <Icon
                  className="text-[#E31E2E] group-hover:text-white"
                  size={24}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}