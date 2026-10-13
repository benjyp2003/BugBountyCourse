// Learner-safe, synthetic tutorial fixtures. These are not platform API DTOs.
export type LessonState = "Complete" | "Current" | "Available" | "Locked";
export interface LessonSummary {
  id: string;
  title: string;
  detail: string;
  minutes: number;
  state: LessonState;
  href?: string;
}
export interface Week {
  id: string;
  title: string;
  summary: string;
  lessons: LessonSummary[];
}
export interface HttpRequest {
  method: string;
  path: string;
  version: string;
  headers: { name: string; value: string }[];
}
export type RequestPart =
  | "method"
  | "resource"
  | "identifier"
  | "host"
  | "authorization"
  | "accept";
export type LessonBlock =
  | { id: string; type: "hook"; stage: "Hook"; title: string; body: string }
  | {
      id: string;
      type: "observe";
      stage: "Observe";
      title: string;
      body: string;
    }
  | { id: string; type: "think"; stage: "Think"; title: string; body: string }
  | {
      id: string;
      type: "inspect";
      stage: "Inspect";
      title: string;
      body: string;
    }
  | {
      id: string;
      type: "explain";
      stage: "Explain";
      title: string;
      body: string;
    }
  | { id: string; type: "apply"; stage: "Apply"; title: string; body: string };
export interface PrototypeLesson {
  schemaVersion: "prototype-1";
  id: string;
  title: string;
  request: HttpRequest;
  blocks: LessonBlock[];
}
export const week: Week = {
  id: "week-01",
  title: "HTTP & Web Foundations",
  summary: "Learn to read the traffic before you question the system.",
  lessons: [
    {
      id: "browser",
      title: "From browser to server",
      detail: "Follow the journey of a web request.",
      minutes: 8,
      state: "Complete",
    },
    {
      id: "w01-http-request-response",
      title: "Read an HTTP conversation",
      detail: "Separate the resource from the identity requesting it.",
      minutes: 12,
      state: "Current",
      href: "/week-1/read-http",
    },
    {
      id: "headers",
      title: "Headers, cookies & sessions",
      detail: "Trace how a request carries context.",
      minutes: 15,
      state: "Available",
    },
    {
      id: "response",
      title: "Understand the response",
      detail: "Read status codes and response bodies.",
      minutes: 10,
      state: "Locked",
    },
    {
      id: "traffic",
      title: "Inspect browser traffic",
      detail: "Observe a conversation in developer tools.",
      minutes: 15,
      state: "Locked",
    },
    {
      id: "evidence",
      title: "Build an evidence trail",
      detail: "Distinguish an observation from a claim.",
      minutes: 12,
      state: "Locked",
    },
  ],
};
export const lesson: PrototypeLesson = {
  schemaVersion: "prototype-1",
  id: "w01-http-request-response",
  title: "Read an HTTP conversation",
  request: {
    method: "GET",
    path: "/api/orders/418",
    version: "HTTP/1.1",
    headers: [
      { name: "Host", value: "training.invalid" },
      { name: "Authorization", value: "Bearer synthetic-session-a" },
      { name: "Accept", value: "application/json" },
    ],
  },
  blocks: [
    {
      id: "hook",
      type: "hook",
      stage: "Hook",
      title: "One request. Two different questions.",
      body: "You open an order in a training shop. The browser sends this request. Which order does it ask for—and who is asking?",
    },
    {
      id: "observe",
      type: "observe",
      stage: "Observe",
      title: "Read what is actually there.",
      body: "Select a part of the request to examine its role. Start with the request line, then move to the headers.",
    },
    {
      id: "think",
      type: "think",
      stage: "Think",
      title: "Turn an observation into a hypothesis.",
      body: "The path contains an order identifier. If that value changed, what might the browser ask the server for?",
    },
    {
      id: "inspect",
      type: "inspect",
      stage: "Inspect",
      title: "Find the resource selector.",
      body: "Which value identifies the requested order? Select it directly in the request. Use Tab and Enter if you are working with a keyboard.",
    },
    {
      id: "explain",
      type: "explain",
      stage: "Explain",
      title: "Identity is not the resource.",
      body: "Explain the difference between the order identifier and the bearer token. Point to a part of the request as evidence.",
    },
    {
      id: "apply",
      type: "apply",
      stage: "Apply",
      title: "Change one thing. Keep the rest.",
      body: "Prepare a synthetic request for order 419 using the same session. Select the value you would change, then edit it. Nothing is sent to a server.",
    },
  ],
};
export const partNotes: Record<RequestPart, { title: string; body: string }> = {
  method: {
    title: "GET · the method",
    body: "GET asks the server for a representation of a resource. It does not identify a particular order.",
  },
  resource: {
    title: "/api/orders/ · the resource collection",
    body: "This part of the path names the orders endpoint. The following identifier selects an individual order.",
  },
  identifier: {
    title: "418 · the order identifier",
    body: "The identifier in the path selects the requested order. It says nothing about whether the session is allowed to read it.",
  },
  host: {
    title: "Host · the destination",
    body: "training.invalid is a reserved synthetic hostname. It identifies the destination host, not an order or a learner.",
  },
  authorization: {
    title: "Authorization · session context",
    body: "The bearer token supplies an authentication credential. This example uses a fake token. The server still has to check permission to access the requested order.",
  },
  accept: {
    title: "Accept · preferred response format",
    body: "application/json tells the server the client accepts JSON. It describes a format, not the requested object.",
  },
};
export function rawRequest(request: HttpRequest) {
  return `${request.method} ${request.path} ${request.version}\r\n${request.headers.map((h) => `${h.name}: ${h.value}`).join("\r\n")}\r\n\r\n`;
}
