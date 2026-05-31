import { Download, FileImage, FileText } from "lucide-react";
import type { Evidence } from "../../types";
import { formatDate, formatFileSize } from "../../utils/format";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function EvidenceGallery({ items }: { items: Evidence[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        Tidak ada bukti publik untuk transaksi ini.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.fileType.includes("pdf") ? FileText : FileImage;
        return (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-blue-50 p-2 text-trust">
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-slate-950">{item.fileName}</p>
                  <Badge tone={item.visibility === "public" ? "info" : "neutral"}>
                    {item.visibility === "public" ? "Public" : "Internal"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {formatFileSize(item.fileSize)} - {formatDate(item.createdAt)}
                </p>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="secondary" icon={<Download size={16} />} type="button">
              Download
            </Button>
          </article>
        );
      })}
    </div>
  );
}
