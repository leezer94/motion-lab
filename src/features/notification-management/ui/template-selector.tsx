"use client";

import { useState } from "react";
import { ChevronDown, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { EmailTemplate, SMSTemplate, NotificationType } from "../model/templates";

type TemplateSelectorProps = {
  type: NotificationType;
  emailTemplates: EmailTemplate[];
  smsTemplates: SMSTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
};

/**
 * 템플릿 선택 컴포넌트
 */
export function TemplateSelector({
  type,
  emailTemplates,
  smsTemplates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const templates = type === "email" ? emailTemplates : smsTemplates;
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition",
          "hover:border-white/20 hover:bg-white/10",
        )}
      >
        <div className="flex items-center gap-3">
          {type === "email" ? (
            <Mail className="h-5 w-5 text-emerald-300" />
          ) : (
            <MessageSquare className="h-5 w-5 text-blue-300" />
          )}
          <div>
            <p className="text-sm font-semibold text-white">
              {selectedTemplate?.name || "템플릿 선택"}
            </p>
            {selectedTemplate && (
              <p className="text-xs text-slate-400">{selectedTemplate.category}</p>
            )}
          </div>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full z-20 mt-2 w-full rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
            <div className="max-h-60 space-y-1 overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    onSelectTemplate(template.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left transition",
                    selectedTemplateId === template.id
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-slate-400">{template.category}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
