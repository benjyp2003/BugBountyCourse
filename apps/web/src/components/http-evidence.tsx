"use client";
import { useId, useState } from "react";
import {
  rawRequest,
  type HttpRequest,
  type RequestPart,
} from "@/prototype/content";
interface Props {
  request: HttpRequest;
  selected?: RequestPart | null;
  onSelect?: (part: RequestPart) => void;
  label?: string;
}
export function HttpEvidence({
  request,
  selected,
  onSelect,
  label = "REQUEST_01",
}: Props) {
  const [raw, setRaw] = useState(false);
  const id = useId();
  function part(key: RequestPart, value: string, className = "") {
    return onSelect ? (
      <button
        type="button"
        className={`http-part ${className}`}
        aria-label={`Inspect ${value}`}
        aria-pressed={selected === key}
        onClick={() => onSelect(key)}
      >
        {value}
      </button>
    ) : (
      <span className={className}>{value}</span>
    );
  }
  const pathPrefix = request.path.slice(0, request.path.lastIndexOf("/") + 1);
  const identifier = request.path.slice(request.path.lastIndexOf("/") + 1);
  return (
    <section className="http-evidence" aria-labelledby={id}>
      <div className="http-toolbar">
        <h3 id={id}>{label}</h3>
        <div
          className="view-toggle"
          role="group"
          aria-label="Request representation"
        >
          <button aria-pressed={!raw} onClick={() => setRaw(false)}>
            Formatted
          </button>
          <button aria-pressed={raw} onClick={() => setRaw(true)}>
            Raw
          </button>
        </div>
      </div>
      {raw ? (
        <div className="raw-container">
          <pre tabIndex={0} aria-label="Raw HTTP request">
            {rawRequest(request)}
          </pre>
          {onSelect && (
            <p className="raw-hint">
              Switch to Formatted to select a request part.
            </p>
          )}
        </div>
      ) : (
        <div className="http-formatted">
          <div className="http-request-line">
            {part("method", request.method, "method")}
            <code>
              {part("resource", pathPrefix)}
              {part("identifier", identifier, "identifier")}
            </code>
            <span className="http-version">{request.version}</span>
          </div>
          <dl className="http-headers">
            {request.headers.map((header) => (
              <div key={header.name}>
                <dt>{header.name}</dt>
                <dd>
                  {part(
                    header.name === "Host"
                      ? "host"
                      : header.name === "Authorization"
                        ? "authorization"
                        : "accept",
                    header.value,
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <div className="http-caption">
        <span className="evidence-dot" aria-hidden="true" />
        Synthetic capture <span aria-hidden="true">·</span> No request is sent
      </div>
    </section>
  );
}
