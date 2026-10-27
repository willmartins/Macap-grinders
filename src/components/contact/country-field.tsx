"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { filterCountries, type Country } from "@/lib/countries";

export function CountryField({
  id,
  error,
  errorId,
  onChange,
}: {
  id: string;
  error?: string;
  errorId: string;
  onChange: (code: string) => void;
}) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const options = useMemo(() => filterCountries(open ? query : ""), [open, query]);
  const selected = options.find((country) => country.code === code);
  const shown = open ? options : [];

  useEffect(() => {
    if (!open) return;
    const option = root.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    option?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function choose(country: Country) {
    setCode(country.code);
    setQuery(country.name);
    setOpen(false);
    onChange(country.code);
  }

  function move(next: number) {
    if (!shown.length) return;
    const count = shown.length;
    setActive((next + count) % count);
  }

  return (
    <div ref={root} className="country-field">
      <input type="hidden" name="country" value={code} />
      <input
        id={id}
        className="field"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && shown[active] ? `${listId}-${shown[active].code}` : undefined}
        aria-required="true"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        autoComplete="country-name"
        placeholder="Start typing a country"
        value={open ? query : selected?.name || query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(0);
          if (code) {
            setCode("");
            onChange("");
          }
        }}
        onFocus={() => {
          setOpen(true);
          setQuery(selected?.name || "");
        }}
        onBlur={() => {
          window.setTimeout(() => {
            setOpen(false);
            if (selected) setQuery(selected.name);
          }, 120);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) setOpen(true);
            else move(active + 1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (open) move(active - 1);
          } else if (event.key === "Home" && open) {
            event.preventDefault();
            setActive(0);
          } else if (event.key === "End" && open) {
            event.preventDefault();
            setActive(Math.max(shown.length - 1, 0));
          } else if (event.key === "Enter" && open && shown[active]) {
            event.preventDefault();
            choose(shown[active]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      <ul id={listId} role="listbox" className="country-list" hidden={!open}>
        {shown.map((country, index) => (
          <li
            key={country.code}
            id={`${listId}-${country.code}`}
            role="option"
            data-index={index}
            aria-selected={country.code === code}
            className={index === active ? "is-active" : undefined}
            onMouseDown={(event) => {
              event.preventDefault();
              choose(country);
            }}
          >
            {country.name}
          </li>
        ))}
        {open && shown.length === 0 ? <li className="country-empty">No country matches.</li> : null}
      </ul>
    </div>
  );
}
