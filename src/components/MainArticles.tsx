import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";

import { Skeleton } from "./ui/skeleton";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import useCheckLoggedIn from "@/hooks/useCheckLoggedIn";

const MainArticles = () => {
  const [filter, setFilter] = useState<string>("");
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const isLoggedIn = useCheckLoggedIn();

  const { articles, categories, isLoading } = useSelector(
    (state: RootState) => state.articles
  );

  return (
    <div className="relative - h-[92vh] w-full flex items-center justify-between gap-10 px-5 lg:px-15 pb-10 overflow-hidden">
      {/* left sidebar (filter) */}
      <div id="filter-bar" className="hidden lg:block w-2/10 h-full pt-10">
        <Accordion
          type="single"
          collapsible
          className="w-full h-fit-content shadow-md bg-white px-3 rounded-2xl"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-bold">
              Categories
            </AccordionTrigger>
            <AccordionContent className="flex flex-col justify-center gap-1.5 py-0">
              <button
                className={`border-b w-full h-full text-start pb-1 hover:text-slate-500 ${
                  filter === "" ? "text-slate-400" : ""
                }`}
                onClick={() => setFilter("")}
              >
                <span>All</span>
              </button>
              {categories?.map((item, idx) => (
                <button
                  key={idx}
                  className={`border-b w-full h-full text-start pb-1 hover:text-slate-500 ${
                    filter === item.name ? "text-slate-400" : ""
                  }`}
                  onClick={() => setFilter(item.name)}
                >
                  <span>{item.name}</span>
                </button>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="font-bold">
              Published On
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pe-5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {from ? format(from, "d/M/y") : <span>Start Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={from}
                    onSelect={setFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {to ? format(to, "d/M/y") : <span>End Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 truncate" align="start">
                  <Calendar
                    mode="single"
                    selected={to}
                    onSelect={setTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* main content */}
      <div id="main-article-content" className="w-full lg:w-8/10 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center lg:gap-3">
            <h3 className="py-5 font-bold text-2xl lg:text-3xl drop-shadow-sm">
              Articles
            </h3>
            {isLoggedIn && (
              <div className="hidden lg:block">
                <Button
                  onClick={() => navigate("/articles/create")}
                  className="lg:text-2xl aspect-square"
                >
                  +
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-2/3 lg:w-1/3 h-full">
            <Input
              className="bg-white"
              placeholder="Search Title"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="block lg:hidden w-full h-[4vh] gap-3 -mt-2 mb-2 flex flex-nowrap items-center overflow-x-auto no-scrollbar text-sm">
          {isLoggedIn && (
            <button
              onClick={() => navigate("/articles/create")}
              className="aspect-square border h-full w-fit-content rounded-full bg-[#171717] text-white"
            >
              +
            </button>
          )}
          <div
            className={`${
              filter === "" ? "bg-white" : ""
            } border h-full w-fit-content flex items-center px-3 rounded-full`}
            onClick={() => setFilter("")}
          >
            <span className="text-nowrap">All</span>
          </div>
          {categories.map((item, idx) => (
            <div
              key={idx}
              className={`${
                filter === item.name ? "bg-white" : ""
              } border h-full w-fit-content flex items-center px-3 rounded-full`}
              onClick={() => setFilter(item.name)}
            >
              <span className="text-nowrap">{item.name}</span>
            </div>
          ))}
        </div>

        <div
          id="article-list-container"
          className="flex flex-col gap-3 relative h-full w-full overflow-auto no-scrollbar pb-12"
        >
          {isLoading ? (
            // Skeleton Loaders
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="article-card relative flex h-1/5 w-full bg-white rounded-2xl shadow"
                />
              ))}
            </>
          ) : (
            // Filtered and Sorted Articles
            articles
              .filter((item) => (search ? item.title.includes(search) : true))
              .filter((item) =>
                filter ? item.category?.name === filter : true
              )
              .filter((item) => {
                const publishedAt = new Date(item.publishedAt);
                const newTo = to ? new Date(to) : null;

                if (newTo) newTo.setDate(newTo.getDate() + 1);

                if (from && !to) return publishedAt >= from;
                if (!from && newTo) return publishedAt <= newTo;
                if (from && newTo)
                  return publishedAt >= from && publishedAt <= newTo;

                return true;
              })
              .sort(
                (a, b) =>
                  new Date(b.publishedAt).getTime() -
                  new Date(a.publishedAt).getTime()
              )
              .map((item, idx) => (
                <button
                  onClick={() => navigate(`/articles/${item.documentId}`)}
                  key={idx}
                  className="relative flex h-1/5 w-full bg-white rounded-2xl shadow"
                >
                  <img
                    className="w-2/5 lg:w-1/5 aspect-square h-full object-cover p-2 rounded-2xl"
                    src={
                      item.cover_image_url ||
                      "https://asti.dost.gov.ph/pedro/img/no-image.png"
                    }
                  />
                  <div className="w-3/5 lg:w-4/5 flex flex-col justify-between items-start py-3 ps-2">
                    <div className="h-1/5 flex items-center justify-start gap-2 lg:mb-1">
                      <span className="w-fit-content bg-black text-sky-50 px-2 rounded-full text-xs">
                        {item.category?.name || "Article"}
                      </span>
                      <span className="text-xs">
                        {new Date(item.publishedAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    <h5 className="h-1/5 flex items-center font-bold text-base">
                      {item.title}
                    </h5>
                    <p className="h-3/5 w-full overflow-hidden line-clamp-3 text-sm text-justify whitespace-normal pe-5">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainArticles;
