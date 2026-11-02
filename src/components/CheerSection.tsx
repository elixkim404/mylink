"use client";

import React, { useState } from "react";
import { Heart, Send } from "lucide-react";
import { CheerMessage } from "../types/mylink";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CheerSectionProps {
  cheerCount: number;
  cheers: CheerMessage[];
  onAddCheer: (author: string, content: string) => void;
  onCheerClick: () => void;
  hasCheered: boolean;
}

export function CheerSection({
  cheerCount,
  cheers,
  onAddCheer,
  onCheerClick,
  hasCheered,
}: CheerSectionProps) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddCheer(author.trim() || "익명의 응원자", content.trim());
    setContent("");
  };

  return (
    <Card className="p-5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0F2] text-[#F04452]">
            <Heart className="h-4 w-4 fill-current" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-[#191F28]">
              응원 남기기
            </h2>
            <p className="text-[12px] text-[#8B95A1]">
              따뜻한 응원 한마디를 전해주세요
            </p>
          </div>
        </div>

        {/* Cheer Heart Button using shadcn Button */}
        <Button
          variant={hasCheered ? "danger" : "secondary"}
          size="sm"
          onClick={onCheerClick}
          className="h-9 px-3.5 rounded-full"
          title="응원 하트 보내기"
        >
          <Heart
            className={`h-4 w-4 transition-transform ${
              hasCheered ? "fill-[#F04452] text-[#F04452] scale-110" : "text-[#4E5968]"
            }`}
          />
          <span className="tabular-nums font-bold">{cheerCount}</span>
        </Button>
      </div>

      {/* Input Form using shadcn Input & Button */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름 (선택)"
            maxLength={10}
            className="w-24 shrink-0"
          />
          <Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="응원 메시지를 남겨보세요! 🍀"
            maxLength={60}
            className="flex-1"
          />
          <Button
            type="submit"
            size="iconSm"
            className="h-10.5 w-10.5 rounded-xl shrink-0"
            title="응원 등록"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Cheer Message List */}
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-0.5">
        {cheers.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[#E5E8EB]/70 bg-[#F9FAFB] p-3 text-left"
          >
            <div className="flex items-center justify-between text-[11px] text-[#8B95A1] mb-1">
              <span className="font-semibold text-[#333D4B]">{item.author}</span>
              <span className="tabular-nums">{item.time}</span>
            </div>
            <p className="text-[13px] text-[#4E5968] leading-snug">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
